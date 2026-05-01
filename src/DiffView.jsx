import { useMemo } from 'react';
import { diffLines } from 'diff';

function buildRows(left, right) {
  const parts = diffLines(left ?? '', right ?? '');
  const rows = [];
  let leftLine = 1;
  let rightLine = 1;

  for (const part of parts) {
    const lines = part.value.split('\n');
    if (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    for (const line of lines) {
      if (part.added) {
        rows.push({ type: 'add', leftNo: '', rightNo: rightLine++, text: line });
      } else if (part.removed) {
        rows.push({ type: 'remove', leftNo: leftLine++, rightNo: '', text: line });
      } else {
        rows.push({ type: 'context', leftNo: leftLine++, rightNo: rightLine++, text: line });
      }
    }
  }

  return rows;
}

export default function DiffView({ left, right }) {
  const rows = useMemo(() => buildRows(left, right), [left, right]);

  const hasChanges = rows.some((r) => r.type !== 'context');

  if (rows.length === 0) {
    return <div className="diff-empty">Nothing to compare.</div>;
  }

  if (!hasChanges) {
    return <div className="diff-empty">No differences found.</div>;
  }

  return (
    <div className="diff" role="table" aria-label="Diff result">
      {rows.map((row, i) => (
        <div key={i} className={`diff-row ${row.type}`} role="row">
          <span className="diff-gutter" role="cell">{row.leftNo}</span>
          <span className="diff-gutter" role="cell">{row.rightNo}</span>
          <span className="diff-marker" role="cell">
            {row.type === 'add' ? '+' : row.type === 'remove' ? '-' : ' '}
          </span>
          <span className="diff-content" role="cell">
            {row.text === '' ? '\u00A0' : row.text}
          </span>
        </div>
      ))}
    </div>
  );
}
