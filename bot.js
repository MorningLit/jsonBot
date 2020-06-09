const Discord = require("discord.js");
const checkWord = require("check-word");
const emojiStrip = require("emoji-strip");
const stripChar = require("stripchar").StripChar;

require("dotenv").config();
const words = checkWord("en");
const client = new Discord.Client();
const token = process.env.TOKEN;
const prefix = "j!";

var retarded = false;
var twoWords = true;
var silenced = false;

client.on("ready", () => {
  console.log("I am online!");
});

client.on("message", (msg) => {
  if (silenced && msg.content === `${prefix}unsilence`) {
    silenced = false;
    return msg.channel.send("I am back!");
  }

  if (!silenced && !msg.author.bot) {
    // must not be silenced and not from a bot
    var arr = emojiStrip(msg.content).split(" ");

    if (arr.length === 1 && arr[0].substring(0, 2) === `${prefix}`) {
      // check prefix only
      var restStr = arr[0].substring(2);
      if (restStr === `silence`) {
        silenced = true;
        return msg.channel.send(`SHUTUP JASON`);
      }
      if (restStr === `retarded`) {
        retarded = !retarded;
        return retarded
          ? msg.channel.send(`I am now jason 🥴`)
          : msg.channel.send(`I am now YASON 💪`);
      }
      if (restStr === `twoWords`) {
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
        console.log(
          `${firstWord}: ${words.check(firstWord)} ${secondWord}: ${words.check(
            secondWord
          )}`
        );
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
                  .replace(arr[0], newFirstWord)
                  .replace(arr[1], newSecondWord);
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

  return str.substring(0, 4) === "http" || str === "";
}

function removeEmoteMentionLink(arr) {
  let num = arr.length;
  console.log("BEFORE: " + arr);
  let newArr = [];
  for (var i = 0; i < num; i++) {
    if (!emoteMentionLinkChecker(arr[i])) {
      arr[i] = stripChar.RSExceptAlpha(arr[i]);
      newArr.push(arr[i]);
    }
  }
  var filtered = newArr.filter(Boolean);
  console.log(`AFTER: ${newArr} FILTER: ${filtered}`);
  return filtered;
}

function find1_2Longest(arr) {
  var sorted = arr.sort(function (a, b) {
    return b.length - a.length;
  });

  return [sorted[0], sorted[1]];
}

client.login(token);
