// src/components/PublishedBriefs.js
import { supabase } from '../config/supabaseClient';
import { openBriefModal } from './BriefModal';

const OFFICIAL_DESKS = [
  "All Research Desks",
  "Foreign Policy",
  "Global Security",
  "IPE & Development",
  "Multilateralism",
  "Cyber Diplomacy",
  "Diplomatic Practice"
];

export async function renderPublishedBriefs(container) {
  if (!container) return;

  // Show Skeleton Loader
  container.innerHTML = `
    <section id="briefs" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto space-y-8 animate-pulse">
        <div class="h-8 bg-ink-200 w-1/3 rounded"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="h-64 bg-ink-100 rounded"></div>
          <div class="h-64 bg-ink-100 rounded"></div>
          <div class="h-64 bg-ink-100 rounded"></div>
        </div>
      </div>
    </section>
  `;

  let briefs = [];
  try {
    const { data, error } = await supabase
      .from('policy_briefs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (!error && data) {
      briefs = data.filter(b => 
        b.title && 
        !b.title.toLowerCase().includes('test') && 
        !b.abstract?.toLowerCase().includes('test')
      );
    }
  } catch (err) {
    console.error("Error fetching briefs:", err);
  }

  let activeDesk = "All Research Desks";

  function renderGrid() {
    const filteredBriefs = activeDesk === "All Research Desks"
      ? briefs
      : briefs.filter(b => 
          b.desk_name?.toLowerCase() === activeDesk.toLowerCase() || 
          b.category?.toLowerCase() === activeDesk.toLowerCase()
        );
    const featuredBrief = activeDesk === "All Research Desks" ? filteredBriefs[0] : null;
    const cardBriefs = featuredBrief ? filteredBriefs.slice(1) : filteredBriefs;
    const readingTime = (brief) => `${Math.max(1, Math.ceil((brief.body || brief.abstract || '').trim().split(/\s+/).filter(Boolean).length / 220))} min read`;

    container.innerHTML = `
      <section id="briefs" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200">
        <div class="max-w-content mx-auto space-y-10">
          
          <!-- Header -->
          <div class="border-b border-ink-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold font-sans">Repository & Intelligence</span>
              <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">Published Policy Briefs</h2>
              <p class="text-ink-600 text-sm mt-1 max-w-2xl">
                Clear, practical analysis from the Institute's research desks.
              </p>
            </div>
            <div class="text-xs font-sans text-ink-500 uppercase tracking-wider">
              Status: <span class="text-bronze-700 font-bold">&bull; Verified Peer-Reviewed</span>
            </div>
          </div>

          <!-- Desk Filter Tabs -->
          <div class="flex flex-wrap items-center gap-2 border-b border-ink-100 pb-4 font-sans">
            ${OFFICIAL_DESKS.map(desk => `
              <button 
                data-desk="${desk}"
                class="desk-filter-btn text-xs font-semibold px-3 py-1.5 rounded transition-all cursor-pointer ${
                  activeDesk === desk 
                    ? 'bg-ink-900 text-paper border border-ink-900 shadow-xs' 
                    : 'bg-paper text-ink-700 hover:bg-ink-100 border border-ink-200'
                }"
              >
                ${desk}
              </button>
            `).join('')}
          </div>

          <!-- Brief Counter Banner -->
          <div class="text-xs font-sans uppercase tracking-wider text-ink-500">
            Showing <span class="text-ink-900 font-bold">${filteredBriefs.length}</span> published policy brief${filteredBriefs.length === 1 ? '' : 's'}
          </div>

          <!-- Brief Cards Grid -->
          ${filteredBriefs.length === 0 ? `
            <div class="p-12 text-center border border-dashed border-ink-300 rounded-lg bg-ink-50/50">
              <p class="font-serif text-ink-700 text-lg">There are no briefs here yet.</p>
              <p class="text-xs text-ink-500 mt-1 font-sans">Please check back soon, or choose another research desk.</p>
            </div>
          ` : `
            ${featuredBrief ? `
              <article data-brief-id="${featuredBrief.id}" class="brief-card group bg-ink-900 text-paper rounded-lg p-7 md:p-9 cursor-pointer border border-ink-800 hover:border-bronze-500 transition-colors">
                <p class="text-xs uppercase tracking-[0.18em] text-bronze-300 font-bold">Featured brief &bull; ${featuredBrief.desk_name || featuredBrief.category || 'General Policy'}</p>
                <h3 class="font-serif text-2xl md:text-3xl mt-4 max-w-3xl">${featuredBrief.title}</h3>
                <p class="mt-4 text-sm leading-relaxed text-ink-300 max-w-3xl">${featuredBrief.abstract || featuredBrief.body || ''}</p>
                <div class="mt-6 pt-4 border-t border-ink-700 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-300"><span>By ${featuredBrief.author_name || 'ISD Editorial Desk'}</span><span>${new Date(featuredBrief.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span><span>${readingTime(featuredBrief)}</span></div>
              </article>
            ` : ''}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${cardBriefs.map(brief => `
                <article 
                  data-brief-id="${brief.id}"
                  class="brief-card group bg-paper border border-ink-200 hover:border-bronze-500 rounded-lg p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer relative overflow-hidden"
                >
                  <!-- Top Gold Accent Line on Hover -->
                  <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bronze-600 via-bronze-400 to-bronze-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div class="space-y-3">
                    <div class="flex items-center justify-between text-[11px] font-sans text-bronze-700 uppercase tracking-wider">
                      <span class="font-bold flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-bronze-500"></span>
                        ${brief.desk_name || brief.category || 'General Policy'}
                      </span>
                      <span class="text-ink-400">
                        ${new Date(brief.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 class="font-serif text-xl font-bold text-ink-900 group-hover:text-bronze-700 transition-colors leading-snug">
                      ${brief.title}
                    </h3>

                    <p class="text-ink-600 text-xs leading-relaxed line-clamp-3 font-serif">
                      ${brief.abstract || brief.body || ''}
                    </p>
                  </div>

                  <div class="pt-4 border-t border-ink-100 flex items-center justify-between font-sans">
                    <span class="text-[11px] font-semibold text-ink-700">By ${brief.author_name || 'ISD Editorial Desk'} &bull; ${readingTime(brief)}</span>
                    <span class="text-xs font-bold text-bronze-700 group-hover:text-ink-900 transition-colors flex items-center gap-1">
                      Read Full Brief ➔
                    </span>
                  </div>

                </article>
              `).join('')}
            </div>
          `}

        </div>
      </section>
    `;

    // Attach Event Listeners to Desk Filters
    container.querySelectorAll('.desk-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeDesk = e.currentTarget.getAttribute('data-desk');
        renderGrid();
      });
    });

    // Attach Event Listeners to Cards to open Brief Modal
    container.querySelectorAll('.brief-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const briefId = e.currentTarget.getAttribute('data-brief-id');
        const selectedBrief = briefs.find(b => String(b.id) === String(briefId));
        if (selectedBrief) {
          openBriefModal(selectedBrief);
        }
      });
    });
  }

  // Listen for Desk Card Filter selection from DeskGrid component
  window.addEventListener('isd:filter-desk', (e) => {
    if (e.detail?.deskName) {
      activeDesk = e.detail.deskName;
      renderGrid();
    }
  });

  renderGrid();
}
