'use client';

import { useState } from 'react';
import ContentInput from '@/components/create/ContentInput';
import PlatformSelector from '@/components/create/PlatformSelector';
import GenerateButton from '@/components/create/GenerateButton';
import ContentDisplay from '@/components/content/ContentDisplay';
import { GeneratedContent, PlatformType } from '@/types/content';

export default function CreatePage() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);

  const handleGenerate = async (results: GeneratedContent[]) => {
    const resultsWithHistory = results.map(result => ({
      ...result,
      promptHistory: [result.prompt]
    }));
    setGeneratedContent(resultsWithHistory);
  };

  const handleRegenerateContent = async (platform: PlatformType, prompt: string) => {
    try {
      console.log(`[Regenerate] Starting regeneration for ${platform}`);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, customPrompt: prompt })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setGeneratedContent(prev => prev.map(item => {
        if (item.platform === platform) {
          const updatedHistory = [...(item.promptHistory || []), prompt];
          return {
            ...item,
            content: data.content,
            prompt,
            promptHistory: updatedHistory
          };
        }
        return item;
      }));

      console.log(`[Regenerate] Successfully regenerated content for ${platform}`);
    } catch (error) {
      console.error(`[Regenerate] Failed to regenerate content for ${platform}:`, error);
      // TODO: Add error handling UI
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="max-w-3xl">
        <ContentInput 
          value={content}
          onChange={setContent}
        />
        <PlatformSelector 
          selectedPlatforms={selectedPlatforms}
          onChange={setSelectedPlatforms}
        />
        <GenerateButton 
          content={content}
          selectedPlatforms={selectedPlatforms}
          onGenerate={handleGenerate}
        />
      </div>

      {generatedContent.length > 0 && (
        <div className="space-y-6">
          {generatedContent.map((item) => (
            <ContentDisplay
              key={item.platform}
              generatedContent={item}
              onRegenerateContent={handleRegenerateContent}
            />
          ))}
        </div>
      )}
    </div>
  );
} 