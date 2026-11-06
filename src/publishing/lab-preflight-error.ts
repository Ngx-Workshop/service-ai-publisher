import { isAxiosError } from 'axios';
import { GenerationError } from './generation-error';

// Never include owner response bodies, URLs, credentials or generated code.
export function labPreflightError(error: unknown): GenerationError {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
      return new GenerationError('LAB_PREFLIGHT_TIMEOUT');
    switch (error.response?.status) {
      case 400:
        return new GenerationError('LAB_PREFLIGHT_REJECTED');
      case 401:
      case 403:
        return new GenerationError('LAB_PREFLIGHT_ACCESS_DENIED');
      case 404:
        return new GenerationError('LAB_PREFLIGHT_NOT_DEPLOYED');
      case 413:
        return new GenerationError('LAB_PREFLIGHT_TOO_LARGE');
      case 429:
        return new GenerationError('LAB_PREFLIGHT_BUSY');
      case 503:
        return new GenerationError('LAB_PREFLIGHT_RUNNER_UNAVAILABLE');
    }
  }
  return new GenerationError('LAB_PREFLIGHT_UNAVAILABLE');
}
