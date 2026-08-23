export async function renderLeadership(container) {
  const leadershipTeam = [
    {
      name: "Trevor Museti",
      role: "Founder & Executive Director",
      desk: "Executive Office",
      photoUrl: "/trevor-director.jpg",
      bio: "Spearheading overall strategic vision, high-level diplomatic engagements, geopolitical assessments, and research governance across East Africa and international partner networks."
    },
    {
      name: "Michael Ongaro",
      role: "Co-Founder & Chief of Staff",
      desk: "Office of the Chief of Staff",
      photoUrl: "/michael-ongaro.jpg",
      bio: "Directing daily institutional operations, inter-desk research coordination, policy advisory pipelines, and high-level stakeholder relations."
    },
    {
      name: "Rhyne Eiton",
      role: "Co-Founder & Head of Secretariat",
      desk: "Office of the Secretariat",
      photoUrl: "/rhyne-eiton.jpg",
      bio: "Managing the peer-review editorial pipeline, research desk administration, publication archives, and institutional policy standards."
    }
  ];

  // Separate Director from the co-founders/secretariat team
  const director = leadershipTeam[0];
  const coFounders = leadershipTeam.slice(1);

  // Reusable card rendering template helper
  const renderCard = (member, isDirector = false) => `
    <article class="group bg-paper border border-ink-200 rounded-lg p-6 shadow-xs hover:border-bronze-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden ${isDirector ? 'max-w-md mx-auto w-full shadow-md border-bronze-500/30' : ''}">
      
      <!-- Top Gold Accent Line on Card Hover -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bronze-600 via-bronze-400 to-bronze-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div class="space-y-5">
        
        <!-- Dark Diplomatic Photo Frame Slot -->
        <div class="relative w-full ${isDirector ? 'h-80' : 'h-72'} bg-ink-900 rounded border border-ink-800 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-bronze-600/50 transition-colors">
          
          <!-- Fallback Placeholder -->
          <div class="text-ink-400 text-center p-6 flex flex-col items-center justify-center">
            <div class="w-16 h-16 rounded-full bg-ink-800/80 border border-bronze-600/30 flex items-center justify-center mb-3 text-bronze-400 group-hover:scale-105 transition-transform">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span class="text-[10px] uppercase tracking-widest font-semibold text-bronze-400/80 font-sans">Official Photo Pending</span>
          </div>

          <!-- Image Overlay -->
          ${member.photoUrl ? `
            <img 
              src="${member.photoUrl}" 
              alt="${member.name}" 
              class="absolute inset-0 w-full h-full object-cover object-top filter contrast-[1.02] group-hover:scale-105 transition-transform duration-500 z-10"
              onerror="this.style.display='none'"
            />
          ` : ''}
          
          <!-- Refined Executive Badge -->
          <div class="absolute top-3 right-3 bg-ink-900/90 backdrop-blur-md border border-bronze-500/40 text-bronze-300 text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full shadow-md z-20 flex items-center gap-1.5 font-sans">
            <span class="w-1.5 h-1.5 rounded-full bg-bronze-400"></span>
            ${member.desk}
          </div>
        </div>

        <!-- Info Block -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="font-serif text-xl font-bold text-ink-900 group-hover:text-bronze-700 transition-colors">
              ${member.name}
            </h3>
          </div>
          
          <p class="text-xs text-bronze-600 font-bold uppercase tracking-wider font-sans">
            ${member.role}
          </p>
          
          <p class="text-ink-600 text-xs leading-relaxed pt-3 border-t border-ink-100">
            ${member.bio}
          </p>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="pt-3 border-t border-ink-100 flex justify-between items-center text-[10px] text-ink-500 font-sans uppercase tracking-wider">
        <span class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Verified Official
        </span>
        <span class="text-bronze-600 font-bold">&bull; ISD Leadership</span>
      </div>

    </article>
  `;

  container.innerHTML = `
    <section id="leadership" class="py-20 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto space-y-12">
        
        <!-- Header with Bronze Section Accent -->
        <div class="border-b border-ink-200 pb-6 relative text-center max-w-2xl mx-auto">
          <div class="w-12 h-1 bg-bronze-500 mb-4 rounded-full mx-auto"></div>
          <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold font-sans">Governance & Institutional Authority</span>
          <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">Executive Leadership</h2>
          <p class="text-ink-600 text-sm mt-2 leading-relaxed">
            The Directorate and Secretariat steering strategic analysis, diplomatic research agendas, and institutional partnerships.
          </p>
        </div>

        <!-- Tiered Hierarchical Layout -->
        <div class="space-y-8">
          
          <!-- TIER 1: The Executive Director (Apex Anchor) -->
          <div class="flex justify-center">
            ${renderCard(director, true)}
          </div>

          <!-- TIER 2: Co-Founders / Secretariat & Chief of Staff Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            ${coFounders.map(member => renderCard(member, false)).join('')}
          </div>

        </div>

        <!-- TIER 3: Executive Statement Note -->
        <div class="mt-16 max-w-3xl mx-auto border-l-4 border-bronze-500 pl-6 py-5 bg-paper shadow-xs rounded-r-xl border-y border-r border-ink-200">
          <p class="text-ink-700 italic text-base sm:text-lg leading-relaxed font-serif">
            "At the Institute for Strategic Diplomacy, our mandate is clear: to pioneer rigorous research and shape smart statecraft. We unite scholarly excellence with practical policy solutions to navigate complex geopolitical landscapes."
          </p>
          <div class="mt-4 flex items-center gap-3">
            <span class="text-xs font-semibold tracking-wider text-bronze-600 uppercase font-sans">— Executive Directorate & Secretariat Note</span>
          </div>
        </div>

      </div>
    </section>
  `;
}