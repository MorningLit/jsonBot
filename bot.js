const Discord = require("discord.js");
const checkWord = require("check-word");

require("dotenv").config();
const words = checkWord("en");
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = "j!";
var retarded = false;

client.on("ready", () => {
  console.log("I am online!");
});

client.on("message", (msg) => {
  if (!msg.author.bot) {
    // must not be a bot
    var str = msg.content.split(" ");
    console.log(str);

    if (str.length === 1 && str[0] === `${prefix}retarded`) {
      retarded = !retarded;
      return retarded
        ? msg.channel.send(`I am now retarded 👍`)
        : msg.channel.send(`I am now big brain 👍`);
    }

    if (str.length === 2) {
      if (
        retarded &&
        !emoteMentionLinkChecker(str[0]) &&
        !emoteMentionLinkChecker(str[1]) &&
        str[0] !== str[1]
      ) {
        // switches first letter of the 2 words
        console.log(str[0], str[1]);
        let newFirstWord = str[1].charAt(0) + str[0].substring(1);
        let newSecondWord = str[0].charAt(0) + str[1].substring(1);
        return msg.channel.send(`${newFirstWord} ${newSecondWord}`);
      }
      if (!retarded) {
        // msg must be 2 words
        var firstWord = str[0].toLowerCase();
        var secondWord = str[1].toLowerCase();

        if (
          !emoteMentionLinkChecker(firstWord) &&
          !emoteMentionLinkChecker(secondWord) &&
          (!words.check(firstWord) || !words.check(secondWord)) &&
          firstWord !== secondWord
        ) {
          /*
           must not be an emote/mention/link
           and one of the words must not be a word
           and they must not be equal words
          */

          var minLength = Math.min(firstWord.length, secondWord.length);
          for (var i = 1; i <= minLength; i++) {
            var newFirstWord =
              secondWord.substring(0, i) + firstWord.substring(i);
            var newSecondWord =
              firstWord.substring(0, i) + secondWord.substring(i);
            console.log(newFirstWord, newSecondWord);

            if (words.check(newFirstWord) || words.check(newSecondWord)) {
              // found an actual word after mixmatching
              return msg.channel.send(`${newFirstWord} ${newSecondWord}`);
            }
          }
        }
      }
    }
  }
});

function emoteMentionLinkChecker(str) {
  let length = str.length;
  let firstCharLastChar = str.charAt(0) + str.charAt(length - 1);
  if (firstCharLastChar === "<>") return true;

  str.replace(/[^a-zA-Z ]/g, "");
  console.log(str);
  return str.substring(0, 4) === "http" || str === "";
}

client.login(token);
