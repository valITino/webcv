// The exhibit registry maps each clickable case file to its metadata.
// `key` is used for i18n lookups (title/code), `id` drives the store + camera focus.
export const EXHIBITS = [
  { id: 'subject', no: 'A', key: 'subject' },
  { id: 'skills', no: 'B', key: 'skills' },
  { id: 'record', no: 'C', key: 'record' },
  { id: 'credentials', no: 'D', key: 'credentials' },
  { id: 'cases', no: 'E', key: 'cases' },
  { id: 'testimonials', no: 'F', key: 'testimonials' },
]

export const EXHIBIT_IDS = EXHIBITS.map((e) => e.id)

export function getExhibit(id) {
  return EXHIBITS.find((e) => e.id === id) || null
}
