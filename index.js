import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
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

// Executa a função getQuote a cada 6 horas em um canal de texto específico
setInterval(async () => {
   client.channels.cache.get("379384313793216512").send(await getQuote());
}, 6 * 60 * 60 * 1000); // 6 horas em milisegundos

client.on("messageCreate", async (message) => {
   const responses = {
      "!cookie": getQuote,
      "!help": () =>
         `Olá, ${message.author.username}!\nComandos legais:\n\n\`!cookie\`: frase inspiradora de autores famosos.\n\`!clean\`: limpa mensagens recentes do chat atual.\n\nO malvadão ainda está trabalhando em mais comandos.`,
   };

   if (message.content === "oi") {
      if (Math.random() <= 0.2) message.reply("oi LEPROSO");
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

      await message.channel.bulkDelete(numMessages + 1);
      await message.channel.send(`${numMessages} mensagens foram deletadas!`);
   }

   const finalMessage = message.content.toLowerCase();

   if (responses[finalMessage]) {
      message.reply(await responses[finalMessage]());
   }
});

client.login(process.env.TOKEN);
