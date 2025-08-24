export const isDraftPullRequest = (title?: string): boolean => {
  if (!title) return false
  const titleInLowerCase = title.toLocaleLowerCase()
  
  return titleInLowerCase.startsWith('draft') || titleInLowerCase.startsWith('[draft]')
}