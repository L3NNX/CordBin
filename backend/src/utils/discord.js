// import { AttachmentBuilder, Client, Events, GatewayIntentBits } from 'discord.js';
// import "dotenv/config";
// import fs from 'node:fs';
// const client = new Client({ intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent] });

// client.on(Events.ClientReady, readyClient => {
//   console.log(`Logged in as ${readyClient.user.tag}!`);
// });

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }
// });
// const TOKEN = process.env.DISCORD_BOT_TOKEN;

// client.on("messageCreate",async (message) => {
//     if(message.author.bot) return;

//     if(message.content.startsWith("download")){
//         const fetching = await message.channel.messages.fetch("1458600841627045908")
//         const fileFetch = (fetching.attachments.first());
//         const res = await fetch(fileFetch.url);
//         const buffer = await res.arrayBuffer();
//         fs.writeFileSync(fileFetch.name, Buffer.from(buffer));
//     }

//     if(message.content.startsWith("upload")){   
//         let file = new AttachmentBuilder("test.mp3")  
//         let data = await message.reply({
//             content: "Here is your VPX file!",
//             files: [file]
//         });
//         console.log(data);
//         return;
//     }
//     message.reply("Hello there!");
  
// });


// export default client;


import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let ready = false;

client.once("ready", (c) => {
  ready = true;
  console.log(`Discord ready: ${c.user.tag}`);
});

client.on("error", (err) => {
  ready = false;
  console.error("Discord client error:", err);
});

const loginPromise = client.login(process.env.DISCORD_BOT_TOKEN)
  .catch((err) => {
    console.error("Discord login failed:", err);
  });

export const waitForDiscord = async (timeout = 15000) => {
  if (ready) return true;
  await loginPromise;
  const start = Date.now();
  while (!ready && Date.now() - start < timeout) {
    await new Promise(r => setTimeout(r, 300));
  }
  return ready;
};

export default client;