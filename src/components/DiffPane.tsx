import type { ChunkDiff, DiffStats } from "../utils/tokenDiff";
import "../styles/diff-pane.css";

interface Props {
  title: string;
  accent: string;
  chunks: ChunkDiff[];
  stats: DiffStats;
  side: "a" | "b";
}

export default function DiffPane({
  title,
  accent,
  chunks,
  stats,
  side,
}: Props) {
  return (
    <div className="diff-pane">
      {/* Header */}
      <div className="diff-pane-header">
        <span className="diff-pane-title" style={{ color: accent }}>
          {title}
        </span>

        {/* Stats row */}
        <div className="diff-stats">
          <span className="stat-similarity" style={{ color: accent }}>
            {stats.similarityPct}% similar
          </span>
        </div>
      </div>

      {/* Diff content */}
      <div className="diff-content">
        {chunks.map((chunk) => (
          <span key={chunk.chunkIndex} className="diff-chunk">
            {chunk.diff.map((token, i) => {
              if (side === "a" && token.label === "ADD") return null;
              if (side === "b" && token.label === "REMOVE") return null;

              return (
                <span
                  key={i}
                  className={`diff-token diff-token--${token.label.toLowerCase()}`}
                >
                  {token.token}{" "}
                </span>
              );
            })}
            {/* Sentence gap */}
            {chunk.chunkIndex < chunks.length - 1 && " "}
          </span>
        ))}
      </div>
    </div>
  );
}
