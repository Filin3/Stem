import "dotenv/config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Command } from "./commands/commandMap";
import { parseCommand } from "./utils/parseCommand";
import { HTTPReceiver } from "./classes/HTTPReceiver";
import { GithubNotifier } from "./classes/GithubNotifier/GithubNotifier";

const command = new Command();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, async (client) => {
  console.log(`${client.user.username} is online`);

  const githubNotifier = new GithubNotifier(client);

  new HTTPReceiver()
    .addEventListener(
      "post",
      "/github-notifier",
      githubNotifier.getHttpReceiverEventListener()
    );
});

client.login(process.env.TOKEN);

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const parsedCommand = parseCommand(message);
  if (!parsedCommand) return;

  command.execute(parsedCommand.command, message, parsedCommand.params);
});
