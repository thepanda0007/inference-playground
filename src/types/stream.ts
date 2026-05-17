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
