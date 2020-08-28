const fs = require("fs");
require("dotenv").config();
const ytdl = require("ytdl-core");

/*server */
const User = require("./models/User.js");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
});

app.patch("/users/:userId", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          score: req.body.score,
        },
      }
    );
    res.json(updatedUser);

    console.log("updated");
  } catch (err) {
    res.json({ message: err });
  }
});

mongoose.connect(
  process.env.CONNECT_DB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected to database");
  }
);

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("server running");
});

/*discord bot */
const { Client } = require("discord.js");
const { on, send } = require("process");
const bot = new Client();
const prefix = "$";
const queue = new Map();

bot.on("ready", async () => {
  channel = bot.channels.cache.get("745664909538361424");
  await channel.send("me online la <:BeeHappy:740104993037615104>");
  console.log("bot is ready");
});

bot.on("disconnect", async () => {
  channel = bot.channels.cache.get("745664909538361424");
  channel.send("me offline lu <:BeeHappy:740104993037615104>");
  console.log("bot is disconnect");
});

bot.on("message", async (message) => {
  console.log(`[${message.author.tag}]: send ${message.content}`);
  const bot_words = [
    "hi my master (｡’▽’｡)♡",
    "No (♡´౪`♡)",
    "sorjai (♡´౪`♡)",
    "ok (●´□`)♡",
    "ok (｡◕‿◕｡)",
    "next",
    "don't copy me （ミ￣ー￣ミ）",
    "good night (｡’▽’｡)♡",
    "good morning (｡’▽’｡)♡",
  ];

  const users = [
    "Tam",
    "Edwin",
    "hi258",
    "jwoo",
    "WanWan",
    "Jacky",
    "Kaichun",
    "Wyllie",
    "7k",
    "Wiseman",
    "問完未",
  ];

  const usersTag = [
    "Tam#6118",
    "EdwinKw#3748",
    "hi258#7791",
    "Jwooo#0245",
    "owen#4963",
    "jkrowing21#6924",
    "kaichunxdd#8822",
    "Cyz#9788",
    "7K#7465",
    "Nicholas#2041",
  ];

  const ans = ["true", "false", "唔知", "問完未"];

  if (message.author.bot) return;

  for (let i = 0; i < bot_words.length; i++) {
    if (message.content === bot_words[i]) {
      message.channel.send("don't copy me （ミ￣ー￣ミ）");
    }
  }

  if (message.content === "ok") {
    message.channel.send("next");
    console.log(message.channel);
  }

  if (message.content.startsWith("BeeBee,") && message.content.endsWith("?")) {
    if (
      (message.content.startsWith("BeeBee, is") ||
        message.content.startsWith("BeeBee, are") ||
        message.content.startsWith("BeeBee, do") ||
        message.content.startsWith("BeeBee, am") ||
        message.content.startsWith("BeeBee, will") ||
        message.content.startsWith("BeeBee, can")) &&
      message.content.endsWith("?")
    ) {
      const num = Math.floor(Math.random() * ans.length);
      message.channel.send(`${ans[num]} <:BeeHappy:740104993037615104>`);
    } else if (message.content.startsWith("BeeBee, why")) {
      message.channel.send(`唔知 <:BeeHappy:740104993037615104>`);
    } else {
      const num = Math.floor(Math.random() * users.length);
      message.channel.send(`${users[num]} <:BeeHappy:740104993037615104>`);
    }
  }

  if (
    message.content === "<:BeeHappy:740104993037615104>" ||
    message.content === "<:BeeSad:740104953888112733>" ||
    message.content === "<:BeeMad:740104929430994985>"
  ) {
    message.channel.send("Hi");
  }

  if (message.content === "<:BeeSad:740104953888112733>") {
    message.channel.send("Hi");
  }
  if (message.content === "-1" || message.content === "lol-1") {
    message.channel.send("true");
  }
  if (message.content === "hey my bot") {
    if (message.author.tag === "Tam#6118") {
      message.channel.send("hi my master (｡’▽’｡)♡");
    } else {
      message.channel.send("sorjai (♡´౪`♡)");
    }
  }

  if (message.content === "BeeBee's score") {
    const data = await User.find();

    var output = "BeeBee 好感度 <:BeeHappy:740104993037615104>:  \n";
    for (let i = 0; i < usersTag.length; i++) {
      if (data[i].score > 100) {
        output += `${data[i].user} : ${data[i].score} <:BeeHappy:740104993037615104> \n`;
      } else if (data[i].score < 100 && data[i].score > 0) {
        output += `${data[i].user} : ${data[i].score} <:BeeMad:740104929430994985> \n`;
      } else {
        output += `${data[i].user} : ${data[i].score} <:BeeSad:740104953888112733> \n`;
      }
    }
    message.channel.send(output);
  }

  if (message.content === "BeeBee, good morning") {
    for (let i = 0; i < usersTag.length; i++) {
      if (message.author.tag === usersTag[i]) {
        num = Math.floor(Math.random() * 2);
        const data1 = await User.find();
        data1[i].score += num;
        message.channel.send(
          `good morning ${users[i]} (｡’▽’｡)♡" --- [ 好感度+${num} ]`
        );

        const data = await User.findOneAndUpdate(
          { userTag: usersTag[i] },
          {
            $set: {
              score: data1[i].score,
            },
          }
        );
        console.log(data[i].score);
      }
    }
  }

  if (message.content === "BeeBee, good afternoon") {
    for (let i = 0; i < usersTag.length; i++) {
      if (message.author.tag === usersTag[i]) {
        num = Math.floor(Math.random() * 2);
        const data1 = await User.find();
        data1[i].score += num;
        message.channel.send(
          `good afternoon ${users[i]} (｡’▽’｡)♡" --- [ 好感度+${num} ]`
        );

        const data = await User.findOneAndUpdate(
          { userTag: usersTag[i] },
          {
            $set: {
              score: data1[i].score,
            },
          }
        );
        console.log(data[i].score);
      }
    }
  }
  if (message.content === "BeeBee, good night") {
    for (let i = 0; i < usersTag.length; i++) {
      if (message.author.tag === usersTag[i]) {
        num = Math.floor(Math.random() * 2);
        const data1 = await User.find();
        data1[i].score += num;
        message.channel.send(
          `good night ${users[i]} (｡’▽’｡)♡" --- [好感度+${num}]`
        );

        const data = await User.findOneAndUpdate(
          { userTag: usersTag[i] },
          {
            $set: {
              score: data1[i].score,
            },
          }
        );
        console.log(data[i].score);
      }
    }
  }

  if (
    message.content === "<:b8126c857aacaf1d7226fa5505b5f5cb:748521070998585345>"
  ) {
    for (let i = 0; i < usersTag.length; i++) {
      if (message.author.tag === usersTag[i]) {
        num = Math.floor(Math.random() * 2);
        const data1 = await User.find();
        data1[i].score += num;
        message.channel.send(`(｡’▽’｡)♡" --- [ 好感度+${num} ]`);

        const data = await User.findOneAndUpdate(
          { userTag: usersTag[i] },
          {
            $set: {
              score: data1[i].score,
            },
          }
        );
        console.log(data[i].score);
      }
    }
  }
  if (message.content === "BeeBee, shut up") {
    for (let i = 0; i < usersTag.length; i++) {
      if (message.author.tag === usersTag[i]) {
        num = Math.floor(Math.random() * 2);
        const data1 = await User.find();
        data1[i].score -= num;
        message.channel.send(
          `<:BeeSad:740104953888112733> <:BeeSad:740104953888112733> <:BeeSad:740104953888112733>" [好感度 -${num}[]`
        );

        const data = await User.findOneAndUpdate(
          { userTag: usersTag[i] },
          {
            $set: {
              score: data1[i].score,
            },
          }
        );
        console.log(data[i].score);
      }
    }
  }

  if (message.content === "BeeBee u love me?") {
    if (message.author.tag === "Tam#6118") {
      message.channel.send("Yes (▰˘◡˘▰)");
    } else {
      message.channel.send("No (♡´౪`♡)");
    }
  }

  if (message.content === "beebee u have sumsi?") {
    message.channel.send("true <:BeeSad:740104953888112733>");
  }

  if (message.content === "BeeBee u angry?") {
    message.channel.send("me ho angry ");
  }
  if (message.content === "what sumsi?") {
    message.channel.send("i want a girl bot (｡’▽’｡)♡");
  }
});

bot.on("message", async (message) => {
  if (
    message.content === "BeeBee, come to my channel" ||
    message.content === `${prefix}join`
  )
    if (message.author.tag === "Tam#6118") {
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        message.channel.send("ok (●´□`)♡");
      }
    } else {
      message.channel.send("No. i wont come (♡´౪`♡)");
    }

  if (message.content === "play me a song")
    if (message.author.tag === "Tam#6118") {
      const songs = [
        "castle-in-the-sky",
        "howie-moving-castle",
        "spirited-away",
        "canon",
        "river-flows-in-you",
        "drowning-sorrows",
        "cry-to-break",
        "something-just-like-this",
        "actor",
        "your-answer",
        "cat",
      ];
      const num = Math.floor(Math.random() * songs.length);

      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join();
        message.channel.send("ok (｡◕‿◕｡)");
        // Create a dispatcher
        connection.play(`./src/${songs[num]}.mp3`);
      }
    } else {
      message.channel.send(" I only play music for my master (｡◕‿◕｡) ");
    }
});

/* music bot part */

bot.once("ready", () => {
  console.log("ready");
});
bot.once("reconnect", () => {
  console.log("reconnect");
});
bot.once("disconnect", () => {
  console.log("disconnect");
});

bot.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (
    message.content.startsWith(`${prefix}play`) ||
    message.content.startsWith(`${prefix}p`)
  ) {
    execute(message, serverQueue);
    return;
  } else if (
    message.content.startsWith(`${prefix}skip`) ||
    message.content.startsWith(`${prefix}s`)
  ) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}clear`)) {
    clearQueue(message, serverQueue);
    return;
  } else if (
    message.content.startsWith(`${prefix}queue`) ||
    message.content.startsWith(`${prefix}q`)
  ) {
    showQueue(message, serverQueue);
    return;
  } else {
    message.channel.send("");
  }
});

async function execute(message, serverQueue) {
  const args = message.content.trim().substring(prefix.length).split(/\s+/);

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send("你要入咗channel先播到歌架 (｡◕‿◕｡)");
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send("俾權限我先可以播到喎 (｡◕‿◕｡)");
  }

  if (!args[1].startsWith("http"))
    return message.channel.send("暫時剩係用到youtube link T__T");

  const songInfo = await ytdl.getInfo(args[1]);

  const song = {
    title: songInfo.videoDetails.title,
    url: songInfo.videoDetails.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`**${song.title}** 已經加咗入歌單`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("你要入咗channel先skip到歌架 (｡◕‿◕｡)");
  if (!serverQueue) return message.channel.send("冇野skip到喎  (｡◕‿◕｡)");
  message.channel.send(`skip咗 **${serverQueue.songs[0].title}** (｡◕‿◕｡)`);
  serverQueue.connection.dispatcher.end();
}

function clearQueue(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("你要入咗channel先清到歌架 (｡◕‿◕｡)");
  message.channel.send("已經清曬啲歌 (｡◕‿◕｡)");
  serverQueue.songs = [];
}

function showQueue(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send("你要入咗channel先睇到有咩歌架 (｡◕‿◕｡)");
  if (serverQueue.songs.length === 0 || !serverQueue) {
    message.channel.send("歌單係空嘅 (｡◕‿◕｡)");
  } else {
    message.channel.send("依個係歌單 (｡◕‿◕｡)");
    let index = 1;
    serverQueue.songs.map((song) => {
      message.channel.send(`${index}. ${song.title}`);
      index++;
    });
  }
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => {
      console.error(error);
      message.channel.send("youtube link");
      return;
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`播緊: **${song.title}**`);
}

bot.login(process.env.DISCORDJS_BOT_TOKEN);
