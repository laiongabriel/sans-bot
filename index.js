import {
   ActivityType,
   Client,
   GatewayIntentBits,
   PermissionsBitField,
} from "discord.js";
import { Countdown } from "./countdown.js";
import "dotenv/config";
import fetch from "node-fetch";

const client = new Client({
   intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
   ],
});

client.on("ready", () => {
   console.log(`The bot ${client.user.username} is ready!`);
   client.user.setPresence({
      activities: [{ name: "!help", type: ActivityType.Listening }],
   });
});

async function translate(text, target) {
   const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}&q=${text}&target=${target}`
   );
   const json = await response.json();
   const translatedText = json.data.translations[0].translatedText;
   return translatedText;
}

async function getQuote() {
   const response = await fetch("https://zenquotes.io/api/random");
   const jsonData = await response.json();

   const quote = jsonData[0]["q"];
   const author = jsonData[0]["a"];

   const translatedQuote = await translate(quote, "pt-BR");
   return `${translatedQuote}\n\n- ${author}`;
}

async function getCat() {
   const response = await fetch("https://cataas.com/cat?json=true");
   const jsonData = await response.json();

   const cat = jsonData.url;
   return "https://cataas.com" + cat;
}

async function getDog() {
   const response = await fetch("https://random.dog/woof.json");
   const jsonData = await response.json();

   const dog = jsonData.url;
   return dog;
}

async function getVerse(book, chapterVerse) {
   const response = await fetch(
      `https://bible-api.com/${book}+${chapterVerse}?translation=almeida`
   );
   const jsonData = await response.json();

   const reference = jsonData.reference;
   const text = jsonData.text;

   return text + "\n\n" + reference;
}

function ferias() {
   const UfraEndOfSemester = new Countdown("19 May 2023 23:59:59 GMT-0300");

   return `Faltam ${UfraEndOfSemester.countdown.days} dias e ${UfraEndOfSemester.countdown.hours} horas para o final do semestre! Continue estudando!`;
}

client.on("messageCreate", async (message) => {
   const responses = {
      "!help": () =>
         `Olá, ${message.author.username}!\nComandos legais:\n\n\`!cookie\`: frase inspiradora de autores famosos.\n\`!clean\`: limpa mensagens recentes do chat atual.\n\`!cat\`: imagens aleatórias de gatinhos.\n\`!dog\`: imagens e gifs aleatórios de doguinhos.\n\`!bible\`: versículos da bíblia.\n\nO malvadão ainda está trabalhando em mais comandos.`,
      "!cookie": getQuote,
      "!cat": getCat,
      "!dog": getDog,
      "!ferias": ferias,
   };

   if (message.content === "oi") {
      if (Math.random() <= 0.2) message.reply("oi BANDIDO");
   } else if (message.content === "perdi") {
      if (Math.random() <= 0.2) message.reply("posso te ajudar a encontrar?");
   } else if (message.content === "mlk") {
      if (Math.random() <= 0.2) message.reply("martin luther king?");
   }

   if (message.content.startsWith("!clean")) {
      // Verifica se o usuário tem permissão para deletar mensagens
      if (
         !message.member.permissions.has(
            PermissionsBitField.Flags.ManageMessages
         )
      ) {
         return message.reply("Você não tem permissão para deletar mensagens.");
      }

      // Separa o comando da quantidade de mensagens a serem deletadas
      const args = message.content.split(" ");
      // Pega a quantidade de mensagens e transforma em número
      const numMessages = Number(args[1]);

      if (isNaN(numMessages) || numMessages <= 0) {
         return message.reply(
            "Forneça um número válido de mensagens a serem deletadas.\nExemplo: `!clean 5`."
         );
      } else if (numMessages > 99) {
         return message.reply(
            "Você só pode deletar no máximo 99 mensagens de uma vez."
         );
      }

      await message.channel.bulkDelete(numMessages + 1, true);
      await message.channel.send(`${numMessages} mensagens foram deletadas!`);
   }

   if (message.content.startsWith("!bible")) {
      const args = message.content.split(" ");
      if (args.length < 3) {
         message.reply(
            "Defina o livro, capítulo e versículo.\nExemplo: `!bible genesis 1:1`."
         );
         return;
      }
      const book = args[1];
      const chapterVerse = args[2];

      message.reply(await getVerse(book, chapterVerse));
   }

   const finalMessage = message.content.toLowerCase();

   if (responses[finalMessage]) {
      message.reply(await responses[finalMessage]());
   }
});

client.login(process.env.TOKEN);
