// src/components/GeopoliticalWire.js
import { supabase } from '../config/supabaseClient';

export async function renderGeopoliticalWire(container) {
  if (!container) return;

  container.innerHTML = `
    <section id="wire" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto space-y-8">
        <div class="border-b border-ink-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold font-sans">Real-Time Intelligence</span>
            <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">The Geopolitical Wire</h2>
            <p class="text-ink-600 text-sm mt-1 max-w-2xl">
              Rapid situational analyses and flash commentaries on unfolding diplomatic events and multilateral shifts.
            </p>
          </div>
          <span class="text-xs font-sans text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Feed Active
          </span>
        </div>

        <div id="wire-feed-container" class="space-y-6">
          <div class="text-xs text-ink-500 animate-pulse font-sans">Connecting to diplomatic wire feed...</div>
        </div>
      </div>
    </section>
  `;

  const feedContainer = container.querySelector('#wire-feed-container');

  try {
    const { data: wires, error } = await supabase
      .from('geopolitical_wire')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error || !wires || wires.length === 0) {
      feedContainer.innerHTML = `
        <div class="p-8 border border-dashed border-ink-300 rounded-lg bg-ink-50 text-center">
          <p class="font-serif text-ink-800 text-base">No active wire dispatches at this hour.</p>
          <p class="text-xs text-ink-500 mt-1 font-sans">Analysts are currently monitoring global developments.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = wires.map(wire => `
      <article class="bg-paper border border-ink-200 hover:border-bronze-500 rounded-lg p-6 transition-all duration-300 grid grid-cols-1 ${wire.image_url ? 'md:grid-cols-3 gap-6' : ''} items-center">
        <div class="${wire.image_url ? 'md:col-span-2' : 'col-span-1'} space-y-3">
          <div class="flex items-center justify-between text-[11px] font-sans text-bronze-700 uppercase tracking-wider">
            <span class="font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-bronze-500"></span>
              ${wire.region || 'Global Focus'}
            </span>
            <span class="text-ink-400">
              ${new Date(wire.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC &bull; ${new Date(wire.created_at).toLocaleDateString()}
            </span>
          </div>
          <h3 class="font-serif text-xl font-bold text-ink-900 leading-snug">
            ${wire.title}
          </h3>
          <p class="text-ink-600 text-xs leading-relaxed font-serif">
            ${wire.summary}
          </p>
          <div class="pt-2 border-t border-ink-100 flex items-center justify-between text-xs font-sans text-ink-500">
            <span>Authored by: <strong class="text-ink-800">${wire.analyst_name || 'ISD Strategy Desk'}</strong></span>
            <span class="text-bronze-700 font-semibold uppercase tracking-wider text-[10px]">Dispatch #${wire.id}</span>
          </div>
        </div>
        ${wire.image_url ? `
          <div class="overflow-hidden rounded-md border border-ink-200 h-48 bg-ink-50">
            <img src="${wire.image_url}" alt="${wire.title}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ` : ''}
      </article>
    `).join('');

  } catch (err) {
    console.error("Wire fetch error:", err);
    feedContainer.innerHTML = `<p class="text-xs text-red-600 font-sans">Failed to load live wire feed.</p>`;
  }
}