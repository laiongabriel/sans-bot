import { Configuration, OpenAIApi } from "openai";
import { translate } from "./functions.js";
import "dotenv/config";

const configuration = new Configuration({
   apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

export async function ask(message) {
   const prompt = message.content.slice(2);
   console.log(prompt);
   if (!prompt) {
      return "`% <mensagem>`";
   }
   try {
      const response = await openai.createCompletion({
         model: "text-davinci-003",
         prompt,
         temperature: 0.6,
         max_tokens: 1024,
         top_p: 0.9,
         frequency_penalty: 0.5,
         presence_penalty: 0.5,
         best_of: 1,
      });
      const answer = response.data.choices[0].text;
      if (!answer) return "Desculpe, não consegui encontrar uma resposta para a sua pergunta.";
      else return answer;
   } catch (error) {
      console.log(error);
      return "Desculpe, ocorreu um erro interno. Tente novamente.";
   }
}

export async function getAiImage(message) {
   const prompt = await translate(message.content.slice(5), "en-US");
   console.log(prompt);
   try {
      const response = await openai.createImage({
         prompt,
         size: "512x512",
      });
      const answer = response.data.data[0].url;
      if (!answer) return "Desculpe, não consegui gerar uma imagem para a sua requisição.";
      else return answer;
   } catch (error) {
      console.log(error);
      return "Desculpe, ocorreu um erro interno. Tente novamente.";
   }
}
