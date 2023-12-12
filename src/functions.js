module.exports = {
   getHelp,
   getQuote,
   getCat,
   getDog,
   getVerse,
   checkNicknames,
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

async function checkNicknames(message) {
   try {
      const nicknames = message.content
         .substring(21)
         .split(",")
         .map((nickname) => nickname.trim());

      const requests = nicknames.map((nickname) =>
         fetch(`https://mush.com.br/api/player/${nickname}`)
            .then((response) => response.json())
            .then((data) => ({ nickname, data }))
      );

      const results = await Promise.all(requests);

      let foundBannedNickname = false;
      let foundNonBannedNickname = false;
      let fakeNames = "";

      results.forEach((result) => {
         const { nickname, data } = result;
         if (
            (data.success === true && data.response.banned === true) ||
            data.success === false
         ) {
            foundBannedNickname = true;
            fakeNames += `\`${nickname}\` provavelmente é /nick. \n`;
         } else if (data.success === true && !data.response.banned) {
            foundNonBannedNickname = true;
         }
      });

      if (!foundBannedNickname && foundNonBannedNickname) {
         return "Não há /nick na partida.";
      } else {
         return fakeNames;
      }
   } catch (err) {
      console.log(err);
      return "Ocorreu um erro.";
   }
}
