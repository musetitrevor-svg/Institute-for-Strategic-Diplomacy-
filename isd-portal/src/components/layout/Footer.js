const CONTACTS = [
  ['General enquiries', 'info@instituteforstrategicdiplomacy.org'],
  ['Research', 'isdresearch@instituteforstrategicdiplomacy.org'],
  ['Secretariat', 'secretariat@instituteforstrategicdiplomacy.org'],
  ["Director's office", 'director@instituteforstrategicdiplomacy.org'],
];

export function renderFooter(container) {
  if (!container) return;

  container.innerHTML = `
    <div class="bg-ink-950 text-ink-300 border-t border-ink-800">
      <div class="max-w-content mx-auto px-6 lg:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <p class="font-serif text-lg text-paper">Institute for Strategic Diplomacy</p>
          <p class="mt-3 text-sm leading-relaxed">Independent research that makes global affairs clear, reliable, and useful.</p>
          <p class="mt-4 text-sm text-bronze-300">Nairobi, Kenya</p>
        </div>
        <div>
          <h2 class="text-xs uppercase tracking-[0.18em] font-bold text-paper">Explore</h2>
          <nav class="mt-4 space-y-3 text-sm">
            <a href="#briefs" data-scroll-target="briefs" class="block hover:text-bronze-300">Policy briefs</a>
            <a href="#desks" data-scroll-target="desks" class="block hover:text-bronze-300">Research desks</a>
            <a href="#leadership" data-scroll-target="leadership" class="block hover:text-bronze-300">Leadership</a>
            <a href="#fellowship" data-scroll-target="fellowship" class="block hover:text-bronze-300">Fellowship</a>
          </nav>
        </div>
        <div>
          <h2 class="text-xs uppercase tracking-[0.18em] font-bold text-paper">Contact</h2>
          <dl class="mt-4 space-y-3 text-sm">
            ${CONTACTS.map(([label, email]) => `<div><dt class="text-ink-500">${label}</dt><dd><a class="hover:text-bronze-300 break-all" href="mailto:${email}">${email}</a></dd></div>`).join('')}
          </dl>
        </div>
        <div>
          <h2 class="text-xs uppercase tracking-[0.18em] font-bold text-paper">Member portal</h2>
          <p class="mt-4 text-sm leading-relaxed">Access your research workspace and internal tools.</p>
          <a href="#portal" class="inline-flex mt-5 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded bg-bronze-600 text-paper hover:bg-bronze-500">Sign in</a>
        </div>
      </div>
      <div class="border-t border-ink-800"><div class="max-w-content mx-auto px-6 lg:px-10 py-5 text-xs text-ink-500">&copy; ${new Date().getFullYear()} Institute for Strategic Diplomacy. All rights reserved.</div></div>
    </div>
  `;

  container.querySelectorAll('[data-scroll-target]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById(link.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
