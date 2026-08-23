// src/components/BriefModal.js

export function openBriefModal(brief) {
  if (!brief) return;

  const existingModal = document.getElementById('brief-reader-modal');
  if (existingModal) existingModal.remove();

  document.body.style.overflow = 'hidden';

  const formattedDate = brief.created_at
    ? new Date(brief.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent Publication';

  const briefRef = `ISD-PB-${brief.id ? String(brief.id).padStart(4, '0') : '2026'}`;
  const fileUrl = brief.file_url || null;

  const modal = document.createElement('div');
  modal.id = 'brief-reader-modal';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-ink-950/80 backdrop-blur-md animate-fade-in';

  modal.innerHTML = `
    <div class="bg-paper border border-ink-200 rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
      
      <!-- Sticky Header -->
      <div class="px-6 py-4 bg-paper/95 backdrop-blur-md border-b border-ink-200 flex items-center justify-between sticky top-0 z-30 font-sans">
        <div class="flex items-center gap-3">
          <span class="bg-ink-900 text-bronze-300 border border-bronze-500/40 text-[10px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-bronze-400"></span>
            ${brief.desk_name || brief.category || 'Policy Brief'}
          </span>
          <span class="hidden sm:inline-block text-xs text-ink-500">${formattedDate}</span>
        </div>

        <div class="flex items-center gap-2">
          ${fileUrl ? `
            <a 
              href="${fileUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-3 py-1.5 rounded bg-bronze-100 hover:bg-bronze-200 text-bronze-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              <span>Download PDF</span>
            </a>
          ` : ''}

          <button 
            id="close-modal-btn"
            class="w-8 h-8 rounded-full bg-ink-100 hover:bg-ink-900 text-ink-700 hover:text-paper transition-colors flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Scrollable Container with Embedded Watermark -->
      <div class="p-6 md:p-12 overflow-y-auto space-y-6 font-serif relative">
        
        <!-- INSTITUTIONAL WATERMARK OVERLAY -->
        <div class="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.04] z-0">
          <div class="text-center transform -rotate-12 space-y-8">
            <!-- Large ISD Diplomatic Star Emblem -->
            <svg class="w-96 h-96 mx-auto text-ink-900" viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="2,2" />
              <text x="50" y="55" font-family="serif" font-size="22" font-weight="bold" text-anchor="middle">ISD</text>
              <!-- 12 Stars Circle -->
              ${[0,30,60,90,120,150,180,210,240,270,300,330].map(angle => {
                const rad = (angle * Math.PI) / 180;
                const x = 50 + 34 * Math.cos(rad);
                const y = 50 + 34 * Math.sin(rad);
                return `<circle cx="${x}" cy="${y}" r="2" fill="currentColor" />`;
              }).join('')}
            </svg>
            <p class="font-mono text-xl font-bold uppercase tracking-[0.4em] text-ink-900">
              INSTITUTE FOR STRATEGIC DIPLOMACY
            </p>
            <p class="font-sans text-xs uppercase tracking-[0.3em] font-semibold text-ink-900">
              OFFICIAL RESEARCH RECORD • VERIFIED POLICY BRIEF
            </p>
          </div>
        </div>

        <!-- Brief Title & Metadata (Z-10 relative to sit above watermark) -->
        <div class="relative z-10 space-y-4 border-b border-ink-100 pb-6">
          <div class="flex items-center justify-between text-xs font-sans uppercase tracking-wider text-bronze-600 font-semibold">
            <span>Official Policy Assessment</span>
            <span class="font-mono text-ink-500">Ref: ${briefRef}</span>
          </div>

          <h1 class="text-2xl md:text-4xl font-serif font-bold leading-tight text-ink-900">
            ${brief.title}
          </h1>

          <!-- Author Info Bar -->
          <div class="flex items-center gap-3 pt-2 font-sans">
            <div class="w-9 h-9 rounded-full bg-ink-900 border border-bronze-500/40 text-bronze-300 font-bold flex items-center justify-center text-xs">
              ${(brief.author_name || 'I')[0]}
            </div>
            <div>
              <p class="font-bold text-ink-900 text-xs">${brief.author_name || 'ISD Editorial Desk'}</p>
              <p class="text-ink-500 text-[11px]">Institute for Strategic Diplomacy &bull; ${brief.desk_name || 'Research Directorate'}</p>
            </div>
          </div>
        </div>

        <!-- Abstract / Executive Summary Box -->
        ${brief.abstract ? `
          <div class="relative z-10 p-5 border-l-4 border-bronze-500 bg-ink-50/80 backdrop-blur-xs rounded-r font-sans space-y-1.5">
            <span class="text-[10px] uppercase tracking-[0.2em] font-bold text-bronze-700">Executive Summary</span>
            <p class="text-xs md:text-sm text-ink-800 leading-relaxed italic">
              ${brief.abstract}
            </p>
          </div>
        ` : ''}

        <!-- Text Body -->
        ${brief.body ? `
          <div class="relative z-10 text-sm md:text-base leading-relaxed text-ink-900 space-y-4 font-serif">
            ${brief.body.split('\n\n').map(paragraph => `<p class="leading-relaxed">${paragraph}</p>`).join('')}
          </div>
        ` : ''}

        <!-- Embedded PDF Viewer -->
        ${fileUrl ? `
          <div class="relative z-10 space-y-3 pt-4 border-t border-ink-200">
            <div class="flex items-center justify-between font-sans">
              <span class="text-xs font-bold uppercase tracking-wider text-ink-800 flex items-center gap-2">
                <span>📄</span> Attached Official Document
              </span>
              <a href="${fileUrl}" target="_blank" class="text-xs font-bold text-bronze-700 hover:underline">
                Fullscreen ↗
              </a>
            </div>

            <div class="w-full h-[550px] bg-ink-100 rounded-lg border border-ink-300 overflow-hidden shadow-inner">
              <iframe 
                src="${fileUrl}#toolbar=1&navpanes=0&scrollbar=1" 
                class="w-full h-full border-none"
                title="Attached Document Viewer"
              ></iframe>
            </div>
          </div>
        ` : ''}

      </div>

      <!-- Institutional Footer -->
      <div class="px-6 py-3.5 bg-ink-50 border-t border-ink-200 text-[11px] text-ink-600 font-sans flex flex-col sm:flex-row justify-between items-center gap-2 relative z-20">
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Peer-Reviewed & Archived &bull; Institute for Strategic Diplomacy
        </span>
        <span class="font-mono text-ink-400">Security Clearance: Public / Open Record</span>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    document.body.style.overflow = '';
    modal.remove();
  };

  modal.querySelector('#close-modal-btn')?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}