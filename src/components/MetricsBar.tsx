import type { ModelMetrics } from "../types/stream";
import "../styles/metrics-bar.css";

interface Props {
  metrics: ModelMetrics;
  accent: string;
  streaming: boolean;
}

export default function MetricsBar({ metrics, accent, streaming }: Props) {
  const { tokenCount, tokensPerSecond, done } = metrics;
  const isActive = streaming && !done;

  return (
    <div
      className={`metrics-bar ${isActive ? "active" : ""} ${done ? "done" : ""}`}
    >
      <div className="metric">
        <span>Tokens: </span>
        <span className="metric-value" style={{ color: accent }}>
          {tokenCount}
        </span>
        <span className="metric-label">tokens</span>

        {isActive && (
          <span className="live-dot" style={{ background: accent }} />
        )}
      </div>

      <div className="metric-divider" />

      <div className="metric">
        <span>Token/s: </span>
        <span className="metric-value" style={{ color: accent }}>
          {tokensPerSecond.toFixed(1)}
        </span>
        <span className="metric-label">tok/s</span>
      </div>
    </div>
  );
}
