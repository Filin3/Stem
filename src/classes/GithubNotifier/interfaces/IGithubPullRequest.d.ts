import { IGithubUser } from '../interfaces/IGithubUser'
import { IGithubPullRequestPullRequest } from '../interfaces/IGithubPullRequestPullRequest'
import { IGithubPullRequestChanges } from '../interfaces/IGithubPullRequestChanges'
import { GITHUB_PULL_REQUEST_ACTION } from '../consts/githubPullRequestAction'

export declare interface IGithubPullRequest {
  action: GITHUB_PULL_REQUEST_ACTION
  pull_request: IGithubPullRequestPullRequest
  sender: IGithubUser
  requested_reviewer?: IGithubUser
  changes?: IGithubPullRequestChanges
}