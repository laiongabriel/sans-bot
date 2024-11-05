const { OpenAI } = require("openai");

function getHelp(message) {
   return (
      `Olá, ${message.author.displayName}!\nComandos do Sans:\n\n` +
      `\`!cookie\`: citações iluminadas de figuras famosas para começar o dia inspirado.\n` +
      `\`!cat\`: prepare-se para uma overdose de fofura com fotos de gatinhos!\n` +
      `\`!dog\`: quem resiste a doguinhos? Imagens e vídeos para alegrar seu dia!\n` +
      `\`!bible <livro capítulo versículo>\`: versículos da bíblia.\n` +
      `\`!h <nick>\`: ver o histórico de nicks de um jogador de Minecraft.\n`
   );
}

async function getQuote() {
   try {
      const response = await fetch("https://zenquotes.io/api/random");
      const jsonData = await response.json();

      const [{ q: quote, a: author }] = jsonData;

      return `${quote}\n` + `\\- ${author}`;
   } catch (err) {
      console.log(err);
      return "A API está com problemas. Tente novamente mais tarde.";
   }
}

async function getCat() {
   try {
      const response = await fetch("https://cataas.com/cat?json=true");
      const jsonData = await response.json();
      const catId = jsonData._id;
      return "https://cataas.com/cat/" + catId;
   } catch (err) {
      console.log(err);
      return "A API está com problemas. Tente novamente mais tarde.";
   }
}

async function getDog() {
   try {
      const response = await fetch("https://random.dog/woof.json");
      const jsonData = await response.json();
      const dog = jsonData.url;
      return dog;
   } catch (err) {
      console.log(err);
      return "A API está com problemas. Tente novamente mais tarde.";
   }
}

async function getVerse(message) {
   try {
      const args = message.content.slice(7).split(" ");
      const [book, chapter, verse] = args;
      if (args.length < 3) {
         return "`!bible <livro capítulo versículo>`";
      }

      const response = await fetch(
         `https://bible-api.com/${book}+${chapter}:${verse}?translation=almeida`
      );
      const jsonData = await response.json();
      const { reference, text } = jsonData;

      if (!text || !reference) {
         return "Não consegui encontrar. Você digitou corretamente?";
      } else return text + "\n\n" + reference;
   } catch (err) {
      console.log(err);
      return "A API está com problemas. Tente novamente mais tarde.";
   }
}

async function getLabyProfile(message) {
   let hiddenNicks = 0;
   let nameList = "";
   let i = 1;
   const nickRegex = /^[a-zA-Z0-9_]{1,16}$/;
   const controller = new AbortController();

   try {
      const match = message.content.match(/!h\s(.+)/i);
      const userName = match ? match[1] : null;
      if (userName === null) return "`!h <nick>`";
      if (!nickRegex.test(userName)) return "Nick inválido.";

      const UuidResponse = await fetch(
         `https://api.minetools.eu/uuid/${userName}`,
         { signal: controller.signal }
      );

      if (UuidResponse.status !== 200) return "Aguarde um momento.";

      const UuidJson = await UuidResponse.json();
      if (UuidJson.id === null) return "Nick não encontrado.";

      const profileResponse = await fetch(
         `https://laby.net/api/v3/user/${UuidJson.id}/profile`,
         { signal: controller.signal }
      );

      const profileJson = await profileResponse.json();
      const historyArray = profileJson.name_history;

      historyArray.forEach((element) => {
         if (element.name === "－") hiddenNicks++;
      });

      const filteredHistoryArray = historyArray.filter(
         (element) => element.name !== "－"
      );

      filteredHistoryArray.forEach((element) => {
         let readableDate = "(primeiro nick)";
         if (element.changed_at !== null) {
            readableDate = new Date(element.changed_at).toLocaleString(
               "pt-BR",
               { year: "numeric", month: "numeric", day: "numeric" }
            );
         }

         nameList += `\`${i++}. ${element.name} ${readableDate}\`` + "\n";
      });

      if (hiddenNicks < 1) {
         return nameList;
      } else {
         return (
            nameList +
            `\n\`${hiddenNicks} ${
               hiddenNicks === 1 ? "nick escondido." : "nicks escondidos."
            }\``
         );
      }
   } catch (err) {
      if (err.name !== "AbortError") {
         console.log(`ERROR: ${err}`);
         return `Erro: ${err}.`;
      } else {
         console.log("Requisição abortada");
         return "Requisição abortada.";
      }
   } finally {
      controller.abort();
   }
}

async function getAiResponse(message) {
   const match = message.content.match(/!ai\s(.+)/i);
   const userMessage = match ? match[1] : null;
   console.log(userMessage);
   const openai = new OpenAI({
      apiKey: "pk-HfVtMdKbrfjdCAADCHhXvCijhvOJazYuhQHFBQUTXHfeljSn",
      baseURL: "https://api.pawan.krd/pai-001/v1",
   });

   const chatCompletion = await openai.chat.completions.create({
      messages: [
         {
            role: "system",
            content:
               "Responda as coisas que eu mandar (não necessariamente uma pergunta) de forma engraçada, como se fosse um amigo. As respostas devem ser curtas e diretas com um tom tosco e informal, e tudo em letras minúsculas, dentro do contexto da mensagem, de forma que faça sentido e a resposta tenha a ver com o que eu mandei.",
         },
         {
            role: "user",
            content: userMessage,
         },
      ],
      model: "pai-001",
   });

   return chatCompletion.choices[0].message.content;
}

module.exports = {
   getHelp,
   getQuote,
   getCat,
   getDog,
   getVerse,
   getLabyProfile,
   getAiResponse,
};
