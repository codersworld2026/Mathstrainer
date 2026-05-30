import React from 'react';

// Reorder UI for the `order` answer type (LO25 / LO28). Up/down controls keep it
// reliable on touch — no drag library, works the same on phone and laptop.
//   items: [{ id, label, value }]   order: array of ids (current arrangement)
export default function OrderList({ items, order, onReorder, disabled, direction }) {
  const byId = Object.fromEntries(items.map((it) => [it.id, it]));

  const move = (idx, dir) => {
    const j = idx + dir;
    if (disabled || j < 0 || j >= order.length) return;
    const next = [...order];
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  };

  return (
    <div className="order-list">
      <div className="order-caption">
        {direction === 'desc' ? 'Largest at the top' : 'Smallest at the top'}
      </div>
      {order.map((id, idx) => (
        <div className="order-row" key={id}>
          <span className="order-rank">{idx + 1}</span>
          <span className="order-label">{byId[id].label}</span>
          <span className="order-arrows">
            <button type="button" className="order-arrow" aria-label="Move up"
              disabled={disabled || idx === 0} onClick={() => move(idx, -1)}>▲</button>
            <button type="button" className="order-arrow" aria-label="Move down"
              disabled={disabled || idx === order.length - 1} onClick={() => move(idx, 1)}>▼</button>
          </span>
        </div>
      ))}
    </div>
  );
}
