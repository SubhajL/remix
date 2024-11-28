'use client';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ContentInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label 
        htmlFor="content" 
        className="block text-sm font-medium text-gray-900"
      >
        Original Content
      </label>
      <textarea
        id="content"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Enter your content here..."
      />
    </div>
  );
} 