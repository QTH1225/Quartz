import { RecentNotes } from "../../../recent-notes/dist/components/index.js"

export function MobileRecentNotes(options = {}) {
  return RecentNotes({ ...options, mobileDisclosure: true })
}
