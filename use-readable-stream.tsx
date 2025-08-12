import { value } from "happy-dom/lib/PropertySymbol.js";
import { useState, useEffect, useRef } from "react";

export interface StreamState<T> {
  value?: T;
  done: boolean;
  error: unknown;
}

export function useReadableStream<T>(
  stream?: ReadableStream<T>,
  defaultValue?: T,
) {
  const [{ value, done, error }, setState] = useState<StreamState<T>>({
    value: defaultValue,
    done: false,
    error: null,
  });

  useEffect(() => {
    if (!stream) {
      setState({ value: defaultValue, done: false, error: null });
      return;
    }
    const ac = new AbortController();
    setState({ value: defaultValue, done: false, error: null });

    stream.pipeTo(
      new WritableStream({
        write: (chunk) => setState((prev) => ({ ...prev, value: chunk })),
        close: () => setState((prev) => ({ ...prev, done: true })),
        abort: (error) => setState((prev) => ({ ...prev, error })),
      }),
      { signal: ac.signal },
    );

    return () => ac.abort();
  }, [stream]);

  return [value, done, error] as const;
}
