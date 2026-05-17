import ModelPane from "./ModelPane";

import "../styles/comparison-view.css";

interface Props {
  model1: string;
  model2: string;
  streaming: boolean;
}

export default function ComparisonView({ model1, model2, streaming }: Props) {
  return (
    <div className="comparison-view">
      <ModelPane
        title="Model 1"
        text={model1}
        accent="#7c6af7"
        streaming={streaming}
      />

      <ModelPane
        title="Model 2"
        text={model2}
        accent="#22c5a0"
        streaming={streaming}
      />
    </div>
  );
}
