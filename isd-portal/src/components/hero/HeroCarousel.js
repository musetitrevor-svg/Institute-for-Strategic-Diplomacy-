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

          <!-- Subhead Tag -->
          <p class="text-[11px] tracking-[0.25em] uppercase text-bronze-700 font-sans font-bold mb-4">
            Institute for Strategic Diplomacy
          </p>

          <!-- Main Serif Headline -->
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-900 tracking-tight leading-[1.1] mb-6">
            Advancing Sovereign &amp; Multilateral Statecraft.
          </h1>

          <!-- Descriptive Paragraph -->
          <p class="font-sans text-sm sm:text-base text-ink-600 max-w-2xl leading-relaxed font-light mb-10">
            An independent institute convening career diplomats, security scholars, and economists to publish rigorous, policy-actionable research across six specialized desks of statecraft.
          </p>

          <!-- Call to Action Button -->
          <div>
            <a href="#desks" class="inline-flex items-center justify-center px-8 py-3.5 rounded text-xs uppercase tracking-[0.2em] font-bold bg-bronze-600 text-paper hover:bg-bronze-500 transition-all shadow-md shadow-bronze-600/20">
              Explore Research Desks &rarr;
            </a>
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
}