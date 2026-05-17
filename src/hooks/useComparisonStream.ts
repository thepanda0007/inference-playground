import { useRef, useState } from "react";

import type {
  Responses,
  StreamStatus,
  MetricsState,
  ModelMetrics,
} from "../types/stream";
import { INITIAL_MODEL_METRICS } from "../types/stream";

import { streamModel } from "../services/streamModel";

const INITIAL_RESPONSES: Responses = {
  model1: "",
  model2: "",
};

const INITIAL_METRICS: MetricsState = {
  model1: { ...INITIAL_MODEL_METRICS },
  model2: { ...INITIAL_MODEL_METRICS },
};

export function useComparisonStream() {
  const [responses, setResponses] = useState(INITIAL_RESPONSES);
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [metrics, setMetrics] = useState<MetricsState>(INITIAL_METRICS);

  const abortRef = useRef<AbortController | null>(null);

  // Track per-model mutable metrics for TPS calculation (avoids stale closures)
  const metricsRef = useRef<MetricsState>(INITIAL_METRICS);

  const start = async (query: string) => {
    abortRef.current?.abort();

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setResponses(INITIAL_RESPONSES);

    const freshMetrics: MetricsState = {
      model1: { ...INITIAL_MODEL_METRICS },
      model2: { ...INITIAL_MODEL_METRICS },
    };
    metricsRef.current = freshMetrics;
    setMetrics(freshMetrics);

    streamModel(
      query,
      ctrl.signal,

      (model, token) => {
        const now = performance.now();
        const key = model as keyof MetricsState;
        const prev: ModelMetrics = metricsRef.current[key];

        const startTime = prev.startTime ?? now;
        const newCount = prev.tokenCount + 1;
        const elapsedSec = (now - startTime) / 1000;
        const tps = elapsedSec > 0 ? newCount / elapsedSec : 0;

        const updated: ModelMetrics = {
          tokenCount: newCount,
          tokensPerSecond: tps,
          startTime,
          done: false,
        };

        metricsRef.current = {
          ...metricsRef.current,
          [key]: updated,
        };

        setMetrics((prev) => ({ ...prev, [key]: updated }));

        setResponses((prev) => ({
          ...prev,
          [model]: prev[model as keyof Responses] + token,
        }));
      },

      (status) => {
        setStatus(status);

        if (status === "done") {
          // Mark both models as done
          setMetrics((prev) => ({
            model1: { ...prev.model1, done: true },
            model2: { ...prev.model2, done: true },
          }));
        }
      },
    );
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("done");
  };

  return {
    responses,
    status,
    metrics,
    start,
    stop,
  };
}
