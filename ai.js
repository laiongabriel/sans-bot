import { Configuration, OpenAIApi } from "openai";
import "dotenv/config";

const configuration = new Configuration({
   apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export async function ask(message) {
   const prompt = message.content.substring(2);
   console.log(prompt);
   try {
      const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt,
         temperature: 0.6,
         max_tokens: 1024,
         top_p: 0.9,
         frequency_penalty: 0,
         presence_penalty: 0,
      });
      const answer = response.data.choices[0].text;
      return answer;
   } catch (error) {
      console.log(error);
   }
}
