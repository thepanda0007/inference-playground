export type StreamStatus = "idle" | "loading" | "streaming" | "done" | "error";

export interface StreamState {
  text: string;
  status: StreamStatus;
  error?: string;
}

export interface Responses {
  model1: string;
  model2: string;
}

export interface ModelMetrics {
  tokenCount: number;
  tokensPerSecond: number;
  startTime: number | null;
  done: boolean;
}

export interface MetricsState {
  model1: ModelMetrics;
  model2: ModelMetrics;
}

export const INITIAL_MODEL_METRICS: ModelMetrics = {
  tokenCount: 0,
  tokensPerSecond: 0,
  startTime: null,
  done: false,
};
