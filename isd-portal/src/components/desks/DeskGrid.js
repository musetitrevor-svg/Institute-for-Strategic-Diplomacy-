// src/components/desks/DeskGrid.js
import { DESKS } from '../../config/constants.js';

/**
 * Renders the six-desk grid as compact, uniform thumbnails with interactive filtering.
 * Uses plain-language descriptions and fallbacks for data consistency.
 * @param {HTMLElement} container
 */
export function renderDeskGrid(container) {
  if (!container) return;

  // Static plain-language fallback list matching ISD's official six research desks
  const DEFAULT_DESKS = [
    {
      name: "Foreign Policy",
      category: "Statecraft",
      head: "Rebecca Wanjiku",
      scope: "Analyzing foreign policy decisions, diplomatic strategies, and sovereign relations across East Africa and international partners.",
      icon: "🌐"
    },
    {
      name: "Global Security",
      category: "Statecraft",
      head: "George Ndungu",
      scope: "Tracking regional peace operations, counter-terrorism, maritime safety, and conflict prevention dynamics.",
      icon: "🛡️"
    },
    {
      name: "IPE & Development",
      category: "Academic",
      head: "Derick Abuti",
      scope: "Examining regional trade corridors, infrastructure investments, public debt, and economic integration.",
      icon: "📈"
    },
    {
      name: "Multilateralism",
      category: "Academic",
      head: "Penina Maina",
      scope: "Studying international bodies like the UN, AU, EAC, and IGAD to evaluate global cooperation and treaty frameworks.",
      icon: "🏛️"
    },
    {
      name: "Cyber Diplomacy",
      category: "Statecraft",
      head: "Lordin Maangi",
      scope: "Focusing on digital sovereignty, cybersecurity policies, AI governance, and technology regulations.",
      icon: "🔒"
    },
    {
      name: "Diplomatic Practice",
      category: "Statecraft",
      head: "Stanley Kasuti",
      scope: "Reviewing modern negotiation techniques, protocol standards, public diplomacy, and bilateral talks.",
      icon: "🖋️"
    }
  ];

  // Merge imported constant DESKS with plain-language fallbacks
  const sourceDesks = Array.isArray(DESKS) && DESKS.length > 0 ? DESKS : DEFAULT_DESKS;

  const desks = sourceDesks.map((d, index) => {
    const fallback = DEFAULT_DESKS[index] || DEFAULT_DESKS[0];
    return {
      name: d.name || fallback.name,
      category: d.category || fallback.category,
      head: d.head || d.lead || fallback.head,
      scope: d.scope || d.description || fallback.scope,
      icon: d.icon || fallback.icon
    };
  });

  container.innerHTML = `
    <section id="desks" class="bg-paper border-t border-ink-200 font-sans">
      <div class="max-w-content mx-auto px-6 lg:px-10 py-20 space-y-8">
        
        <!-- Section Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ink-200 pb-6">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold">Specialized Divisions</p>
            <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">The Six Research Desks</h2>
            <p class="text-ink-600 text-sm mt-1 max-w-2xl font-light">
              Our research output is divided across six specialized desks, providing focused analysis on critical regional and global issues.
            </p>
          </div>
          <span class="text-xs text-ink-500 uppercase tracking-wider font-semibold">
            Structure: <strong class="text-bronze-700">&bull; 6 Active Desks</strong>
          </span>
        </div>

        <!-- 6-Desk Compact Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-200 border border-ink-200 rounded-lg overflow-hidden shadow-xs">
          ${desks.map(desk => `
            <div 
              data-desk-name="${desk.name}"
              class="desk-card group bg-paper hover:bg-ink-900 transition-colors duration-300 p-6 flex flex-col justify-between min-h-[220px] cursor-pointer relative"
            >
              <!-- Top Accent Line -->
              <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bronze-600 to-bronze-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[11px] tracking-[0.18em] uppercase text-bronze-700 group-hover:text-bronze-400 font-bold">
                    ${desk.category}
                  </span>
                  <span class="text-base text-bronze-600 group-hover:text-bronze-400 font-bold transform group-hover:translate-x-1 transition-transform">
                    ➔
                  </span>
                </div>

                <div>
                  <h3 class="font-serif text-xl font-bold text-ink-900 group-hover:text-paper transition-colors">
                    ${desk.name}
                  </h3>
                  ${desk.head ? `
                    <p class="text-xs font-semibold text-bronze-700 group-hover:text-bronze-400 mt-0.5 flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-bronze-500"></span>
                      Lead: ${desk.head}
                    </p>
                  ` : ''}
                </div>

                <p class="text-xs text-ink-600 group-hover:text-ink-300 leading-relaxed font-serif pt-1">
                  ${desk.scope}
                </p>
              </div>

              <div class="pt-4 border-t border-ink-100 group-hover:border-ink-800 flex items-center justify-between text-[11px] font-semibold text-ink-500 group-hover:text-ink-400 transition-colors">
                <span>Filter Policy Briefs</span>
                <span class="text-bronze-600 group-hover:text-bronze-400">&bull; Explore</span>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    </section>
  `;

  // Attach Event Listeners for Smooth Scroll & Auto-Filtering
  container.querySelectorAll('.desk-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const deskName = e.currentTarget.getAttribute('data-desk-name');
      if (!deskName) return;

      // 1. Dispatch custom filter event to PublishedBriefs component
      window.dispatchEvent(new CustomEvent('isd:filter-desk', { detail: { deskName } }));

      // 2. Smoothly scroll down to the policy briefs section
      const targetSection = document.querySelector('#briefs') || document.querySelector('#publications') || document.querySelector('#publications-container');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}