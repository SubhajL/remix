'use client';

import { useState } from 'react';
import { PlatformType, GeneratedContent } from '@/types/content';

interface Props {
  platform: PlatformType;
  generatedContent: GeneratedContent;
  onSubmit: (prompt: string) => Promise<void>;
  onClose: () => void;
}

export default function EditPromptModal({
  platform,
  generatedContent,
  onSubmit,
  onClose
}: Props) {
  const [prompt, setPrompt] = useState(generatedContent.prompt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptHistory = generatedContent.promptHistory || [generatedContent.prompt];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate prompt contains required elements
    if (!prompt.includes('{"content":')) {
      setError('Prompt must include instructions to return JSON with a "content" key');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(prompt);
      console.log('[Prompt Edit] Successfully updated prompt for:', platform);
    } catch (error) {
      console.error('[Prompt Edit] Failed to update prompt:', error);
      setError('Failed to generate content with new prompt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevertPrompt = (historicalPrompt: string) => {
    console.log('[Prompt Edit] Reverting to previous prompt for:', platform);
    setPrompt(historicalPrompt);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Edit {platform} Prompt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm">
          <h3 className="font-medium mb-2">Prompt Guidelines:</h3>
          <ul className="list-disc pl-4 space-y-1">
            <li>Must include instructions to return JSON format</li>
            <li>Include {"{'content': 'your content here'}"} in example</li>
            <li>Keep platform-specific formatting rules</li>
            <li>Maintain character limits for each platform</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[300px] p-3 border rounded-lg font-mono text-sm"
              placeholder="Enter your custom prompt..."
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          {promptHistory.length > 1 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Previous Prompts:</h3>
              <div className="space-y-2">
                {promptHistory.map((historicalPrompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleRevertPrompt(historicalPrompt)}
                    className="text-sm text-blue-600 hover:text-blue-800 block"
                    type="button"
                  >
                    Revert to version {promptHistory.length - index}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Generating...' : 'Save and Regenerate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 