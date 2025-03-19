import { Message } from "discord.js";
import { playCommand } from "./play";
import { stopCommand } from "./stop";
import { skipCommand } from "./skip";
import { queueCommand } from "./queue";

export class Command {
  private map: Record<string, any> = {
    alenafm: (message: Message<true>) => playCommand(message, ['https://www.youtube.com/watch?v=4xDzrJKXOOY']),
    ravefm: (message: Message<true>) => playCommand(message, ['https://www.youtube.com/watch?v=34H1XIjnfKM']),
    play: playCommand,
    stop: stopCommand,
    skip: skipCommand,
    queue: queueCommand,
  }

  execute(command: string, message: Message, params: string[]) {
		if (!this.map[command]) return
		this.map[command](message, params)
		console.log(`${command}: executed by ${message.author.globalName} with params: ${params}`)
  }
}
