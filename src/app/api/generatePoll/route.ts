import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';


const configuration = new Configuration({
  apiKey: process.env.CGPT_APIKEY,
});

console.log(process.env.CGPT_APIKEY);

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  try {
    const { topic, objective } = await req.json();
    console.log(topic);

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'user',
        content: `I need a single poll question STRICTLY in JSON format, in a given poll topic and objectives. 
        POLL topic: ${topic}. POLL objectives: ${objective}.
        Please refer to this example: {"question":"What percentage of your workforce is currently working remotely?","Options":["0-25%", "26-50%", "51-75%", "76-100%"]}`,
      },
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 1,
    });

    const result = response.data.choices[0].message?.content || '{}';
    return NextResponse.json({ success: true, poll: JSON.parse(result) });
  } catch (error: unknown) {
    // Safely handle the error by asserting its structure
    if (error instanceof Error) {
      console.error('Error generating poll:', error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ success: false, error: 'An unknown error occurred.' }, { status: 500 });
    }
  }
}
