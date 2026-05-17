import { useMemo } from "react";
import DiffPane from "./DiffPane";
import { chunkedDiff, getDiffStats } from "../utils/tokenDiff";
import "../styles/diff-view.css";

interface Props {
  model1: string;
  model2: string;
}

export default function DiffView({ model1, model2 }: Props) {
  const chunks = useMemo(() => chunkedDiff(model1, model2), [model1, model2]);
  const stats = useMemo(() => getDiffStats(chunks), [chunks]);

  return (
    <div className="diff-view">
      <div className="diff-panes">
        <DiffPane
          title="Model 1"
          accent="#7c6af7"
          chunks={chunks}
          stats={stats}
          side="a"
        />
        <DiffPane
          title="Model 2"
          accent="#22c5a0"
          chunks={chunks}
          stats={stats}
          side="b"
        />
      </div>
    </div>
  );
}
