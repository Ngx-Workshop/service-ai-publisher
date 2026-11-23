const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const {
  mkdtemp,
  mkdir,
  copyFile,
  writeFile,
  readFile,
  rm,
  access,
} = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { test } = require('node:test');

const root = resolve(__dirname, '..');

function run(cwd, command, args, env = {}, expected = 0) {
  const result = spawnSync(command, args, {
    cwd,
    env: { ...process.env, CI: '', NODE_ENV: '', HUSKY: '', ...env },
    encoding: 'utf8',
    timeout: 180000,
  });
  assert.equal(result.error, undefined);
  if (expected === 0) {
    assert.equal(
      result.status,
      0,
      `${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`
    );
  } else {
    assert.notEqual(result.status, 0, `${command} unexpectedly succeeded`);
  }
  return result.stdout.trim();
}

async function fixture(git) {
  const directory = await mkdtemp(join(tmpdir(), 'publisher-maintenance-'));
  try {
    await mkdir(join(directory, '.husky'));
    await mkdir(join(directory, 'src'));
    await mkdir(join(directory, 'test'));
    await writeFile(
      join(directory, 'test/example.ts'),
      'export const fixture = true;\n'
    );
    for (const file of [
      '.gitignore',
      'package.json',
      'package-lock.json',
      '.prettierrc',
      '.prettierignore',
      'lint-staged.config.mjs',
      '.husky/pre-commit',
    ])
      await copyFile(join(root, file), join(directory, file));
    if (git) {
      run(directory, 'git', ['init', '--quiet']);
      run(directory, 'git', ['config', 'user.name', 'Hook Test']);
      run(directory, 'git', [
        'config',
        'user.email',
        'hook-test@example.invalid',
      ]);
      run(directory, 'git', ['config', 'commit.gpgsign', 'false']);
    }
    return directory;
  } catch (error) {
    await rm(directory, { recursive: true, force: true });
    throw error;
  }
}

test('developer installation, real commits, partial staging and non-mutating CI gate', async () => {
  const directory = await fixture(true);
  try {
    run(directory, 'npm', ['ci', '--no-audit', '--no-fund']);
    assert.equal(
      run(directory, 'git', ['config', '--get', 'core.hooksPath']),
      '.husky/_'
    );
    const original =
      Array.from(
        { length: 20 },
        (_, i) => `export const value${i} = ${i};`
      ).join('\n') + '\n';
    await writeFile(join(directory, 'src/example.ts'), original);
    run(directory, 'npm', ['run', 'format:check'], { CI: 'true' });
    run(directory, 'git', [
      'add',
      'src/example.ts',
      '.husky',
      'lint-staged.config.mjs',
      '.prettierrc',
      '.prettierignore',
    ]);
    run(directory, 'git', ['commit', '--quiet', '-m', 'fixture baseline'], {
      HUSKY: '0',
    });
    await writeFile(
      join(directory, 'src/example.ts'),
      original.replace('value0 = 0', 'value0={answer:42}')
    );
    run(directory, 'git', ['add', 'src/example.ts']);
    await writeFile(
      join(directory, 'src/example.ts'),
      original.replace('value0 = 0', 'value0={answer:42}') +
        '// unstaged canary\n'
    );
    await writeFile(
      join(directory, 'src/unstaged.ts'),
      'export const untouched={canary:42};\n'
    );
    run(directory, 'git', ['commit', '--quiet', '-m', 'format staged content']);
    const committed = run(directory, 'git', ['show', 'HEAD:src/example.ts']);
    assert.match(committed, /value0 = \{ answer: 42 \};/);
    assert.doesNotMatch(committed, /unstaged canary/);
    assert.match(
      await readFile(join(directory, 'src/example.ts'), 'utf8'),
      /unstaged canary/
    );
    assert.equal(
      await readFile(join(directory, 'src/unstaged.ts'), 'utf8'),
      'export const untouched={canary:42};\n'
    );

    const before = await readFile(join(directory, 'src/unstaged.ts'), 'utf8');
    run(directory, 'npm', ['run', 'format:check'], { CI: 'true' }, 1);
    assert.equal(
      await readFile(join(directory, 'src/unstaged.ts'), 'utf8'),
      before
    );
    const head = run(directory, 'git', ['rev-parse', 'HEAD']);
    await writeFile(
      join(directory, 'src/broken.ts'),
      'export const broken = ;\n'
    );
    run(directory, 'git', ['add', 'src/broken.ts']);
    run(directory, 'git', ['commit', '--quiet', '-m', 'must fail'], {}, 1);
    assert.equal(run(directory, 'git', ['rev-parse', 'HEAD']), head);
    assert.equal(
      await readFile(join(directory, 'src/broken.ts'), 'utf8'),
      'export const broken = ;\n'
    );
    await mkdir(join(directory, 'contracts'));
    await writeFile(
      join(directory, 'contracts/generated.ts'),
      'export const generated={answer:42};\n'
    );
    run(directory, 'node_modules/.bin/prettier', [
      '--write',
      'contracts/generated.ts',
    ]);
    assert.equal(
      await readFile(join(directory, 'contracts/generated.ts'), 'utf8'),
      'export const generated={answer:42};\n'
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

for (const [name, git, args, env] of [
  ['CI with Git', true, [], { CI: 'true' }],
  ['Docker-style package-only without Git or hook files', false, [], {}],
  [
    'production with Git and omitted devDependencies',
    true,
    ['--omit=dev'],
    { NODE_ENV: 'production' },
  ],
]) {
  test(`clean npm ci: ${name}`, async () => {
    const directory = await fixture(git);
    try {
      if (!git) {
        await rm(join(directory, '.husky'), { recursive: true, force: true });
        await rm(join(directory, 'lint-staged.config.mjs'));
        await rm(join(directory, '.prettierrc'));
        await rm(join(directory, '.prettierignore'));
        await rm(join(directory, '.gitignore'));
        await rm(join(directory, 'src'), { recursive: true, force: true });
        await rm(join(directory, 'test'), { recursive: true, force: true });
      }
      run(directory, 'npm', ['ci', '--no-audit', '--no-fund', ...args], env);
      await assert.rejects(access(join(directory, '.husky/_')));
      if (args.includes('--omit=dev'))
        await assert.rejects(access(join(directory, 'node_modules/husky')));
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
