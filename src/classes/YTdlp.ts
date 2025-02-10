import { AudioPlayerStatus, createAudioPlayer, createAudioResource } from "@discordjs/voice";
import { spawn } from "child_process";
import { ChildProcessWithoutNullStreams } from "child_process"
import { Readable } from "stream"

export class YTdlp {
	private ytdlp: ChildProcessWithoutNullStreams | null = null
	private player = createAudioPlayer();

	getPlayer() {
		return this.player
	}

	stop() {
		const statuesToSkip = [
			AudioPlayerStatus.Playing,
			AudioPlayerStatus.Paused,
		]

		if (!statuesToSkip.includes(this.player.state.status)) return

		this.destroy()
		this.player.stop(true)
	}

	resetPlayer() {
		this.player = createAudioPlayer(); 	// reset play on's
	}

	spawnProccess (url: string) {
		this.destroy()
		this.ytdlp = spawn(
			'yt-dlp',
			[
				'-q',
				// TODO: сделать так, чтобы выбирался самый оптимальный формат со звуком
				url,
				'--cookies',
				process.env.COOKIE_PATH,
				'-o',
				'-'
			])

		const stream = new Readable()
		stream._read = () => {}

		const resource = createAudioResource(stream);
		this.player.play(resource)

		this.ytdlp.stdout.on('data', (data) => {
			console.debug("data", data)
			stream.push(data)
		})

		this.ytdlp.stderr.on('data', (data) => {
			console.error(new TextDecoder('UTF-8').decode(data))
		})
	}

	destroy() {
		if (!this.ytdlp) return
		this.ytdlp.stdout.destroy()
		this.ytdlp = null
	}
}