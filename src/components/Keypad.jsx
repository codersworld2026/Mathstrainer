import React from 'react';

// A simple 4-digit PIN keypad. Calls onComplete(pin) when 4 digits are entered.
export default function Keypad({ value, onChange, onComplete }) {
  const press = (d) => {
    if (value.length >= 4) return;
    const next = value + d;
    onChange(next);
    if (next.length === 4) onComplete?.(next);
  };
  const back = () => onChange(value.slice(0, -1));

  return (
    <div>
      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`pin-dot ${i < value.length ? 'filled' : ''}`} />
        ))}
      </div>
      <div className="keypad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="key" onClick={() => press(String(n))}>{n}</button>
        ))}
        <button className="key blank" tabIndex={-1} />
        <button className="key" onClick={() => press('0')}>0</button>
        <button className="key" onClick={back} aria-label="delete">⌫</button>
      </div>
    </div>
  );
}
