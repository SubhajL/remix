'use client';

import { useState } from 'react';
import EditableContent from './EditableContent';
import EditPromptModal from '@/components/modals/EditPromptModal';
import { GeneratedContent, PlatformType } from '@/types/content';

interface Props {
  generatedContent: GeneratedContent;
  onRegenerateContent: (platform: PlatformType, prompt: string) => Promise<void>;
}

export default function ContentDisplay({ 
  generatedContent,
  onRegenerateContent
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState(generatedContent.content);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium capitalize">
          {generatedContent.platform}
        </h3>
        <div className="space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            Edit Prompt
          </button>
          <button
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Publish
          </button>
        </div>
      </div>
      
      <EditableContent
        content={content}
        onChange={setContent}
      />

      {isModalOpen && (
        <EditPromptModal
          platform={generatedContent.platform}
          generatedContent={generatedContent}
          onSubmit={async (prompt) => {
            await onRegenerateContent(generatedContent.platform, prompt);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
} 