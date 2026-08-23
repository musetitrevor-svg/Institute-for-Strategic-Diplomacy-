import { DIRECTOR } from '../../config/constants.js';

/**
 * Renders the Director-General profile section with institutional paper styling.
 * @param {HTMLElement} container
 */
export function renderDirectorProfile(container) {
  if (!container) return;

  container.innerHTML = `
    <section id="director" class="py-24 bg-paper border-b border-ink-200">
      <div class="max-w-content mx-auto px-6 lg:px-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Director Portrait / Placeholder Frame -->
          <div class="lg:col-span-5 relative">
            <div class="relative aspect-[4/5] rounded border border-ink-300 overflow-hidden bg-ink-100 shadow-md">
              <img 
                src="${DIRECTOR.photo}" 
                alt="${DIRECTOR.name}" 
                class="w-full h-full object-cover grayscale contrast-125"
                onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop'"
              />
              <div class="absolute inset-0 ring-1 ring-inset ring-ink-900/10 pointer-events-none"></div>
            </div>
            <!-- Decorative Accent Frame -->
            <div class="absolute -bottom-4 -right-4 w-full h-full border border-bronze-600/30 rounded -z-10 pointer-events-none hidden sm:block"></div>
          </div>

          <!-- Director Bio & Institutional Statement -->
          <div class="lg:col-span-7 flex flex-col justify-center">
            <p class="text-[11px] uppercase tracking-[0.25em] text-bronze-700 font-sans font-bold mb-3">
              Office of the Director-General
            </p>
            <h2 class="font-serif text-3xl sm:text-4xl text-ink-900 tracking-tight mb-2">
              ${DIRECTOR.name}
            </h2>
            <p class="font-sans text-xs uppercase tracking-[0.15em] text-bronze-800 font-semibold mb-6">
              ${DIRECTOR.title}
            </p>
            <div class="w-12 h-0.5 bg-bronze-600 mb-6"></div>
            <p class="font-sans text-sm sm:text-base text-ink-600 leading-relaxed font-light mb-8">
              ${DIRECTOR.bio}
            </p>
            
            <div>
              <a href="#briefs" class="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-bold text-bronze-700 hover:text-bronze-800 transition-colors">
                View Director's Publications &rarr;
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}