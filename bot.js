const Discord = require("discord.js");
const checkWord = require("check-word");

require("dotenv").config();
const words = checkWord("en");
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = process.env.PREFIX;

client.on("ready", () => {
  console.log("I am online!");
});

client.on("message", (msg) => {
  if (!msg.author.bot) {
    // must not be a bot
    var str = msg.content.split(" ");

    if (str.length === 2) {
      // msg must be 2 words
      var firstWord = str[0].toLowerCase();
      var secondWord = str[1].toLowerCase();

      if (!words.check(firstWord) || !words.check(secondWord)) {
        // one of the words must be not a word
        var minLength = Math.min(firstWord.length, secondWord.length);
        for (var i = 1; i < minLength - 1; i++) {
          var newFirstWord =
            secondWord.substring(0, i) + firstWord.substring(i);
          var newSecondWord =
            firstWord.substring(0, i) + secondWord.substring(i);
          if (words.check(newFirstWord) || words.check(newSecondWord)) {
            // found an actual word after mixmatching
            return msg.channel.send(`${newFirstWord} ${newSecondWord}`);
          }
        }
      }
    }
  }
});

client.login(token);
