import { useState } from "react";
import "./styles/global.css";
import "./styles/app.css";

import PromptForm from "./components/PromptForm";
import ComparisonView from "./components/ComparisonView";
import DiffView from "./components/DiffView";
import { useComparisonStream } from "./hooks/useComparisonStream";

export default function App() {
  const { responses, status, metrics, start, stop } = useComparisonStream();
  const [showDiff, setShowDiff] = useState(false);

  const isStreaming = status === "loading" || status === "streaming";
  const isDone = status === "done";
  const hasResponses = responses.model1.length > 0 && responses.model2.length > 0;

  // Reset diff view when a new query starts
  const handleStart = (query: string) => {
    setShowDiff(false);
    start(query);
  };

  return (
    <div className="app">
      <div className="top-section">
        <div className="header">
          <h1>Model Comparison</h1>
        </div>

        <PromptForm onSubmit={handleStart} onStop={stop} disabled={isStreaming} />

        {/* Show diff toggle only when both responses are ready */}
        {isDone && hasResponses && (
          <div className="diff-toggle-row">
            <button
              className={`diff-toggle-btn ${showDiff ? "active" : ""}`}
              onClick={() => setShowDiff((v) => !v)}
            >
              {showDiff ? (
                <>
                  <span className="diff-toggle-icon">◧</span>
                  View Responses
                </>
              ) : (
                <>
                  <span className="diff-toggle-icon">⬡</span>
                  View Token Diff
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {showDiff ? (
        <DiffView model1={responses.model1} model2={responses.model2} />
      ) : (
        <ComparisonView
          model1={responses.model1}
          model2={responses.model2}
          streaming={isStreaming}
          metrics={metrics}
        />
      )}
    </div>
  );
}
