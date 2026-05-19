/**
 * Pipeline utility for processing form data.
 * A pipeline is a chain of pure functions that transform data step by step:
 * validation → sanitization → transformation → persistence
 *
 * Usage:
 *   const result = await pipe(rawFormData)
 *     .through(validate(schema))
 *     .through(sanitize)
 *     .through(transform)
 *     .through(persist)
 *     .execute();
 */

export type PipelineStep<TIn, TOut> = (
  input: TIn
) => Promise<TOut> | TOut;

export type PipelineResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

class Pipeline<TInitial, TCurrent> {
  private steps: PipelineStep<unknown, unknown>[] = [];
  private initial: TInitial;

  constructor(initial: TInitial, steps: PipelineStep<unknown, unknown>[]) {
    this.initial = initial;
    this.steps = steps;
  }

  through<TNext>(step: PipelineStep<TCurrent, TNext>): Pipeline<TInitial, TNext> {
    return new Pipeline<TInitial, TNext>(this.initial, [
      ...this.steps,
      step as PipelineStep<unknown, unknown>,
    ]);
  }

  async execute(): Promise<PipelineResult<TCurrent>> {
    try {
      let current: unknown = this.initial;
      for (const step of this.steps) {
        current = await step(current);
      }
      return { success: true, data: current as TCurrent };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Pipeline failed";
      return { success: false, error: message };
    }
  }
}

export function pipe<T>(input: T): Pipeline<T, T> {
  return new Pipeline<T, T>(input, []);
}

// ─── Common pipeline steps ─────────────────────────────────────

/** Validate fields are not empty */
export function validateRequired(fields: string[]): PipelineStep<Record<string, unknown>, Record<string, unknown>> {
  return (data) => {
    for (const field of fields) {
      const value = data[field];
      if (value === undefined || value === null || value === "") {
        throw new Error(`Field "${field}" is required`);
      }
    }
    return data;
  };
}

/** Validate numeric fields are positive */
export function validatePositive(fields: string[]): PipelineStep<Record<string, unknown>, Record<string, unknown>> {
  return (data) => {
    for (const field of fields) {
      const num = Number(data[field]);
      if (isNaN(num) || num <= 0) {
        throw new Error(`Field "${field}" must be a positive number`);
      }
    }
    return data;
  };
}

/** Sanitize string fields (trim + strip HTML) */
export function sanitizeStrings(fields: string[]): PipelineStep<Record<string, unknown>, Record<string, unknown>> {
  return (data) => {
    const result = { ...data };
    for (const field of fields) {
      if (typeof result[field] === "string") {
        result[field] = (result[field] as string)
          .trim()
          .replace(/<[^>]*>/g, "");
      }
    }
    return result;
  };
}

/** Transform: parse numeric fields */
export function parseNumbers(fields: string[]): PipelineStep<Record<string, unknown>, Record<string, unknown>> {
  return (data) => {
    const result = { ...data };
    for (const field of fields) {
      result[field] = Number(result[field]);
    }
    return result;
  };
}

/** Transform: parse boolean fields */
export function parseBooleans(fields: string[]): PipelineStep<Record<string, unknown>, Record<string, unknown>> {
  return (data) => {
    const result = { ...data };
    for (const field of fields) {
      result[field] = result[field] === "true" || result[field] === true;
    }
    return result;
  };
}
