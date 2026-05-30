import React, { useId } from 'react';

// Renders the `diagram` descriptor a generator attaches to a question.
//   { kind: 'line', m, c, xMin, xMax, yMin, yMax, dots }  → coordinate grid
//   { kind: 'poly', verts, labels, unit }                 → labelled shape
// Generators stay pure (plain data); all SVG lives here.

export default function Diagram({ data }) {
  if (!data) return null;
  if (data.kind === 'line') return <LineGraph {...data} />;
  if (data.kind === 'poly') return <PolyShape {...data} />;
  return null;
}

function LineGraph({ m, c, xMin, xMax, yMin, yMax, dots }) {
  const clip = useId();
  const pad = 28, plot = 280;
  const W = plot + pad * 2, H = plot + pad * 2;
  const X = (x) => pad + ((x - xMin) / (xMax - xMin)) * plot;
  const Y = (y) => pad + ((yMax - y) / (yMax - yMin)) * plot;

  const grid = [];
  for (let x = xMin; x <= xMax; x++)
    grid.push(<line key={`gx${x}`} className="grid-minor" x1={X(x)} y1={Y(yMin)} x2={X(x)} y2={Y(yMax)} />);
  for (let y = yMin; y <= yMax; y++)
    grid.push(<line key={`gy${y}`} className="grid-minor" x1={X(xMin)} y1={Y(y)} x2={X(xMax)} y2={Y(y)} />);

  const ticks = [];
  for (let x = xMin; x <= xMax; x++)
    if (x !== 0 && x % 2 === 0) ticks.push(<text key={`tx${x}`} className="tick" x={X(x)} y={Y(0) + 14} textAnchor="middle">{x}</text>);
  for (let y = yMin; y <= yMax; y++)
    if (y !== 0 && y % 2 === 0) ticks.push(<text key={`ty${y}`} className="tick" x={X(0) - 7} y={Y(y) + 4} textAnchor="end">{y}</text>);

  return (
    <svg className="diagram" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`Straight line on a grid, gradient ${m}, crossing the y-axis at ${c}`}>
      <clipPath id={clip}><rect x={pad} y={pad} width={plot} height={plot} /></clipPath>
      <g>{grid}</g>
      <line className="axis" x1={X(xMin)} y1={Y(0)} x2={X(xMax)} y2={Y(0)} />
      <line className="axis" x1={X(0)} y1={Y(yMin)} x2={X(0)} y2={Y(yMax)} />
      {ticks}
      <text className="axis-label" x={X(xMax) - 2} y={Y(0) - 8} textAnchor="end">x</text>
      <text className="axis-label" x={X(0) + 9} y={Y(yMax) + 13} textAnchor="start">y</text>
      <line className="plotline" clipPath={`url(#${clip})`}
        x1={X(xMin)} y1={Y(m * xMin + c)} x2={X(xMax)} y2={Y(m * xMax + c)} />
      {dots.map((d, i) => <circle key={i} className="plotdot" cx={X(d[0])} cy={Y(d[1])} r={5} />)}
    </svg>
  );
}

function PolyShape({ verts, labels }) {
  const pad = 30, box = 250;
  const xs = verts.map((v) => v[0]), ys = verts.map((v) => v[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min(box / (maxX - minX), box / (maxY - minY));
  const drawW = (maxX - minX) * scale, drawH = (maxY - minY) * scale;
  const offX = pad + (box - drawW) / 2, offY = pad + (box - drawH) / 2;
  // cm → px, flipping y so "up" in maths is up on screen
  const px = (v) => [offX + (v[0] - minX) * scale, offY + (maxY - v[1]) * scale];
  const pts = verts.map(px);
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  const W = box + pad * 2, H = box + pad * 2;

  const labelEls = labels.map((lab, i) => {
    const A = pts[i], B = pts[(i + 1) % pts.length];
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    let nx = -(B[1] - A[1]), ny = B[0] - A[0];
    const len = Math.hypot(nx, ny) || 1;
    nx /= len; ny /= len;
    if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; } // push outward
    const known = lab !== null && lab !== undefined;
    return (
      <text key={i} className={`shape-label${known ? '' : ' unknown'}`}
        x={mx + nx * 17} y={my + ny * 17 + 4} textAnchor="middle">{known ? lab : '?'}</text>
    );
  });

  return (
    <svg className="diagram" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Compound shape with labelled sides">
      <polygon className="shape-fill" points={pts.map((p) => p.join(',')).join(' ')} />
      {labelEls}
    </svg>
  );
}
