import { useRef, useState } from "react";

import type { Responses, StreamStatus } from "../types/stream";

import { streamModel } from "../services/streamModel";

const INITIAL_RESPONSES: Responses = {
  model1: "",
  model2: "",
};

export function useComparisonStream() {
  const [responses, setResponses] = useState(INITIAL_RESPONSES);

  const [status, setStatus] = useState<StreamStatus>("idle");

  const abortRef = useRef<AbortController | null>(null);

  const start = async (query: string) => {
    abortRef.current?.abort();

    const ctrl = new AbortController();

    abortRef.current = ctrl;

    setResponses(INITIAL_RESPONSES);

    streamModel(
      query,
      ctrl.signal,

      (model, token) => {
        setResponses((prev) => ({
          ...prev,

          [model]: prev[model as keyof Responses] + token,
        }));
      },

      (status) => {
        setStatus(status);
      },
    );
  };

  return {
    responses,
    status,
    start,
  };
}
