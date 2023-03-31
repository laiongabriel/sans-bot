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
      const completion = await openai.createChatCompletion({
         model: "gpt-4",
         temperature: 0.7,
         messages: [
            {
               role: "system",
               content:
                  "Your name is Sans. Your creator is called 'Laion', but you don't talk and don't know much about him. You will always answer questions with a bit of sarcasm. Avoid starting your answers with 'Ah', 'Oh' or the like.",
            },
            { role: "user", content: prompt },
         ],
      });
      const answer = completion.data.choices[0].message.content;
      if (!answer)
         return "Desculpe, não consegui encontrar uma resposta para a sua pergunta.";
      else return answer;
   } catch (error) {
      console.log(error);
      return "Desculpe, ocorreu um erro interno. Tente novamente.";
   }
}
