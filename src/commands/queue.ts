import { Message } from "discord.js";
import { Queue } from "src/classes/Queue/Queue";
import { getClassInstance } from "src/utils/getClassInstance";

export const queueCommand = (message: Message<true>) => {
	const queue = getClassInstance(message.guild.id, Queue)
	const responce = queue.get()
		.map(({username, url}, idx) => `${idx}. ${username} - ${url}`)
		.join('\n')
		
	message.reply(responce || 'queue is empty')
}