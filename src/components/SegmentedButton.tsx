'use client';

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
  return (
    <div className="seg flex gap-2 flex-wrap" role="radiogroup" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`appearance-none border px-3.5 py-2.5 rounded-full cursor-pointer text-sm font-semibold transition-colors ${
            value === option.value
              ? 'border-pink-600 text-white bg-pink-600'
              : 'border-gray-300 bg-white text-gray-900'
          }`}
          data-value={option.value}
          role="radio"
          aria-checked={value === option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
