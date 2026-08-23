import { DESKS } from '../../config/constants.js';

/**
 * Renders the six-desk grid as compact, uniform thumbnails with interactive filtering.
 * @param {HTMLElement} container
 */
export function renderDeskGrid(container) {
  if (!container) return;

  const desks = Array.isArray(DESKS) ? DESKS.filter(Boolean) : [];

  container.innerHTML = `
    <section id="desks" class="bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto px-6 lg:px-10 py-20">
        <p class="eyebrow">Research Structure</p>
        <h2 class="font-serif text-headline text-ink-900 mt-3">The Six Statecraft &amp; Academic Desks</h2>
        <div class="section-rule"></div>

        ${desks.length === 0 ? `
          <p class="font-sans text-ink-400 text-sm">Desk information is currently unavailable.</p>
        ` : `
          <div class="grid grid-cols-2 md:grid-cols-3 gap-px bg-ink-100 border border-ink-100">
            ${desks.map(desk => `
              <div 
                data-desk-name="${desk.name ?? ''}"
                class="desk-card group bg-paper hover:bg-ink-900 transition-colors duration-200 p-6 flex flex-col justify-between min-h-[140px] cursor-pointer"
              >
                <div class="flex items-center justify-between">
                  <span class="text-[11px] tracking-[0.16em] uppercase text-bronze-600 group-hover:text-bronze-400 font-sans">
                    ${desk.category ?? ''}
                  </span>
                  <span class="text-xs text-bronze-600 group-hover:text-bronze-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ➔
                  </span>
                </div>

                <div class="mt-4">
                  <h3 class="font-serif text-lg text-ink-900 group-hover:text-paper transition-colors">
                    ${desk.name ?? 'Untitled Desk'}
                  </h3>
                  <p class="font-sans text-xs text-ink-400 group-hover:text-ink-300 mt-1 flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-bronze-500"></span>
                    ${desk.head ?? ''}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </section>
  `;

  // Attach Event Listeners for Smooth Scroll & Auto-Filtering
  container.querySelectorAll('.desk-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const deskName = e.currentTarget.getAttribute('data-desk-name');
      if (!deskName) return;

      // 1. Dispatch custom filter event to PublishedBriefs
      window.dispatchEvent(new CustomEvent('isd:filter-desk', { detail: { deskName } }));

      // 2. Smoothly scroll down to the publications section
      const targetSection = document.querySelector('#publications') || document.querySelector('#publications-container');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}