import { useState } from "react";

import "../styles/prompt-form.css";

interface Props {
  onSubmit: (query: string) => void;
  disabled: boolean;
}

export default function PromptForm({ onSubmit, disabled }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    const trimmed = query.trim();

    if (!trimmed || disabled) return;

    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="prompt-form">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask anything..."
        rows={3}
      />

      <button onClick={handleSubmit} disabled={disabled || !query.trim()}>
        {disabled ? "Streaming..." : "Submit"}
      </button>
    </div>
  );
}
