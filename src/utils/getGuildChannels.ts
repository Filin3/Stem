import { ChannelType, Guild } from "discord.js";

export const getGuildChannels = async (guild: Guild, type: ChannelType) => {
    const channels = await guild.channels.fetch()
    
    return channels.filter((channel) => channel?.type === type)
}