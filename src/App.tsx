import "./styles/global.css";

import "./styles/app.css";

import PromptForm from "./components/PromptForm";

import ComparisonView from "./components/ComparisonView";

import { useComparisonStream } from "./hooks/useComparisonStream";

export default function App() {
  const { responses, status, start } = useComparisonStream();

  const isStreaming = status === "loading" || status === "streaming";

  return (
    <div className="app">
      <div className="header">
        <h1>Model Comparison</h1>

        <p>Responses stream in parallel</p>
      </div>

      <PromptForm onSubmit={start} disabled={isStreaming} />

      <ComparisonView
        model1={responses.model1}
        model2={responses.model2}
        streaming={isStreaming}
      />
    </div>
  );
}
