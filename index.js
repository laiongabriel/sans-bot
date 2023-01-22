import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { getQuote, getCat, getDog, getVerse, clean, ferias, getWiki, getHelp } from "./functions.js";
import { ask } from "./ai.js";
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

client.on("messageCreate", async (message) => {
   if (message.content === "!help") message.reply(getHelp(message));
   else if (message.content === "!ferias") message.reply(ferias());
   else if (message.content === "!cookie") message.reply(await getQuote());
   else if (message.content === "!cat") message.reply(await getCat());
   else if (message.content === "!dog") message.reply(await getDog());
   else if (message.content.startsWith("!clean")) await clean(message);
   else if (message.content.startsWith("!bible")) message.reply(await getVerse(message));
   else if (message.content.startsWith("!wiki")) message.reply(await getWiki(message));
   else if (message.content.startsWith("%")) message.reply(await ask(message));
   // random
   else if (message.content === "oi") {
      if (Math.random() <= 0.2) message.reply("oi BANDIDO");
   } else if (message.content === "perdi") {
      if (Math.random() <= 0.2) message.reply("posso te ajudar a encontrar?");
   } else if (message.content === "mlk") {
      if (Math.random() <= 0.2) message.reply("martin luther king?");
   }
});

client.login(process.env.TOKEN);
