import Countdown from "./countdown.js";
import { PermissionsBitField } from "discord.js";

export function getHelp(message) {
   return `Olá, ${message.author.username}!\nComandos legais:\n\n\`!cookie\`: frase inspiradora de autores famosos.\n\`!clean\`: limpa mensagens recentes do chat atual.\n\`!cat\`: imagens aleatórias de gatinhos.\n\`!dog\`: imagens e gifs aleatórios de doguinhos.\n\`!bible\`: versículos da bíblia.\n\`!wiki <termo>\`: leia um resumo da wikipédia.\n\`% <mensagem>\`: pergunte algo à inteligência artificial (não é o ChatGPT).\n\nO malvadão ainda está trabalhando em mais comandos.`;
}

export function ferias() {
   const UfraEndOfSemester = new Countdown("19 May 2023 23:59:59 GMT-0300");

   return `Faltam ${UfraEndOfSemester.countdown.days} dias e ${UfraEndOfSemester.countdown.hours} horas para o final do semestre. Continue estudando!`;
}

async function translate(text, target) {
   const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}&q=${text}&target=${target}`
   );
   const json = await response.json();
   const translatedText = json.data.translations[0].translatedText;
   return translatedText;
}

export async function getQuote() {
   const response = await fetch("https://zenquotes.io/api/random");
   const jsonData = await response.json();

   const quote = jsonData[0]["q"];
   const author = jsonData[0]["a"];

   const translatedQuote = await translate(quote, "pt-BR");
   return `${translatedQuote}\n\n- ${author}`;
}

export async function getCat() {
   const response = await fetch("https://cataas.com/cat?json=true");
   const jsonData = await response.json();

   const cat = jsonData.url;
   return "https://cataas.com" + cat;
}

export async function getDog() {
   const response = await fetch("https://random.dog/woof.json");
   const jsonData = await response.json();

   const dog = jsonData.url;
   return dog;
}

export async function clean(message) {
   if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      message.reply("Você não tem permissão para deletar mensagens.");
      return;
   }

   const args = message.content.split(" ");
   const numMessages = Number(args[1]);

   if (isNaN(numMessages) || numMessages <= 0) {
      message.reply("Forneça um número válido de mensagens a serem deletadas.\nExemplo: `!clean 5`.");
      return;
   } else if (numMessages > 99) {
      message.reply("Você só pode deletar no máximo 99 mensagens de uma vez.");
      return;
   }

   await message.channel.bulkDelete(numMessages + 1, true);
   await message.channel.send(`${numMessages} mensagens foram deletadas!`);
}

export async function getVerse(message) {
   const args = message.content.split(" ");
   if (args.length < 3) {
      message.reply("Defina o livro, capítulo e versículo.\nExemplo: `!bible genesis 1:1`.");
      return;
   }
   const book = args[1];
   const chapterVerse = args[2];

   const response = await fetch(`https://bible-api.com/${book}+${chapterVerse}?translation=almeida`);
   const jsonData = await response.json();

   const reference = jsonData.reference;
   const text = jsonData.text;

   if (!text || !reference) return "Não consegui encontrar. Você digitou corretamente?";
   else return text + "\n\n" + reference;
}

export async function getWiki(message) {
   const argArray = message.content.split(" ").slice(1);
   const expression = argArray.join("_");

   const resolve = await fetch(`https://pt.wikipedia.org/api/rest_v1/page/summary/${expression}`);
   const jsonData = await resolve.json();
   const summary =
      (jsonData && jsonData.extract) ||
      `Não consegui encontrar o termo "${argArray.join(" ")}". Você digitou corretamente?`;
   return summary;
}
