import { ChannelType, Client, hideLinkEmbed, hyperlink, userMention } from "discord.js";
import { githubAccountMap } from "../../../configs/githubAccountMap"
import { getHMAC } from "src/utils/crypto";
import { IGithubPullRequest } from './interfaces/IGithubPullRequest'
import { IGithubAccountMapItem } from './interfaces/IGithubAccountMapItem'
import { GITHUB_PULL_REQUEST_ACTION } from "./consts/githubPullRequestAction"
import { GITHUB_USER_ROLE } from "./consts/githubUserRole"
import { isDraftPullRequest } from "./consts/isDraftPullRequest"

export class GithubNotifier {
  private client: Client;

  private readonly processedStatuses = [
    GITHUB_PULL_REQUEST_ACTION.OPENED,
    GITHUB_PULL_REQUEST_ACTION.EDITED,
    GITHUB_PULL_REQUEST_ACTION.REVIEW_REQUESTED,
  ]

  private readonly frontEndTextChannelId =
    process.env.GITHUB_NOTIFIER_FRONT_END_TEXT_CHANNEL_ID || "";

  private readonly backEndTextChannelId =
    process.env.GITHUB_NOTIFIER_BACK_END_TEXT_CHANNEL_ID || "";

  private readonly secret = process.env.GITHUB_SECRET || "";

  constructor(client: Client) {
    this.client = client;
  }

  getHttpReceiverEventListener() {
    return this.httpReceiverEventListener.bind(this);
  }

  async sendMessageToTextChannel(textChannelId: string, message: string) {
    if (!textChannelId) return;

    this.client.channels
      .fetch(textChannelId)
      .then((channel) => {
        if (!channel || channel.type !== ChannelType.GuildText) {
          return console.log(
            `Channel is missing or wrong type: ${channel?.type}`
          );
        }

        channel.send(message);
      })
      .catch((e) => {
        console.log(`Cannot fetch text channel id: ${textChannelId}`);
      });
  }

  private async httpReceiverEventListener(req, res) {
    const headers = req.headers;
    const body = req.body;
    const headersJSON = JSON.stringify(headers);
    const bodyJSON = JSON.stringify(body);

    if (this.verifyRequest(headers, body)) {
      this.httpReceiverEventListenerOnSuccess(body)
      res.send("OK");

      return
    }

    this.httpReceiverEventListenerOnError(headersJSON, bodyJSON)
    res.status(403).send("403");
  }

  private httpReceiverEventListenerOnError (headersJSON, bodyJSON) {
    console.log(
      `[GithubNotifier] 403 headers: ${headersJSON} body: ${bodyJSON}`
    );    
  }

  private httpReceiverEventListenerOnSuccess (payload: IGithubPullRequest) {    
    if (!this.processedStatuses.includes(payload.action)) return

    const sender = payload.sender.login
    const receiver = this.getLoginOfReceiver(payload)

    const senderAccountConfig = this.getAccountConfig(sender)
    if (!senderAccountConfig) return

    const receiverAccountConfig = receiver
      ? this.getAccountConfig(receiver)
      : null

    const message = this.getNotifyMessage(sender, receiver, senderAccountConfig, receiverAccountConfig, payload)
    if (!message) return

    this.sendMessageToTextChannel(
      this.getTextChannelId(receiverAccountConfig || senderAccountConfig),
      message
    )
  }

  private getLoginOfReceiver (payload: IGithubPullRequest): string | null {
    if (payload.action === GITHUB_PULL_REQUEST_ACTION.REVIEW_REQUESTED) {
      return payload.requested_reviewer!.login
    }

    return null
  }
 
  private getAccountConfig (login: string): IGithubAccountMapItem | null {
    const config = githubAccountMap[login]

    if (!config) {
      console.log(`unknow github user: ${login}`)
      return null
    }

    return config
  }

  private getTextChannelId (config: IGithubAccountMapItem): string {
    return config.role === GITHUB_USER_ROLE.FRONT_END 
      ? this.frontEndTextChannelId 
      : this.backEndTextChannelId
  }

  private getNotifyMessage (
    sender: string,
    receiver: string | null,
    senderAccountConfig: IGithubAccountMapItem,
    receiverAccountConfig: IGithubAccountMapItem | null,
    payload: IGithubPullRequest
  ): string | null {
    const action = payload.action
    const senderText = hyperlink(sender, hideLinkEmbed(payload.sender.html_url))
    const prUrl = payload.pull_request.html_url

    if (action === GITHUB_PULL_REQUEST_ACTION.OPENED) {
      if (isDraftPullRequest(payload.pull_request.title)) return null

      return `new PR from ${senderText} - ${prUrl}`
    }

    if (action === GITHUB_PULL_REQUEST_ACTION.EDITED) {
      const isWasDraft = isDraftPullRequest(payload.changes?.title?.from) && !isDraftPullRequest(payload.pull_request.title)
      if (!isWasDraft) return null

      return `PR from ${senderText} - ${prUrl}`
    }

    if (action === GITHUB_PULL_REQUEST_ACTION.REVIEW_REQUESTED) {
      const reviewerMention = userMention(receiverAccountConfig!.discordId)

      return `${senderText} assigned ${reviewerMention} for review in ${prUrl}`
    }

    return null
  } 

  private verifyRequest(
    headers: Record<string, string>,
    data: object
  ): boolean {
    if (!this.secret) return false;

    const signatureFromRequest = headers["x-hub-signature-256"];
    if (!signatureFromRequest) return false;

    const algorithm = "sha256";
    const dataStr = JSON.stringify(data);
    const hmac = getHMAC(algorithm, dataStr, this.secret);
    const signatureCalculated = `${algorithm}=${hmac}`;

    return signatureFromRequest === signatureCalculated;
  }
}
