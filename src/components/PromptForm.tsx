import { useState, useRef, useEffect } from "react";

import "../styles/prompt-form.css";

interface Props {
  onSubmit: (query: string) => void;
  onStop: () => void;
  disabled: boolean;
}

// Extend Window type for cross-browser SpeechRecognition
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export default function PromptForm({ onSubmit, onStop, disabled }: Props) {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => !!SpeechRecognition);

  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(
    null,
  );

  // Stable base text — what was in the box before mic started
  const baseTextRef = useRef("");

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true; // keep listening until stopped
    recognition.interimResults = true; // stream partial results live
    recognition.lang = "en-US";

    // Snapshot whatever is already in the textarea
    baseTextRef.current = query;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Final words get committed to the base
      if (finalTranscript) {
        baseTextRef.current = (
          baseTextRef.current +
          " " +
          finalTranscript
        ).trim();
      }

      // Display base + live interim text
      const live = (baseTextRef.current + " " + interimTranscript).trim();
      setQuery(live);
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleMic = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || disabled) return;

    // Stop mic if still running when submitting
    if (listening) stopListening();

    onSubmit(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="prompt-form">
      <div className="textarea-wrapper">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={listening ? "Listening..." : "Ask anything..."}
          rows={3}
        />

        {supported && (
          <button
            className={`mic-button ${listening ? "mic-active" : ""}`}
            onClick={toggleMic}
            disabled={disabled}
            title={listening ? "Stop recording" : "Speak your prompt"}
            type="button"
          >
            {listening ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="9" y="2" width="6" height="11" rx="3" />
                <path
                  d="M5 11a7 7 0 0 0 14 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <line
                  x1="12"
                  y1="18"
                  x2="12"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="8"
                  y1="22"
                  x2="16"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      <button
        onClick={disabled ? onStop : handleSubmit}
        disabled={!disabled && !query.trim()}
        className={disabled ? "stop-button" : ""}
      >
        {disabled ? "⏹ Stop" : "Submit"}
      </button>
    </div>
  );
}
