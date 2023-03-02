module.exports = ask;

const { Configuration, OpenAIApi } = require("openai");
require("dotenv/config");

const configuration = new Configuration({
   apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

async function ask(message) {
   const prompt = message.content.slice(5);
   console.log(prompt);
   if (!prompt) return "`!ask <mensagem>`";
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
      if (!answer)
         return "Desculpe, não consegui encontrar uma resposta para a sua pergunta.";
      else return answer;
   } catch (error) {
      console.log(error);
      return "Desculpe, ocorreu um erro interno. Tente novamente.";
   }
}
