import StreamDisplay from "./StreamDisplay";
import MetricsBar from "./MetricsBar";

import type { ModelMetrics } from "../types/stream";

import "../styles/model-pane.css";

interface Props {
  title: string;
  text: string;
  accent: string;
  streaming: boolean;
  metrics: ModelMetrics;
}

export default function ModelPane({ title, text, accent, streaming, metrics }: Props) {
  return (
    <div className="model-pane">
      <div className="model-pane-header">
        <span style={{ color: accent }}>{title}</span>

        {streaming && (
          <MetricsBar metrics={metrics} accent={accent} streaming={streaming} />
        )}
      </div>

      <StreamDisplay text={text} accent={accent} streaming={streaming} />
    </div>
  );
}
