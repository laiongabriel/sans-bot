const { Client, GatewayIntentBits } = require("discord.js");
const {
   getQuote,
   getCat,
   getDog,
   getVerse,
   getHelp,
} = require("./functions.js");
const ask = require("./ai.js");
require("dotenv/config");

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

async function sendTypingAndReply(message, reply) {
   message.channel.sendTyping();
   message.reply(await reply);
}

client.on("messageCreate", async (message) => {
   if (message.content === "!help")
      sendTypingAndReply(message, getHelp(message));
   else if (message.content === "!cookie")
      sendTypingAndReply(message, getQuote());
   else if (message.content === "!cat") sendTypingAndReply(message, getCat());
   else if (message.content === "!dog") sendTypingAndReply(message, getDog());
   else if (message.content.startsWith("!bible"))
      sendTypingAndReply(message, getVerse(message));
   else if (message.content.startsWith("!ask"))
      sendTypingAndReply(message, ask(message));
});

client.login(process.env.TOKEN);
