import { z } from 'zod';
export const sectionIdSchema = z.string().trim().min(1).max(120);
export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
const label = z.string().max(2000);
const comparatorSchema = z.strictObject({
  kind: z.enum([
    'deepEqual',
    'strictEqual',
    'numberTolerance',
    'stringNormalized',
    'custom',
  ]),
  tolerance: z.number().optional(),
  normalizeWhitespace: z.boolean().optional(),
  ignoreCase: z.boolean().optional(),
  customComparatorId: z.string().optional(),
});
// HTTP JSON is already parsed; unknown values here preserve service-owned test data.
export const sampleTestSchema = z.strictObject({
  name: label,
  kind: z.enum(['io', 'unit']),
  input: z.unknown().optional(),
  expected: z.unknown().optional(),
  comparator: comparatorSchema.optional(),
  testCode: z.string().max(50000).optional(),
  framework: z.enum(['jest', 'vitest']).optional(),
});
