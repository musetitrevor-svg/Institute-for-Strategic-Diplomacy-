/**
 * Escapes HTML special characters in untrusted strings before interpolation.
 * Use for any user- or DB-sourced text rendered via innerHTML.
 */
export function escapeHTML(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Safe querySelector that never throws on a null root. */
export function qs(root, selector) {
  return root ? root.querySelector(selector) : null;
}
