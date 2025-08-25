export const isEpicPullRequest = (title?: string): boolean => {
    if (!title) return false
    const titleInLowerCase = title.toLocaleLowerCase()

    return titleInLowerCase.startsWith('epic') || titleInLowerCase.startsWith('[epic]')
}