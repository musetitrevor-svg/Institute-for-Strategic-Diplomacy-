import { renderIsdLiveLogo } from '../layout/IsdLiveLogo.js';

/**
 * Renders the institutional paper-white hero section.
 * @param {HTMLElement} container
 */
export function renderHeroCarousel(container) {
  if (!container) return;

  container.innerHTML = `
    <section class="relative bg-paper text-ink-900 overflow-hidden pt-12 pb-24 border-b border-ink-200">
      <!-- Subtle Grid Background Overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <div class="max-w-content mx-auto px-6 lg:px-10 relative z-10">
        <!-- Center-Aligned Institutional Hero Stack -->
        <div class="max-w-3xl mx-auto text-center flex flex-col items-center pt-4">
          
          <!-- Rotating Circular Seal Badge -->
          <div class="mb-8" id="hero-rotating-seal"></div>

          <!-- Institute name -->
          <p class="text-sm text-bronze-700 font-sans font-semibold mb-4">
            Institute for Strategic Diplomacy
          </p>

          <!-- Main Serif Headline -->
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-900 tracking-tight leading-[1.1] mb-6">
            Global affairs, made clear.
          </h1>

          <!-- Descriptive Paragraph -->
          <p class="font-sans text-base sm:text-lg text-ink-700 max-w-2xl leading-relaxed mb-10">
            ISD is an independent research group based in Nairobi. Our analysts, economists, and policy experts turn complex world issues into research you can trust and use.
          </p>

          <!-- Call to Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              data-scroll-target="briefs"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded text-sm font-bold bg-bronze-600 text-paper hover:bg-bronze-500 transition-colors shadow-md shadow-bronze-600/20 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600 focus-visible:ring-offset-2"
            >
              Read our latest briefs
            </button>
            <button
              type="button"
              data-scroll-target="advisory"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded text-sm font-bold border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-paper transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600 focus-visible:ring-offset-2"
            >
              Work with us
            </button>
          </div>
        </div>
      </div>
    </section>
  `;

  // Inject the rotating seal into its designated container slot
  const sealContainer = container.querySelector('#hero-rotating-seal');
  if (sealContainer) {
    sealContainer.innerHTML = renderIsdLiveLogo();
  }

  // Smooth-scroll buttons. Using scrollIntoView (not #anchor links) because
  // changing the hash triggers the hashchange handler in main.js, which
  // re-renders the whole page and jumps back to the top.
  container.querySelectorAll('[data-scroll-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.getAttribute('data-scroll-target'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}