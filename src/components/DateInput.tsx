'use client';

import { getTodayString } from '@/lib/catAge';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function DateInput({ value, onChange, error }: DateInputProps) {
  const maxDate = getTodayString();

  return (
    <div className="surface">
      <div className="label">誕生日を入力</div>
      <div className="row">
        <label htmlFor="dob" className="sr-only">
          猫の誕生日
        </label>
        <input
          id="dob"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          max={maxDate}
          autoComplete="bday"
          placeholder="2023-04-01"
          aria-describedby="dobHelp"
          className="w-full h-16 px-6 border-2 border-pink-200 rounded-3xl text-lg text-gray-900 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-35"
        />
      </div>
      {error && (
        <div id="error" className="error text-red-600 text-sm mt-1.5 min-h-[1.2em]" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
}
