import type { StreamStatus } from "../types/stream";

export async function streamModel(
  query: string,
  signal: AbortSignal,
  onToken: (model: string, token: string) => void,
  onStatus: (status: StreamStatus, error?: string) => void,
) {
  onStatus("loading");

  let res: Response;

  try {
    res = await fetch(
      "https://streamfrommodels-production.up.railway.app/stream",
      {
        method: "POST",
        signal,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          prompt: query,
        }),
      },
    );
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      return;
    }

    onStatus("error", "Network error");

    return;
  }

  if (!res.ok || !res.body) {
    onStatus("error", `HTTP ${res.status}`);

    return;
  }

  onStatus("streaming");

  const reader = res.body.getReader();

  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const event of events) {
      const dataLine = event
        .split("\n")
        .find((line) => line.startsWith("data:"));

      if (!dataLine) continue;

      const raw = dataLine.replace("data:", "").trim();

      if (raw === "[DONE]") continue;

      try {
        const parsed = JSON.parse(raw);

        onToken(parsed.model, parsed.text);
      } catch {
        // malformed chunk
      }
    }
  }

  onStatus("done");
}
