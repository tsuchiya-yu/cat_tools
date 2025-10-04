'use client';

import { useRef } from 'react';

interface SegmentedButtonOption<T> {
  value: T;
  label: string;
}

interface SegmentedButtonProps<T> {
  options: SegmentedButtonOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

export default function SegmentedButton<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: SegmentedButtonProps<T>) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const onKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const key = e.key;
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      const next = (index + 1) % options.length;
      onChange(options[next].value);
      btnRefs.current[next]?.focus();
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      const prev = (index - 1 + options.length) % options.length;
      onChange(options[prev].value);
      btnRefs.current[prev]?.focus();
    } else if (key === ' ') {
      // Space selects the currently focused option
      e.preventDefault();
      onChange(options[index].value);
    }
  };

  return (
    <div className="seg flex gap-2 flex-wrap" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option, i) => {
        const isSelected = value === option.value;
        return (
          <button
            key={option.value}
            ref={(el) => (btnRefs.current[i] = el)}
            type="button"
            className={`appearance-none border px-3.5 py-2.5 rounded-full cursor-pointer text-sm font-semibold transition-colors ${
              isSelected
                ? 'border-pink-600 text-white bg-pink-600'
                : 'border-gray-300 bg-white text-gray-900'
            }`}
            data-value={option.value}
            role="radio"
            aria-checked={isSelected}
            tabIndex={i === currentIndex ? 0 : -1}
            onKeyDown={onKeyDown(i)}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
