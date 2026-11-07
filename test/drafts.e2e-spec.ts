import { randomUUID } from 'node:crypto';
import { MongoClient } from 'mongodb';
import { DraftRepository } from '../src/publishing/draft.repository';
import { WorkshopPreparationService } from '../src/publishing/workshop-preparation.service';
import { DraftAgentService } from '../src/publishing/draft-agent.service';
import { PublishingOwnerClient } from '../src/publishing/owner.client';
import { PublisherConfig } from '../src/publisher.config';
import { publishingDraft } from './fixtures/publishing-draft';

const integration = process.env.PUBLISHER_TEST_MONGODB_URI
  ? describe
  : describe.skip;
integration('MongoDB saved workshop drafts', () => {
  const subject = { subject: 'owner', token: 'never-stored' };
  const foreign = { subject: 'other', token: 'other' };
  const database = 'publisher_test_' + randomUUID().replaceAll('-', '');
  let repository: DraftRepository;
  const config = {
    mongoUri: process.env.PUBLISHER_TEST_MONGODB_URI,
    mongoDatabase: database,
    publishing: {},
  } as PublisherConfig;
  const agent = {
    generate: jest.fn(),
    review: jest.fn(),
    models: () => ({ defaultModel: 'test' }),
  };
  const owner = {
    request: jest.fn().mockRejectedValue(new Error('runner unavailable')),
  };
  const service = () =>
    new WorkshopPreparationService(
      agent as unknown as DraftAgentService,
      owner as unknown as PublishingOwnerClient,
      repository
    );
  beforeEach(async () => {
    repository = new DraftRepository(config);
    await repository.onModuleInit();
  });
  afterEach(async () => {
    await repository.onModuleDestroy();
  });
  afterAll(async () => {
    const client = new MongoClient(config.mongoUri!);
    await client.connect();
    await client.db(database).dropDatabase();
    await client.close();
  });
  async function terminal(
    preparations: WorkshopPreparationService,
    id: string
  ) {
    for (let i = 0; i < 200; i++) {
      const report = await preparations.stored(id, subject);
      if (report.status !== 'running') return report;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error('Preparation timed out');
  }
  it('restores private draft and outage provenance in a fresh service without a model call', async () => {
    const preparations = service();
    const id = randomUUID();
    await preparations.startDurable(
      {
        operation: 'check',
        draft: publishingDraft,
        preparationId: id,
        draftId: id,
      },
      subject
    );
    const complete = await terminal(preparations, id);
    expect(
      (
        await preparations.startDurable(
          {
            operation: 'check',
            draft: publishingDraft,
            preparationId: id,
            draftId: id,
          },
          subject
        )
      ).preparationId
    ).toBe(id);
    await expect(
      preparations.startDurable(
        {
          operation: 'check',
          draft: { ...publishingDraft, name: 'Different' },
          preparationId: id,
          draftId: id,
        },
        subject
      )
    ).rejects.toThrow('different inputs');
    expect(complete.status).toBe('complete');
    expect(complete.ready).toBe(false);
    const row = await repository.get(id, subject.subject);
    expect((JSON.parse(row.json) as { name: string }).name).toBe(
      publishingDraft.name
    );
    await expect(repository.get(id, foreign.subject)).rejects.toThrow(
      'unavailable'
    );
    expect(await repository.list(foreign.subject)).toEqual([]);
    const fresh = service();
    expect(await fresh.stored(id, subject)).toEqual(complete);
    expect(
      fresh
        .repairOptions(id, subject)
        .activities.some((row) => row.activityId.includes('lab-'))
    ).toBe(false);
    await expect(fresh.stored(id, foreign)).rejects.toThrow('unavailable');
    await expect(
      fresh.startDurable(
        {
          operation: 'check',
          draft: publishingDraft,
          preparationId: id,
          draftId: randomUUID(),
        },
        foreign
      )
    ).rejects.toThrow('unavailable');
    expect(agent.generate).not.toHaveBeenCalled();
    const record = await repository.loadJob(id, subject.subject);
    expect(JSON.stringify(record)).not.toContain('never-stored');
  });
  it('preserves incomplete source edits, invalidates old evidence and rejects stale tabs and foreign writes', async () => {
    const id = randomUUID();
    await repository.begin(id, subject.subject, randomUUID());
    await repository.checkpoint({
      preparationId: (await repository.get(id, subject.subject)).preparationId!,
      draftId: id,
      subject: subject.subject,
      inputHash: 'hash',
      unavailable: [],
      finished: Date.now(),
      report: {
        preparationId: randomUUID(),
        status: 'complete',
        ready: false,
        createdAt: '',
        updatedAt: new Date().toISOString(),
        repairCount: 0,
        activities: [],
      },
    });
    const saved = await repository.save(
      id,
      subject.subject,
      1,
      '{"name":"Edited",'
    );
    expect(saved.json).toBe('{"name":"Edited",');
    expect(saved.preparationId).toBeUndefined();
    await expect(repository.assertCurrent(id, subject.subject)).rejects.toThrow(
      'changed'
    );
    expect(saved.version).toBe(2);
    await expect(
      repository.save(id, subject.subject, 1, 'overwrite')
    ).rejects.toThrow('another tab');
    await expect(
      repository.save(id, foreign.subject, 2, 'overwrite')
    ).rejects.toThrow('another tab');
    await expect(
      repository.begin(id, subject.subject, randomUUID(), 1)
    ).rejects.toThrow('another tab');
  });
  it('marks interrupted work non-ready on restart, retains the draft and never replays AI', async () => {
    const id = randomUUID();
    await repository.begin(id, subject.subject, id);
    await repository.checkpoint({
      preparationId: id,
      draftId: id,
      subject: subject.subject,
      inputHash: 'hash',
      unavailable: [],
      report: {
        preparationId: id,
        status: 'running',
        ready: false,
        draft: publishingDraft,
        createdAt: '',
        updatedAt: new Date().toISOString(),
        repairCount: 0,
        activities: [
          {
            id: 'review',
            label: 'Review',
            kind: 'review',
            status: 'running',
            detail: '',
          },
        ],
      },
    });
    await repository.onModuleDestroy();
    repository = new DraftRepository(config);
    await repository.onModuleInit();
    const report = await service().stored(id, subject);
    expect(report.status).toBe('failed');
    expect(report.ready).toBe(false);
    expect(report.draft?.name).toBe(publishingDraft.name);
    expect(report.activities[0].status).toBe('failed');
    expect((await repository.get(id, subject.subject)).status).toBe(
      'interrupted'
    );
    expect(agent.generate).not.toHaveBeenCalled();
  });
  it('fails before paid work when persistence is unavailable', async () => {
    const broken = new WorkshopPreparationService(
      agent as unknown as DraftAgentService,
      owner as unknown as PublishingOwnerClient,
      {
        loadJob: () => Promise.reject(new Error('offline')),
      } as unknown as DraftRepository
    );
    await expect(
      broken.startDurable(
        {
          operation: 'generate',
          input: { brief: 'Teach TypeScript', sectionId: 'angular', level: 1 },
        },
        subject
      )
    ).rejects.toThrow('offline');
    expect(agent.generate).not.toHaveBeenCalled();
  });
});
