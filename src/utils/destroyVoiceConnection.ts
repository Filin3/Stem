import { getVoiceConnection } from "@discordjs/voice"

export const destroyVoiceConnection = (guildId: string) => {
	const voiceConnection = getVoiceConnection(guildId)
	voiceConnection?.destroy()
}