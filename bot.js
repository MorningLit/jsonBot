const Discord = require("discord.js");
const checkWord = require("check-word");
const emojiStrip = require("emoji-strip");

require("dotenv").config();
const words = checkWord("en");
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = "j!";
var retarded = false;
var twoWords = true;

client.on("ready", () => {
  console.log("I am online!");
});

client.on("message", (msg) => {
  if (!msg.author.bot) {
    // must not be a bot
    var arr = emojiStrip(msg.content).split(" ");

    if (arr.length === 1) {
      // check prefix only
      if (arr[0] === `${prefix}retarded`) {
        retarded = !retarded;
        return retarded
          ? msg.channel.send(`I am now yason 🥴`)
          : msg.channel.send(`I am now JASON 💪`);
      } else if (arr[0] === `${prefix}twoWords`) {
        twoWords = !twoWords;
        return twoWords
          ? msg.channel.send(`scanning only 2 words`)
          : msg.channel.send(`scanning >2 words`);
      }
    }

    arr = removeEmoteMentionLink(arr);

    if (!twoWords && arr.length > 2) {
      // need scan all words
      arr = find1_2Longest(arr);
      console.log("STEP 1: " + arr);
    }
    if (arr.length === 2) {
      if (retarded && arr[0] !== arr[1]) {
        // switches first letter of the 2 words
        let newFirstWord = arr[1].charAt(0) + arr[0].substring(1);
        let newSecondWord = arr[0].charAt(0) + arr[1].substring(1);

        if (!twoWords) {
          let newSentence = msg.content
            .replace(arr[0], newFirstWord)
            .replace(arr[1], newSecondWord);
          return msg.channel.send(newSentence);
        }
        return msg.channel.send(`${newFirstWord} ${newSecondWord}`);
      }
      if (!retarded) {
        // msg must be 2 words
        var firstWord = arr[0].toLowerCase();
        var secondWord = arr[1].toLowerCase();

        if (
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

            if (words.check(newFirstWord) || words.check(newSecondWord)) {
              // found an actual word after mixmatching
              if (!twoWords) {
                let newSentence = msg.content
                  .replace(firstWord, newFirstWord)
                  .replace(secondWord, newSecondWord);
                return msg.channel.send(newSentence);
              }
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
  return str.substring(0, 4) === "http" || str === "";
}

function removeEmoteMentionLink(arr) {
  let num = arr.length;
  console.log("BEFORE: " + arr);
  let newArr = [];
  for (var i = 0; i < num; i++) {
    if (!emoteMentionLinkChecker(arr[i])) {
      newArr.push(arr[i]);
    }
  }
  console.log("AFTER: " + newArr);
  return newArr;
}

function find1_2Longest(arr) {
  var sorted = arr.sort(function (a, b) {
    return b.length - a.length;
  });

  return [sorted[0], sorted[1]];
}

client.login(token);
