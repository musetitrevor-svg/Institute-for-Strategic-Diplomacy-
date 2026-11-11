// src/components/GeopoliticalWire.js
import { supabase } from '../config/supabaseClient';

const REGIONS = [
  "All Regions",
  "Horn of Africa",
  "Red Sea & Gulf of Aden",
  "Great Lakes",
  "East Africa",
  "Global Focus"
];

export async function renderGeopoliticalWire(container) {
  if (!container) return;

  // 1. Initial Skeleton Loader Frame
  container.innerHTML = `
    <section id="wire" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200 font-sans">
      <div class="max-w-content mx-auto space-y-8 animate-pulse">
        <div class="h-6 bg-ink-200 w-1/4 rounded"></div>
        <div class="h-10 bg-ink-100 w-full rounded"></div>
        <div class="space-y-4">
          <div class="h-24 bg-ink-100 rounded"></div>
          <div class="h-24 bg-ink-100 rounded"></div>
        </div>
      </div>
    </section>
  `;

  let dispatches = [];
  try {
    const { data: wires, error } = await supabase
      .from('geopolitical_wire')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && wires && wires.length > 0) {
      dispatches = wires;
    } else {
      // Operational Fallback Array if database table is empty or unpopulated
      dispatches = [
        {
          id: '1',
          title: 'Maritime Security Dynamics in the Bab-el-Mandeb Strait',
          region: 'Red Sea & Gulf of Aden',
          impact_level: 'High Alert',
          summary: 'Increased patrol activity and commercial rerouting across key shipping lanes impact East African port transit timelines.',
          full_analysis: 'Commercial transit vectors through the Bab-el-Mandeb continue to experience operational friction. Naval escorts remain primary mitigation for regional logistics providers.',
          analyst_name: 'ISD Strategy Desk',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Tripartite Diplomatic Consultations on Horn Stability',
          region: 'Horn of Africa',
          impact_level: 'Strategic Watch',
          summary: 'Regional envoys convene to evaluate cross-border security protocols and trade corridor continuity.',
          full_analysis: 'Diplomatic envoys from neighboring sovereign bodies have initiated multilateral dialogues aimed at bolstering border security frameworks and preventing trade disruption.',
          analyst_name: 'Trevor Museti',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Protection of Citizens & Regional Trade Corridors',
          region: 'East Africa',
          impact_level: 'Routine Monitoring',
          summary: 'Diplomatic advisories issued regarding cross-border residency protocols and merchant transit safeguards.',
          full_analysis: 'Bilateral security commissions continue monitoring regional urban hubs to ensure complete compliance with East African Community trade and mobility protocols.',
          analyst_name: 'ISD Strategy Desk',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
    }
  } catch (err) {
    console.error("Wire fetch error:", err);
  }

  let selectedRegion = "All Regions";
  let searchQuery = "";

  // 2. Interactive Data Matrix Render Engine
  function renderTracker() {
    const filteredDispatches = dispatches.filter(item => {
      const itemRegion = item.region || 'Global Focus';
      const matchesRegion = selectedRegion === "All Regions" || itemRegion.toLowerCase() === selectedRegion.toLowerCase();
      const matchesSearch = !searchQuery || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.full_analysis?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRegion && matchesSearch;
    });

    container.innerHTML = `
      <section id="wire" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200 font-sans">
        <div class="max-w-content mx-auto space-y-8">
          
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-ink-200 pb-6">
            <div>
              <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold">Real-Time Security & Intelligence</span>
              <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">Geopolitical Risk Matrix</h2>
              <p class="text-ink-600 text-sm mt-1 max-w-xl">
                Live security monitoring, diplomatic dispatches, and economic corridor updates from ISD research desks.
              </p>
            </div>
            <div class="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="font-bold uppercase tracking-wider text-[10px]">Live Feed Active</span>
            </div>
          </div>

          <!-- Interactive Control Bar -->
          <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-ink-50/70 p-4 rounded-lg border border-ink-200">
            
            <!-- Region Filter Tabs -->
            <div class="flex flex-wrap items-center gap-2">
              ${REGIONS.map(reg => `
                <button 
                  data-region="${reg}"
                  class="wire-region-btn text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer ${
                    selectedRegion.toLowerCase() === reg.toLowerCase()
                      ? 'bg-ink-900 text-paper shadow-xs'
                      : 'bg-paper text-ink-700 hover:bg-ink-100 border border-ink-200'
                  }"
                >
                  ${reg}
                </button>
              `).join('')}
            </div>

            <!-- Search Input -->
            <div class="relative min-w-[260px]">
              <input 
                type="text" 
                id="wire-search-input" 
                value="${searchQuery}"
                placeholder="Search alerts, keywords, or dispatches..."
                class="w-full px-3.5 py-2 text-xs bg-paper border border-ink-300 text-ink-900 rounded focus:border-bronze-600 focus:outline-none placeholder-ink-400"
              />
            </div>

          </div>

          <!-- Counter Banner -->
          <div class="text-xs text-ink-500 uppercase tracking-wider font-sans">
            Showing <span class="text-ink-900 font-bold">${filteredDispatches.length}</span> active risk dispatch${filteredDispatches.length === 1 ? '' : 'es'}
          </div>

          <!-- Dispatch Items List -->
          ${filteredDispatches.length === 0 ? `
            <div class="p-10 text-center border border-dashed border-ink-300 rounded-lg bg-ink-50">
              <p class="font-serif text-ink-800 text-base">No intelligence updates matching your selected criteria.</p>
              <p class="text-xs text-ink-500 mt-1">Try selecting a different region or clearing your search term.</p>
            </div>
          ` : `
            <div class="space-y-4">
              ${filteredDispatches.map(item => `
                <article class="bg-paper border border-ink-200 hover:border-bronze-500 rounded-lg p-6 transition-all duration-300 space-y-3 relative overflow-hidden shadow-xs hover:shadow-md">
                  
                  <!-- Top Accent Line -->
                  <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bronze-600 to-bronze-400 opacity-0 hover:opacity-100 transition-opacity"></div>

                  <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] font-sans">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-bronze-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-bronze-500"></span>
                        ${item.region || 'Global Focus'}
                      </span>
                      <span class="text-ink-300">&bull;</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.impact_level === 'High Alert' ? 'bg-red-100 text-red-800 border border-red-200' :
                        item.impact_level === 'Strategic Watch' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-ink-100 text-ink-700'
                      }">
                        ${item.impact_level || 'Routine Monitoring'}
                      </span>
                    </div>
                    <span class="text-ink-400 font-sans">
                      ${new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC &bull; ${new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 class="font-serif text-xl font-bold text-ink-900 leading-snug">
                    ${item.title}
                  </h3>
                  
                  <p class="text-ink-600 text-xs md:text-sm leading-relaxed font-serif">
                    ${item.summary || item.full_analysis || ''}
                  </p>

                  ${item.full_analysis && item.summary && item.full_analysis !== item.summary ? `
                    <details class="text-xs text-ink-500 pt-2 border-t border-ink-100 font-sans">
                      <summary class="cursor-pointer text-bronze-700 hover:text-bronze-900 font-bold uppercase tracking-wider text-[10px]">
                        Expand Strategic Analysis Briefing ▾
                      </summary>
                      <p class="mt-3 text-ink-800 leading-relaxed font-serif bg-ink-50 p-4 rounded border border-ink-200 text-xs md:text-sm">
                        ${item.full_analysis}
                      </p>
                    </details>
                  ` : ''}

                  <div class="pt-3 border-t border-ink-100 flex items-center justify-between text-xs font-sans text-ink-500">
                    <span>Authored by: <strong class="text-ink-800">${item.analyst_name || 'ISD Strategy Desk'}</strong></span>
                    <span class="text-bronze-700 font-semibold uppercase tracking-wider text-[10px]">Dispatch #${item.id}</span>
                  </div>
                </article>
              `).join('')}
            </div>
          `}

        </div>
      </section>
    `;

    // Attach Region Tab Listeners
    container.querySelectorAll('.wire-region-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        selectedRegion = e.currentTarget.getAttribute('data-region');
        renderTracker();
      });
    });

    // Attach Search Input Listener
    const searchInput = container.querySelector('#wire-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderTracker();
        const updatedInput = container.querySelector('#wire-search-input');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      });
    }
  }

  renderTracker();
}