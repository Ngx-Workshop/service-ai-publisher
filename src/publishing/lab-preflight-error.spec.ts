import { labPreflightError } from './lab-preflight-error';

describe('safe lab preflight diagnostics', () => {
  it.each([
    [400, 'LAB_PREFLIGHT_REJECTED'],
    [401, 'LAB_PREFLIGHT_ACCESS_DENIED'],
    [403, 'LAB_PREFLIGHT_ACCESS_DENIED'],
    [404, 'LAB_PREFLIGHT_NOT_DEPLOYED'],
    [413, 'LAB_PREFLIGHT_TOO_LARGE'],
    [429, 'LAB_PREFLIGHT_BUSY'],
    [503, 'LAB_PREFLIGHT_RUNNER_UNAVAILABLE'],
    [500, 'LAB_PREFLIGHT_UNAVAILABLE'],
  ])('classifies HTTP %s without disclosing owner details', (status, code) => {
    const error = labPreflightError({
      isAxiosError: true,
      response: { status, data: { message: 'private owner details' } },
    });
    expect(error.code).toBe(code);
    expect(error.message).not.toContain('private owner details');
  });
  it('distinguishes timeouts and unknown connection failures', () => {
    expect(
      labPreflightError({ isAxiosError: true, code: 'ECONNABORTED' }).code
    ).toBe('LAB_PREFLIGHT_TIMEOUT');
    expect(labPreflightError(new Error('private credentials')).code).toBe(
      'LAB_PREFLIGHT_UNAVAILABLE'
    );
  });
});
