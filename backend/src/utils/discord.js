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

// ✅ Track if bot is ready
let isReady = false;

client.once("ready", (readyClient) => {
  console.log(`✅ Discord bot logged in as ${readyClient.user.tag}`);
  isReady = true;
});

client.on("error", (error) => {
  console.error("❌ Discord client error:", error.message);
  isReady = false;
});

// ✅ Login immediately and handle errors
const loginPromise = client
  .login(process.env.DISCORD_BOT_TOKEN)
  .then(() => {
    console.log("✅ Discord login initiated");
  })
  .catch((err) => {
    console.error("❌ Discord login FAILED:", err.message);
  });

// ✅ Helper: wait for bot to be ready before using it
export const waitForDiscord = async (timeoutMs = 15000) => {
  if (isReady) return true;

  await loginPromise;

  const start = Date.now();
  while (!isReady && Date.now() - start < timeoutMs) {
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!isReady) {
    console.error("❌ Discord bot not ready after", timeoutMs, "ms");
  }

  return isReady;
};

export const isDiscordReady = () => isReady;

export default client;