'use client';

import { useState } from 'react';
import { GeneratedContent, PlatformType } from '@/types/content';
import { platformPrompts } from '@/components/prompts/platformPrompts';

interface Props {
  content: string;
  selectedPlatforms: PlatformType[];
  onGenerate: (results: GeneratedContent[]) => void;
}

export default function GenerateButton({ 
  content,
  selectedPlatforms,
  onGenerate 
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    console.log('[Generate] Starting content generation', {
      platforms: selectedPlatforms,
      contentLength: content.length
    });
    
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('[Generate] Generating content for platforms:', selectedPlatforms);
      const results = await Promise.all(
        selectedPlatforms.map(async (platform) => {
          console.log(`[Generate] Processing platform: ${platform}`);
          try {
            console.log(`[Generate] Making API call for ${platform}`);
            const response = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content, platform })
            });
          
            if (!response.ok) {
              console.error(`[Generate] HTTP error for ${platform}:`, response.status);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
          
            const data = await response.json();
            console.log(`[Generate] Received response for ${platform}`, {
              hasContent: !!data.content,
              contentLength: data.content?.length
            });
            
            if (!data.content) {
              console.error(`[Generate] Invalid response format for ${platform}:`, data);
              throw new Error('Invalid response format from API');
            }

            return {
              platform,
              content: data.content,
              prompt: platformPrompts[platform]
            };
          } catch (error) {
            console.error(`[Generate] Error generating content for ${platform}:`, error);
            return {
              platform,
              content: `Error generating content for ${platform}. Please try again.`,
              prompt: platformPrompts[platform]
            };
          }
        })
      );
      
      console.log('[Generate] Successfully generated all content', {
        resultsCount: results.length,
        platforms: results.map(r => r.platform)
      });
      
      onGenerate(results);
    } catch (error) {
      console.error('[Generate] Generation failed:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
      console.log('[Generate] Generation process completed');
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !content || selectedPlatforms.length === 0}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-50"
      >
        {isGenerating ? 'Generating...' : 'Generate Content'}
      </button>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 