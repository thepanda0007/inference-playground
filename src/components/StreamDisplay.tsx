import { useEffect, useRef } from "react";

interface Props {
  text: string;
  accent: string;
  streaming: boolean;
}

export default function StreamDisplay({ text, accent, streaming }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [text]);

  return (
    <div className="stream-display">
      <div className="stream-content">
        {text || (
          <span className="placeholder">Response will appear here...</span>
        )}

        {streaming && (
          <span
            className="cursor"
            style={{
              background: accent,
            }}
          />
        )}
      </div>

      <div ref={endRef} />
    </div>
  );
}
