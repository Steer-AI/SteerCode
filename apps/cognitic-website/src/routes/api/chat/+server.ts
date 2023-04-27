import { OPENAI_KEY } from '$env/static/private';
import { getTokens } from '$lib/shared/utils/tokenizer';
import type { Config } from '@sveltejs/adapter-vercel';
import { json } from '@sveltejs/kit';
import type {
  ChatCompletionRequestMessage,
  CreateChatCompletionRequest
} from 'openai';
import type { RequestHandler } from './$types';

export const config: Config = {
  runtime: 'edge'
};

const defaultSystemFallbackPrompt =
  'You are a virtual assistant that helps people with their questions.';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const API_KEY = request.headers.get('x-openai-api-key') || OPENAI_KEY;
    const MODEL = request.headers.get('x-openai-model') || 'gpt-3.5-turbo';
    const TEMPERATURE = request.headers.get('x-openai-temperature') || '0.9';

    if (!API_KEY) {
      throw new Error('Apen AI API key missing');
    }

    const requestData = await request.json();

    if (!requestData) {
      throw new Error('No request data');
    }

    const reqMessages: ChatCompletionRequestMessage[] = requestData.messages;
    const systemPrompt =
      requestData.system_prompt || defaultSystemFallbackPrompt;

    if (!reqMessages) {
      throw new Error('no messages provided');
    }

    let tokenCount = 0;

    tokenCount += getTokens(systemPrompt);

    const messagesToPassToOpenAI: ChatCompletionRequestMessage[] = [];
    for (let i = reqMessages.length - 1; i >= 0; i--) {
      const msg = reqMessages[i];
      const tokens = getTokens(msg.content);
      tokenCount += tokens;

      if (tokenCount >= 4000) {
        break;
      }

      messagesToPassToOpenAI.unshift(msg);
    }

    reqMessages.forEach((msg) => {
      const tokens = getTokens(msg.content);
      tokenCount += tokens;
    });

    const moderationRes = await fetch('https://api.openai.com/v1/moderations', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      method: 'POST',
      body: JSON.stringify({
        input: reqMessages[reqMessages.length - 1].content
      })
    });
    if (!moderationRes.ok) {
      const err = await moderationRes.json();
      throw new Error(err.error.message);
    }

    const moderationData = await moderationRes.json();
    const [results] = moderationData.results;

    if (results.flagged) {
      throw new Error('Query flagged by openai');
    }

    const messages: ChatCompletionRequestMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messagesToPassToOpenAI
    ];

    const chatRequestOpts: CreateChatCompletionRequest = {
      model: MODEL,
      messages,
      temperature: parseFloat(TEMPERATURE),
      stream: true
    };

    const chatResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(chatRequestOpts)
      }
    );

    if (!chatResponse.ok) {
      const err = await chatResponse.json();
      throw new Error(err.error.message);
    }

    return new Response(chatResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream'
      }
    });
  } catch (err) {
    console.error(err);
    return json(
      { error: 'There was an error processing your request' },
      { status: 500 }
    );
  }
};
