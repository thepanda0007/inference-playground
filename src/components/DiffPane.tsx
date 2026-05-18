import type { ChunkDiff, DiffStats } from "../utils/tokenDiff";
import "../styles/diff-pane.css";

interface Props {
  title: string;
  accent: string;
  chunks: ChunkDiff[];
  stats: DiffStats;
  side: "a" | "b";
}

export default function DiffPane({ title, accent, chunks, stats, side }: Props) {
  return (
    <div className="diff-pane">
      {/* Header */}
      <div className="diff-pane-header">
        <span className="diff-pane-title" style={{ color: accent }}>
          {title}
        </span>
        <div className="diff-stats">
          <span className="stat-similarity" style={{ color: accent }}>
            {stats.similarityPct}% similar
          </span>
        </div>
      </div>

      {/* Diff content */}
      <div className="diff-content">
        {chunks.map((chunk) => {
          // Build a frequency map of matched tokens from the diff
          const matchFreq: Record<string, number> = {};
          for (const t of chunk.diff) {
            if (t.label === "MATCH") {
              matchFreq[t.token] = (matchFreq[t.token] ?? 0) + 1;
            }
          }

          // Render original text, coloring each word using the match freq map
          const originalText = side === "a" ? chunk.chunkA : chunk.chunkB;
          const words = originalText.split(/\s+/).filter(Boolean);

          return (
            <span key={chunk.chunkIndex} className="diff-chunk">
              {words.map((word, i) => {
                const key = word; // no lowercasing, as per requirement
                let label: "match" | "add" | "remove";

                if (matchFreq[key] > 0) {
                  matchFreq[key]--;
                  label = "match";
                } else {
                  label = side === "a" ? "remove" : "add";
                }

                return (
                  <span key={i} className={`diff-token diff-token--${label}`}>
                    {word}{" "}
                  </span>
                );
              })}
              {chunk.chunkIndex < chunks.length - 1 && " "}
            </span>
          );
        })}
      </div>
    </div>
  );
}
