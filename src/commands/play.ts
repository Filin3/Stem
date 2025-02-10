import { AudioPlayerStatus, getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { ChannelType, Message, Snowflake } from "discord.js";
import { getGuildChannels } from "src/utils/getGuildChannels";
import { getUserVoiceChannel } from "src/utils/getUserVoiceChannel";
import { destroyVoiceConnection } from "src/utils/destroyVoiceConnection";
import { getClassInstance } from "src/utils/getClassInstance";
import { Queue } from "src/classes/Queue/Queue";
import { YTdlp } from "src/classes/YTdlp";

const onReadyToPlay = (guildId: Snowflake, queue: Queue, ytdlp: YTdlp) => {
  const queueItem = queue.next()
  queueItem
    ? ytdlp.spawnProccess(queueItem.url)
    : destroyVoiceConnection(guildId)
} 

export const playCommand = async (message: Message<true>, params: string[]) => {
  if (!params.length) return
  const voiceChannels = await getGuildChannels(message.guild, ChannelType.GuildVoice)
  const userVoiceChannel = getUserVoiceChannel(voiceChannels, message.author.id)

  if (!userVoiceChannel) return

  const queue = getClassInstance(userVoiceChannel.guild.id, Queue)
  const ytdlp = getClassInstance(userVoiceChannel.guild.id, YTdlp)

  const voiceConnection = getVoiceConnection(userVoiceChannel.guild.id)

  queue.add({
    username: message.author.username,
    url: params.at(0) as string
  })

  if (voiceConnection) return

  const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: userVoiceChannel.guild.id,
      adapterCreator: userVoiceChannel.guild.voiceAdapterCreator,
    })

  const player = ytdlp.getPlayer()

  player.on(AudioPlayerStatus.Idle, () => onReadyToPlay(message.guild.id, queue, ytdlp))
  connection.on(VoiceConnectionStatus.Ready, () => onReadyToPlay(message.guild.id, queue, ytdlp))
  connection.on(VoiceConnectionStatus.Destroyed, () => {
    ytdlp.destroy()
    ytdlp.resetPlayer()
  })

  connection.subscribe(player)
}