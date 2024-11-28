'use client';

import { PlatformType } from '@/types/content';

interface Props {
  selectedPlatforms: PlatformType[];
  onChange: (platforms: PlatformType[]) => void;
}

export default function PlatformSelector({ selectedPlatforms, onChange }: Props) {
  const platforms: { id: PlatformType; name: string }[] = [
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'facebook', name: 'Facebook' },
  ];

  const handleChange = (platformId: PlatformType) => {
    const newSelection = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    onChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        Select Platforms
      </label>
      <div className="space-y-2">
        {platforms.map((platform) => (
          <label
            key={platform.id}
            className="flex items-center space-x-2"
          >
            <input
              type="checkbox"
              id={platform.id}
              checked={selectedPlatforms.includes(platform.id)}
              onChange={() => handleChange(platform.id)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-900">{platform.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
} 