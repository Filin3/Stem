import { Message } from "discord.js";

const prefix: string = process.env.PREFIX as string

const getCommandWithoutPrefix = (command: string) => {
  return command.replace(prefix, "")
} 

export const parseCommand = (message: Message) => {
    const content = message.content.trim()
    if (!content.startsWith(prefix)) return

    const [command, ...params] = content
      .split(" ")
      .filter(Boolean)

    return {
      command: getCommandWithoutPrefix(command),
      params,
    }
}