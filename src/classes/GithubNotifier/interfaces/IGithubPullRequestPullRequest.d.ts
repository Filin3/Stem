export declare interface IGithubPullRequestPullRequest {
    html_url: string,
    state: 'open' | 'close', // TODO
    locked: boolean,
    title: string,
}