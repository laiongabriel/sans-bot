import Countdown from "./countdown.js";

async function translate(text, target) {
   const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}&q=${text}&target=${target}`
   );
   const json = await response.json();
   const translatedText = json.data.translations[0].translatedText;
   return translatedText;
}

export async function getQuote() {
   const response = await fetch("https://zenquotes.io/api/random");
   const jsonData = await response.json();

   const quote = jsonData[0]["q"];
   const author = jsonData[0]["a"];

   const translatedQuote = await translate(quote, "pt-BR");
   return `${translatedQuote}\n\n- ${author}`;
}

export async function getCat() {
   const response = await fetch("https://cataas.com/cat?json=true");
   const jsonData = await response.json();

   const cat = jsonData.url;
   return "https://cataas.com" + cat;
}

export async function getDog() {
   const response = await fetch("https://random.dog/woof.json");
   const jsonData = await response.json();

   const dog = jsonData.url;
   return dog;
}

export async function getVerse(book, chapterVerse) {
   const response = await fetch(
      `https://bible-api.com/${book}+${chapterVerse}?translation=almeida`
   );
   const jsonData = await response.json();

   const reference = jsonData.reference;
   const text = jsonData.text;

   return text + "\n\n" + reference;
}

export function ferias() {
   const UfraEndOfSemester = new Countdown("19 May 2023 23:59:59 GMT-0300");

   return `Faltam ${UfraEndOfSemester.countdown.days} dias e ${UfraEndOfSemester.countdown.hours} horas para o final do semestre! Continue estudando!`;
}

export async function getWiki(arg) {
   const resolve = await fetch(
      `https://pt.wikipedia.org/api/rest_v1/page/summary/${arg}`
   );
   const jsonData = await resolve.json();
   const summary =
      (jsonData && jsonData.extract) ||
      `Não consegui encontrar o termo ${arg}. Você digitou corretamente?`;
   return summary;
}
