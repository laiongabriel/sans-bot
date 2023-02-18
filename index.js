import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import {
   getQuote,
   getCat,
   getDog,
   getVerse,
   clean,
   ferias,
   getWiki,
   getHelp,
} from "./functions.js";
import { ask, getAiImage } from "./ai.js";
import "dotenv/config";

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

client.on("reconnecting", () => {
   client.user.setPresence({
      activities: [{ name: "!help", type: ActivityType.Listening }],
   });
});

async function sendTypingAndReply(message, reply) {
   message.channel.sendTyping();
   message.reply(await reply);
}

client.on("messageCreate", async (message) => {
   if (message.content === "!help") sendTypingAndReply(message, getHelp(message));
   else if (message.content === "!ferias") sendTypingAndReply(message, ferias());
   else if (message.content === "!cookie") sendTypingAndReply(message, getQuote());
   else if (message.content === "!cat") sendTypingAndReply(message, getCat());
   else if (message.content === "!dog") sendTypingAndReply(message, getDog());
   else if (message.content.startsWith("!clean")) {
      message.channel.sendTyping();
      await clean(message);
   } else if (message.content.startsWith("!bible")) sendTypingAndReply(message, getVerse(message));
   else if (message.content.startsWith("!wiki")) sendTypingAndReply(message, getWiki(message));
   else if (message.content.startsWith("!img")) sendTypingAndReply(message, getAiImage(message));
   else if (message.content.startsWith("%")) sendTypingAndReply(message, ask(message));
   else if (message.content === "oi" && Math.random() <= 0.2)
      sendTypingAndReply(message, "oi BANDIDO");
   else if (message.content === "perdi" && Math.random() <= 0.2)
      sendTypingAndReply(message, "posso te ajudar a encontrar?");
   else if (message.content === "mlk" && Math.random() <= 0.2)
      sendTypingAndReply(message, "martin luther king?");
});

client.login(process.env.TOKEN);
