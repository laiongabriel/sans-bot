module.exports = {
   getHelp,
   getQuote,
   getCat,
   getDog,
   getVerse,
};

function getHelp(message) {
   return (
      `Olá, ${message.author.username}!\nAqui vão alguns comandos que você provavelmente vai esquecer em 5 minutos:\n\n` +
      `\`!cookie\`: citações iluminadas de figuras famosas para começar o dia inspirado.\n` +
      `\`!cat\`: prepare-se para uma overdose de fofura com fotos de gatinhos!\n` +
      `\`!dog\`: quem resiste a doguinhos? Imagens e gifs para alegrar seu dia!\n` +
      `\`!bible <livro capítulo versículo>\`: versículos da bíblia.\n` +
      `\`!ask <mensagem>\`: pergunte algo à IA (gpt-4), e aguarde pela resposta mais espirituosa possível.`
   );
}

async function getQuote() {
   try {
      const response = await fetch("https://zenquotes.io/api/random");
      const jsonData = await response.json();

      const [{ q: quote, a: author }] = jsonData;

      return `${quote}\n\n- ${author}`;
   } catch (err) {
      console.log(err);
      return "A API está com problemas. Tente novamente mais tarde.";
   }
}

async function getCat() {
   try {
      const response = await fetch("https://cataas.com/cat?json=true");
      const jsonData = await response.json();
      const cat = jsonData.url;
      return "https://cataas.com" + cat;
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
