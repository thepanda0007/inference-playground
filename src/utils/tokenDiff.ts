export type DiffLabel = "MATCH" | "ADD" | "REMOVE";

export interface DiffToken {
  label: DiffLabel;
  token: string;
}

export interface ChunkDiff {
  chunkIndex: number;
  chunkA: string;
  chunkB: string;
  diff: DiffToken[];
}

/** Split text into sentence-level chunks */
export function splitIntoChunks(text: string): string[] {
  const chunks = text.trim().split(/(?<=[.!?])\s+/);
  return chunks.filter((c) => c.length > 0);
}

/** Hash-map based token diff — O(n + m) */
export function tokenDiff(chunkA: string, chunkB: string): DiffToken[] {
  const tokensA = chunkA.toLowerCase().split(/\s+/).filter(Boolean);
  const tokensB = chunkB.toLowerCase().split(/\s+/).filter(Boolean);

  // Build frequency map for B
  const freqB: Record<string, number> = {};
  for (const token of tokensB) {
    freqB[token] = (freqB[token] ?? 0) + 1;
  }

  const result: DiffToken[] = [];

  // Walk A — match or remove
  for (const token of tokensA) {
    if (freqB[token] > 0) {
      result.push({ label: "MATCH", token });
      freqB[token]--;
    } else {
      result.push({ label: "REMOVE", token });
    }
  }

  // Remaining in B are additions
  for (const [token, count] of Object.entries(freqB)) {
    for (let i = 0; i < count; i++) {
      result.push({ label: "ADD", token });
    }
  }

  return result;
}

/** Run chunked diff across two full model outputs */
export function chunkedDiff(textA: string, textB: string): ChunkDiff[] {
  const chunksA = splitIntoChunks(textA);
  const chunksB = splitIntoChunks(textB);
  const len = Math.max(chunksA.length, chunksB.length);

  const results: ChunkDiff[] = [];

  for (let i = 0; i < len; i++) {
    const ca = chunksA[i] ?? "";
    const cb = chunksB[i] ?? "";
    results.push({
      chunkIndex: i,
      chunkA: ca,
      chunkB: cb,
      diff: tokenDiff(ca, cb),
    });
  }

  return results;
}

/** Summary stats for the diff */
export interface DiffStats {
  total: number;
  matches: number;
  additions: number;
  removals: number;
  similarityPct: number;
}

export function getDiffStats(chunks: ChunkDiff[]): DiffStats {
  let matches = 0, additions = 0, removals = 0;
  for (const chunk of chunks) {
    for (const t of chunk.diff) {
      if (t.label === "MATCH") matches++;
      else if (t.label === "ADD") additions++;
      else removals++;
    }
  }
  const total = matches + additions + removals;
  const similarityPct = total > 0 ? Math.round((matches / total) * 100) : 100;
  return { total, matches, additions, removals, similarityPct };
}
