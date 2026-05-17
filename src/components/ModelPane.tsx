import StreamDisplay from "./StreamDisplay";

import "../styles/model-pane.css";

interface Props {
  title: string;
  text: string;
  accent: string;
  streaming: boolean;
}

export default function ModelPane({ title, text, accent, streaming }: Props) {
  return (
    <div className="model-pane">
      <div className="model-pane-header">
        <span
          style={{
            color: accent,
          }}
        >
          {title}
        </span>
      </div>

      <StreamDisplay text={text} accent={accent} streaming={streaming} />
    </div>
  );
}
