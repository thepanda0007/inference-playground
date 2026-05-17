import ModelPane from "./ModelPane";

import type { MetricsState } from "../types/stream";

import "../styles/comparison-view.css";

interface Props {
  model1: string;
  model2: string;
  streaming: boolean;
  metrics: MetricsState;
}

export default function ComparisonView({ model1, model2, streaming, metrics }: Props) {
  return (
    <div className="comparison-view">
      <ModelPane
        title="Model 1"
        text={model1}
        accent="#7c6af7"
        streaming={streaming}
        metrics={metrics.model1}
      />

      <ModelPane
        title="Model 2"
        text={model2}
        accent="#22c5a0"
        streaming={streaming}
        metrics={metrics.model2}
      />
    </div>
  );
}
