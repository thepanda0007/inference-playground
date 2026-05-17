import { useEffect, useRef } from "react";
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

  // Animate the TPS number smoothly
  const tpsDisplayRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<number | null>(null);
  const currentTpsRef = useRef(0);

  useEffect(() => {
    const target = tokensPerSecond;

    const animate = () => {
      const diff = target - currentTpsRef.current;
      // Ease toward target
      currentTpsRef.current += diff * 0.18;

      if (tpsDisplayRef.current) {
        tpsDisplayRef.current.textContent = currentTpsRef.current.toFixed(1);
      }

      if (Math.abs(diff) > 0.01) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        currentTpsRef.current = target;
        if (tpsDisplayRef.current) {
          tpsDisplayRef.current.textContent = target.toFixed(1);
        }
      }
    };

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [tokensPerSecond]);

  return (
    <div
      className={`metrics-bar ${isActive ? "active" : ""} ${done ? "done" : ""}`}
    >
      {/* Token Count */}
      <div className="metric">
        <span>Tokens: </span>
        <span className="metric-value" style={{ color: accent }}>
          {tokenCount}
        </span>
        <span className="metric-label">tokens</span>

        {/* Pulse dot while streaming */}
        {isActive && (
          <span className="live-dot" style={{ background: accent }} />
        )}
      </div>

      <div className="metric-divider" />

      {/* Tokens per second */}
      <div className="metric">
        <span>Token/s</span>
        <span className="metric-value" style={{ color: accent }}>
          <span ref={tpsDisplayRef}>0.0</span>
        </span>
        <span className="metric-label">tok/s</span>
      </div>
    </div>
  );
}
