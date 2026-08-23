/**
 * Renders the professional top navigation bar for the Institute for Strategic Diplomacy.
 * @param {HTMLElement} container
 */
export function renderNavbar(container) {
  if (!container) return;

  container.innerHTML = `
    <header class="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-ink-200 shadow-xs">
      <div class="max-w-content mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        
        <!-- Brand / Logo Section (Left) -->
        <a href="#" class="flex items-center gap-3.5 group">
          <div class="w-11 h-11 rounded-full border border-bronze-600 flex items-center justify-center bg-paper shadow-xs transition-transform group-hover:scale-105">
            <span class="font-serif text-xs font-bold tracking-widest text-bronze-800">ISD</span>
          </div>
          <div class="flex flex-col">
            <span class="font-serif text-sm lg:text-base font-bold tracking-tight text-ink-900 uppercase leading-none mb-1">
              Institute for Strategic Diplomacy
            </span>
            <span class="text-[9px] uppercase tracking-[0.2em] text-bronze-700 font-sans font-semibold">
              Statecraft &amp; Geopolitical Intelligence
            </span>
          </div>
        </a>

        <!-- Navigation Links (Center / Right Desktop) -->
        <nav class="hidden md:flex items-center gap-8 font-sans text-xs uppercase tracking-[0.15em] font-medium text-ink-700">
          <a href="#briefs" class="hover:text-bronze-700 transition-colors">Policy Briefs</a>
          <a href="#desks" class="hover:text-bronze-700 transition-colors">Research Desks</a>
          <a href="#leadership" class="hover:text-bronze-700 transition-colors">Leadership</a>
          <a href="#advisory" class="hover:text-bronze-700 transition-colors">Advisory</a>
          <a href="#about" class="hover:text-bronze-700 transition-colors">About</a>
        </nav>

        <!-- Action / Portal CTA (Far Right) -->
        <div class="flex items-center gap-4">
          <a href="#portal" class="hidden sm:inline-flex items-center px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-[0.2em] bg-bronze-600 text-paper hover:bg-bronze-500 transition-all shadow-xs">
            Member Portal
          </a>
          
          <!-- Mobile Hamburger Toggle -->
          <button id="mobile-menu-toggle" aria-label="Toggle Mobile Menu" class="md:hidden text-ink-900 hover:text-bronze-700 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

      </div>
    </header>
  `;
}