import { useMemo } from 'react';
import { diffLines } from 'diff';

function splitLines(value) {
  const lines = value.split('\n');
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function buildUnifiedRows(parts) {
  const rows = [];
  let leftLine = 1;
  let rightLine = 1;

  for (const part of parts) {
    for (const line of splitLines(part.value)) {
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

function buildSideBySideRows(parts) {
  const rows = [];
  let leftLine = 1;
  let rightLine = 1;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (!part.added && !part.removed) {
      for (const line of splitLines(part.value)) {
        rows.push({
          leftType: 'context',
          leftNo: leftLine++,
          leftText: line,
          rightType: 'context',
          rightNo: rightLine++,
          rightText: line,
        });
      }
      continue;
    }

    if (part.removed) {
      const removedLines = splitLines(part.value);
      const next = parts[i + 1];
      const addedLines = next && next.added ? splitLines(next.value) : [];
      if (next && next.added) i++;

      const max = Math.max(removedLines.length, addedLines.length);
      for (let j = 0; j < max; j++) {
        const hasL = j < removedLines.length;
        const hasR = j < addedLines.length;
        rows.push({
          leftType: hasL ? 'remove' : 'empty',
          leftNo: hasL ? leftLine++ : '',
          leftText: hasL ? removedLines[j] : '',
          rightType: hasR ? 'add' : 'empty',
          rightNo: hasR ? rightLine++ : '',
          rightText: hasR ? addedLines[j] : '',
        });
      }
      continue;
    }

    if (part.added) {
      for (const line of splitLines(part.value)) {
        rows.push({
          leftType: 'empty',
          leftNo: '',
          leftText: '',
          rightType: 'add',
          rightNo: rightLine++,
          rightText: line,
        });
      }
    }
  }

  return rows;
}

function markerFor(type) {
  if (type === 'add') return '+';
  if (type === 'remove') return '-';
  return ' ';
}

function UnifiedDiff({ rows }) {
  return (
    <div className="diff diff-unified" role="table" aria-label="Diff result">
      {rows.map((row, i) => (
        <div key={i} className={`diff-row ${row.type}`} role="row">
          <span className="diff-gutter" role="cell">{row.leftNo}</span>
          <span className="diff-gutter" role="cell">{row.rightNo}</span>
          <span className="diff-marker" role="cell">{markerFor(row.type)}</span>
          <span className="diff-content" role="cell">
            {row.text === '' ? '\u00A0' : row.text}
          </span>
        </div>
      ))}
    </div>
  );
}

function SideBySideDiff({ rows }) {
  return (
    <div className="diff diff-split" role="table" aria-label="Diff result">
      {rows.map((row, i) => (
        <div key={i} className="diff-srow" role="row">
          <span className={`diff-gutter ${row.leftType}`} role="cell">{row.leftNo}</span>
          <span className={`diff-marker ${row.leftType}`} role="cell">
            {markerFor(row.leftType)}
          </span>
          <span className={`diff-content ${row.leftType}`} role="cell">
            {row.leftText === '' ? '\u00A0' : row.leftText}
          </span>
          <span className={`diff-gutter ${row.rightType}`} role="cell">{row.rightNo}</span>
          <span className={`diff-marker ${row.rightType}`} role="cell">
            {markerFor(row.rightType)}
          </span>
          <span className={`diff-content ${row.rightType}`} role="cell">
            {row.rightText === '' ? '\u00A0' : row.rightText}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function DiffView({ left, right, mode = 'split' }) {
  const parts = useMemo(() => diffLines(left ?? '', right ?? ''), [left, right]);
  const unifiedRows = useMemo(() => buildUnifiedRows(parts), [parts]);
  const splitRows = useMemo(() => buildSideBySideRows(parts), [parts]);

  if (unifiedRows.length === 0) {
    return <div className="diff-empty">Nothing to compare.</div>;
  }

  const hasChanges = unifiedRows.some((r) => r.type !== 'context');
  if (!hasChanges) {
    return <div className="diff-empty">No differences found.</div>;
  }

  return mode === 'unified' ? (
    <UnifiedDiff rows={unifiedRows} />
  ) : (
    <SideBySideDiff rows={splitRows} />
  );
}
