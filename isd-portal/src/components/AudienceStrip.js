export function renderAudienceStrip(container) {
  if (!container) return;

  const audiences = [
    ['Students', 'Build a clearer foundation in foreign policy and international affairs.', 'Explore the desks', 'desks'],
    ['Researchers', 'Follow practical analysis and contribute to a growing research community.', 'Read the briefs', 'briefs'],
    ['Decision-makers', 'Use concise, reliable context for policy, strategy, and engagement.', 'Work with us', 'advisory'],
  ];

  container.innerHTML = `
    <section class="py-16 px-6 lg:px-10 bg-ink-50 border-t border-ink-200">
      <div class="max-w-content mx-auto">
        <div class="max-w-2xl mb-9"><p class="eyebrow">Who we serve</p><h2 class="font-serif text-3xl text-ink-900 mt-3">Useful research for people who need to understand the world.</h2></div>
        <div class="grid md:grid-cols-3 gap-6">
          ${audiences.map(([title, text, action, target]) => `<article class="bg-paper border border-ink-200 rounded-lg p-6"><h3 class="font-serif text-xl text-ink-900">${title}</h3><p class="mt-3 text-sm text-ink-600 leading-relaxed">${text}</p><button type="button" data-scroll-target="${target}" class="mt-5 text-sm font-bold text-bronze-700 hover:text-ink-900">${action} &rarr;</button></article>`).join('')}
        </div>
      </div>
    </section>
  `;

  container.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
}
