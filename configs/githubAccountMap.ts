import { IGithubAccountMapItem } from '../src/classes/GithubNotifier/interfaces/IGithubAccountMapItem.d.ts'
import { GITHUB_USER_ROLE } from '../src/classes/GithubNotifier/consts/githubUserRole.ts'

export const githubAccountMap: Record<string, IGithubAccountMapItem> = {
  'GIT_HUB_LOGIN': {
    discordId: "DISCORD_SNOWFLAKE",
    role: GITHUB_USER_ROLE.FRONT_END
  }
} as const;
