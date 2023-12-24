import { Ai } from '@cloudflare/ai';

export interface Env {
	AI: any;
}

export default {
	fetch: async (request: Request, env: Env, ctx: ExecutionContext): Promise<Response> => {
		const ai = new Ai(env.AI);
		const searchparams = new URL(request.url).searchParams;
		const q = searchparams.get('q');
		const content = q;
		let chat = {
			prompt: `<s> you are a friendly assistant. </s>\n [INST] ${content} [/INST]`,
			stream: true,
		};
		const stream = await ai.run('@hf/thebloke/orca-2-13b-awq', chat);
		return new Response(stream, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/event-stream',
			},
		});
	},
};
