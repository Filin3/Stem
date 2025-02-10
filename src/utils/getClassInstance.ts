import { Snowflake } from "discord.js"

const instancesMap: Record<string, any> = {}

export const getClassInstance = <Class>(
  guildId: Snowflake, 
  classConstructor: new (...arg: any[]) => Class,
  props = []
): Class => {
  if (!instancesMap[guildId]) {
    instancesMap[guildId] = {}
  }
  
  const className = classConstructor.name

  if (!instancesMap[guildId][className]) {
      instancesMap[guildId][className] = new classConstructor(...props)
  }

  return instancesMap[guildId][className]
}

