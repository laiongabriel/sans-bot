module.exports = {
   getHelp,
   getQuote,
   getCat,
   getDog,
   getVerse,
   getLabyProfile,
};

function getHelp(message) {
   return (
      `Olá, ${message.author.username}!\nAqui vão alguns comandos que você provavelmente vai esquecer em 5 minutos:\n\n` +
      `\`!cookie\`: citações iluminadas de figuras famosas para começar o dia inspirado.\n` +
      `\`!cat\`: prepare-se para uma overdose de fofura com fotos de gatinhos!\n` +
      `\`!dog\`: quem resiste a doguinhos? Imagens e gifs para alegrar seu dia!\n` +
      `\`!bible <livro capítulo versículo>\`: versículos da bíblia.\n`
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
   let i = 0;
   const nickRegex = /^[a-zA-Z0-9_]{1,16}$/;
   try {
      const match = message.content.match(/!h\s(.+)/i);
      const userName = match ? match[1] : null;
      if (userName === null) return "`!h <nick>`";
      if (!nickRegex.test(userName)) return "`Nick inválido.`";

      const UuidResponse = await fetch(
         `https://api.mojang.com/users/profiles/minecraft/${userName}`
      );

      const UuidJson = await UuidResponse.json();
      if (
         UuidJson.errorMessage &&
         UuidJson.errorMessage.includes("Couldn't find any profile with name")
      ) {
         return "Nick não encontrado.";
      } else if (UuidJson.errorMessage) return UuidJson.errorMessage;

      const profileResponse = await fetch(
         `https://laby.net/api/v3/user/${UuidJson.id}/profile`
      );

      const profileJson = await profileResponse.json();
      const historyArray = profileJson.username_history;

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

      return (
         nameList +
         `\n\`${hiddenNicks} ${
            hiddenNicks === 1 ? "nick escondido." : "nicks escondidos."
         }\``
      );
   } catch (err) {
      console.log(`ERROR: ${err}`);
      return `Erro: ${err}`;
   }
}
