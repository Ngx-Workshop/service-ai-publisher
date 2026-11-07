import { isAxiosError } from 'axios';

const messages: Record<string, string> = {
  LAB_PREFLIGHT_NOT_DEPLOYED:
    'The coding-labs service has no preflight endpoint (HTTP 404). Deploy service-coding-labs with POST /lab-preflight, then validate this draft again. This is a service rollout issue, not a failed lab test.',
  LAB_PREFLIGHT_ACCESS_DENIED:
    'The coding-labs service denied administrator verification (HTTP 401/403). Sign in again; if it persists, check authentication between the gateway and coding-labs service.',
  LAB_PREFLIGHT_REJECTED:
    'The coding-labs service rejected the verification request (HTTP 400). Check the lab content and the deployed preflight contract. No test result was returned.',
  LAB_PREFLIGHT_TOO_LARGE:
    'The coding-labs service rejected the verification request size (HTTP 413). Reduce the lab payload or review the service request limit.',
  LAB_PREFLIGHT_BUSY:
    'The isolated lab runner is at capacity (HTTP 429). Wait for current checks to finish, then validate this draft again.',
  LAB_PREFLIGHT_RUNNER_UNAVAILABLE:
    'The coding-labs execution service is unavailable (HTTP 503). Ask the service administrator to check Docker and the prepared runner image, then validate this draft again.',
  LAB_PREFLIGHT_TIMEOUT:
    'The coding-labs verification request timed out. Check the execution service before validating again; no reliable test result was returned.',
  LAB_PREFLIGHT_UNAVAILABLE:
    'The gateway could not complete coding-labs verification. Check the service connection and server logs, then validate this draft again. No reliable test result was returned.',
  LAB_PREFLIGHT_INVALID_RESPONSE:
    'The coding-labs service returned an incompatible verification result. Check that the gateway and coding-labs versions agree, then validate this draft again.',

  PREPARATION_REPAIR_UNAVAILABLE:
    'This check cannot be repaired with AI. Run fresh checks after resolving service access, or select a current failed content check.',
  PREPARATION_CONFLICT:
    'Preparation ID belongs to different inputs. Resume the original preparation or start fresh checks.',
  PREPARATION_UNAVAILABLE:
    'Preparation is unavailable or expired. Run checks again before publishing.',
  PREPARATION_BUSY:
    'Preparation is already running. Resume its progress or wait for the current checks.',
  PREPARATION_STALE:
    'The draft changed or has unresolved checks. Run checks again before publishing.',

  MODEL_NOT_CONFIGURED:
    'Draft generation is not configured. Ask the server administrator to configure the model and API key.',
  GENERATION_IMAGE_LOOKUP_FAILED:
    'Draft generation could not load workshop images. Check your administrator session and the uploader service.',
  MODEL_TIMEOUT:
    'The AI model timed out while generating the draft. Try a narrower workshop brief.',
  MODEL_ACCESS_DENIED:
    'The AI provider denied model access. Ask the server administrator to check the API key and model permissions.',
  MODEL_QUOTA_EXHAUSTED:
    'The AI project has no available quota or credits. Check the API project billing before retrying.',
  MODEL_RATE_LIMITED:
    'The AI provider is rate limiting draft generation. Wait a moment and retry.',
  MODEL_REQUEST_REJECTED:
    'The AI provider rejected the generation request. Ask the server administrator to check the model and output format.',
  MODEL_UNAVAILABLE: 'The AI provider is unavailable. Try again later.',
  MODEL_OUTPUT_INCOMPLETE:
    'The AI model did not finish the draft. Try a narrower workshop brief.',
  MODEL_REFUSED:
    'The AI model declined this workshop brief. Revise the brief and retry.',
  GENERATED_DRAFT_INVALID:
    'The AI returned a draft that failed workshop validation. Try a narrower brief or generate again.',
};

export class GenerationError extends Error {
  constructor(
    public readonly code: string,
    public readonly fields: string[] = []
  ) {
    super(messages[code] ?? 'Workshop draft generation failed.');
  }
}

export function modelError(error: unknown): GenerationError {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT')
      return new GenerationError('MODEL_TIMEOUT');
    const status = error.response?.status;
    if (status === 401 || status === 403)
      return new GenerationError('MODEL_ACCESS_DENIED');
    if (status === 429) {
      const body: unknown = error.response?.data;
      const code =
        body &&
        typeof body === 'object' &&
        'error' in body &&
        body.error &&
        typeof body.error === 'object' &&
        'code' in body.error
          ? body.error.code
          : undefined;
      return new GenerationError(
        code === 'insufficient_quota' || code === 'credit_balance_exhausted'
          ? 'MODEL_QUOTA_EXHAUSTED'
          : 'MODEL_RATE_LIMITED'
      );
    }
    if (status === 400) return new GenerationError('MODEL_REQUEST_REJECTED');
  }
  return new GenerationError('MODEL_UNAVAILABLE');
}
