export function renderNewsletterSignup(container) {
  if (!container) return;
  const destination = 'info@instituteforstrategicdiplomacy.org';

  container.innerHTML = `
    <section class="py-14 px-6 lg:px-10 bg-ink-900 text-paper">
      <div class="max-w-content mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-7">
        <div><p class="eyebrow text-bronze-300">Stay informed</p><h2 class="font-serif text-3xl mt-2">Get new briefs by email.</h2><p class="mt-2 text-sm text-ink-300">Occasional updates from the Institute. No noise.</p></div>
        <form id="newsletter-form" class="flex w-full md:w-auto flex-col sm:flex-row gap-3">
          <label class="sr-only" for="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" required placeholder="you@example.com" class="min-w-0 sm:w-72 px-4 py-3 text-sm rounded text-ink-900 bg-paper" />
          <button type="submit" class="px-5 py-3 text-sm font-bold rounded bg-bronze-600 hover:bg-bronze-500">Subscribe</button>
        </form>
      </div>
    </section>
  `;
  container.querySelector('#newsletter-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = container.querySelector('#newsletter-email').value;
    window.location.href = `mailto:${destination}?subject=${encodeURIComponent('Newsletter subscription')}&body=${encodeURIComponent(`Please add ${email} to the ISD newsletter.`)}`;
  });
}
