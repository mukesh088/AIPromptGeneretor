/** All pinned prompts first, then the rest — preserves relative order within each group. */
export function sortPinnedFirst(list = []) {
  const pinned = []
  const rest = []
  for (const item of list) {
    if (item?.pinned) pinned.push(item)
    else rest.push(item)
  }
  return [...pinned, ...rest]
}
