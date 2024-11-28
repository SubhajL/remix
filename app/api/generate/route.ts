import { NextResponse } from 'next/server';
import { generateContent } from '@/lib/openai';
import { platformPrompts } from '@/components/prompts/platformPrompts';
import { PlatformType } from '@/types/content';

type RequestBody = {
  content: string;
  platform: PlatformType;
  customPrompt?: string;
};

export async function POST(request: Request) {
  console.log('[API] Received generation request');
  
  try {
    const body = await request.json() as RequestBody;
    console.log('[API] Request body:', {
      platform: body.platform,
      contentLength: body?.content?.length,
      hasCustomPrompt: !!body.customPrompt
    });
    
    const { content, platform, customPrompt } = body;
    
    if (!content) {
      console.error('[API] Missing content in request');
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!platform) {
      console.error('[API] Missing platform in request');
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      );
    }

    console.log(`[API] Using ${customPrompt ? 'custom' : 'default'} prompt for ${platform}`);
    const prompt = customPrompt || platformPrompts[platform];
    
    try {
      console.log('[API] Calling OpenAI generate function');
      const generatedContent = await generateContent(content, prompt);
      console.log('[API] Successfully generated content', {
        platform,
        contentLength: generatedContent.length
      });

      return NextResponse.json({ content: generatedContent });
    } catch (error) {
      console.error('[API] Generation error:', error);
      if (error instanceof Error) {
        console.error('[API] Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      return NextResponse.json(
        { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Request parsing error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
} 