const prompt = require("prompt");
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const appendFileAsync = util.promisify(fs.appendFile);

const getJoke = async (term) => {
  try {
    const response = await axios.get(
      `https://icanhazdadjoke.com/search?term=${term}`,
      { headers: { Accept: "Application/json" } }
    );
    let data = response.data.results;
    data = data.map((jokeObject) => jokeObject.joke);
    return data[Math.floor(Math.random() * data.length)];
  } catch (e) {
    console.error("ERROR: ", e.message);
    return null;
  }
};

const saveJoke = async (joke) => {
  try {
    await appendFileAsync("jokes.txt", joke);
    return true;
  } catch (e) {
    console.error("ERROR: ", e.message);
    return false;
  }
};

const promptJoke = async () => {
  try {
    const { term } = await prompt.get(["term"]);
    return term;
  } catch (e) {
    console.error("ERROR: ", e.message);
    return false;
  }
};

async function main() {
  while (true) {
    const term = await promptJoke();
    if (!term) {
      console.log("## Please enter a valid search term!!");
      return;
    }

    const joke = await getJoke(term);
    if (!joke) {
      console.log("## There is no joke that matches your search term!!");
      return;
    }
    console.log("Joke: ", joke);

    const saved = await saveJoke(joke);
    if (saved) {
      console.log("*** Joke has been saved ***");
    } else {
      console.log("## Your joke could not be saved !!");
    }
  }
}

main();
