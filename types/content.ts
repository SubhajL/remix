export type PlatformType = 'facebook' | 'twitter' | 'linkedin';

export interface GeneratedContent {
  platform: PlatformType;
  content: string;
  prompt: string;
  promptHistory?: string[];
}

export interface PlatformPrompt {
  platform: PlatformType;
  prompt: string;
}

export interface GenerationError {
  message: string;
  details?: string;
  timestamp: string;
} 