module.exports = {
   getHelp,
   getQuote,
   getCat,
   getDog,
   getVerse,
};

function getHelp(message) {
   return (
      `Olá, ${message.author.username}!\nComandos disponíveis:\n\n` +
      `\`!cookie\`: frases inspiradoras em inglês.\n` +
      `\`!cat\`: imagens aleatórias de gatinhos.\n` +
      `\`!dog\`: imagens e gifs aleatórios de doguinhos.\n` +
      `\`!bible <livro capítulo versículo>\`: versículos da bíblia.\n` +
      `\`!ask <mensagem>\`: pergunte algo à IA (não é o ChatGPT).`
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
