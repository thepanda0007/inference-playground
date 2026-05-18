import { useState, useEffect } from "react";
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

export default function ModelPane({
  title,
  text,
  accent,
  streaming,
  metrics,
}: Props) {
  const [speaking, setSpeaking] = useState(false);

  // Cancel on unmount
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // Cancel if text changes (new run)
  useEffect(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [text]);

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  return (
    <div className="model-pane">
      <div className="model-pane-header">
        <span style={{ color: accent }}>{title}</span>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {streaming && (
            <MetricsBar
              metrics={metrics}
              accent={accent}
              streaming={streaming}
            />
          )}

          <button onClick={handleSpeak} disabled={!text || streaming}>
            {speaking ? "⏹" : "🔊"}
          </button>
        </div>
      </div>

      <StreamDisplay text={text} accent={accent} streaming={streaming} />
    </div>
  );
}
