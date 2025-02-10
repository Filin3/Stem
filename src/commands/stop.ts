import { getVoiceConnection } from "@discordjs/voice";
import { Message } from "discord.js";
import { Queue } from "src/classes/Queue/Queue";
import { getClassInstance } from "src/utils/getClassInstance";

export const stopCommand = (message: Message<true>) => {
  const connection = getVoiceConnection(message.guildId)
	connection?.destroy()
  getClassInstance(message.guild.id, Queue).reset()
}