import { Collection, Snowflake, VoiceChannel } from "discord.js";

export const getUserVoiceChannel = (voiceChannels: Collection<Snowflake, VoiceChannel>, idUser: Snowflake) => {
    return voiceChannels
        .find((voiceChannel) => voiceChannel.members
        .find((member) => member.id === idUser))
}