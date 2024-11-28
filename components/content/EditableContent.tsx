'use client';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export default function EditableContent({ content, onChange }: Props) {
  return (
    <textarea
      value={content}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-h-[100px] p-2 border rounded-lg focus:ring-1 focus:ring-blue-500"
    />
  );
} 