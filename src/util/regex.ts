export const escapeRegExp = (string: string) => {
  return string.toString().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
