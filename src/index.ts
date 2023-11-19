import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const ai = new Ai(env.AI);
		const searchparams = new URL(request.url).searchParams;
		const q = searchparams.get('q');
		const content = q;
		let chat = {
			messages: [
				{
					role: 'user',
					content: content,
				},
			],
			stream: true,
		};
		const stream = await ai.run('@cf/meta/llama-2-7b-chat-fp16', chat);
		return new Response(stream, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/event-stream',
			},
		});
	},
};
