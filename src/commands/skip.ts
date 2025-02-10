import { Message } from "discord.js"
import { YTdlp } from "src/classes/YTdlp"
import { getClassInstance } from "src/utils/getClassInstance"

export const skipCommand = (message: Message<true>) => {
	const ytdlp = getClassInstance(message.guild.id, YTdlp)
	ytdlp.stop()
}