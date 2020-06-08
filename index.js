const Discord = require("discord.js");
const checkWord = require("check-word");

const bot = new Discord.Client();
const TOKEN = "NzE5MzY5Nzg4NTQyOTQzMjUy.Xt2brA.XeQz0mWu-8whgGtD183Gi06SUH8";
const PREFIX = "j!";
const words = checkWord("en");

bot.on("ready", () => {
  console.log("This bot is online!");
});

bot.on("message", (msg) => {
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

bot.login(TOKEN);
