export async function renderLeadership(container) {
  const leadershipTeam = [
    {
      name: "Trevor Museti",
      role: "Founder and Director",
      desk: "Executive Office",
      photoUrl: "/trevor-director.jpg",
      bio: "Leading the institute's overall vision, partnerships, and research goals."
    },
    {
      name: "Michael Ongaro",
      role: "Operations Manager",
      desk: "Operations",
      photoUrl: "/michael-ongaro.jpg",
      bio: "Managing the daily activities of the institute, coordinating our research teams, and keeping our projects on track."
    },
    {
      name: "Rhyne Eiton",
      role: "Head of Secretariat",
      desk: "Secretariat",
      photoUrl: "/rhyne-eiton.jpg",
      bio: "Overseeing our editing process, publishing standards, and internal organization."
    }
  ];

  // Separate Director from the rest of the leadership team
  const director = leadershipTeam[0];
  const teamMembers = leadershipTeam.slice(1);

  // Reusable card rendering template helper
  const renderCard = (member, isDirector = false) => `
    <article class="group bg-paper border border-ink-200 rounded-lg p-6 shadow-xs hover:border-bronze-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col space-y-5 relative overflow-hidden ${isDirector ? 'max-w-md mx-auto w-full shadow-md border-bronze-500/30' : ''}">
      
      <!-- Top Gold Accent Line on Card Hover -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bronze-600 via-bronze-400 to-bronze-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <!-- Photo Frame -->
      <div class="relative w-full ${isDirector ? 'h-80' : 'h-72'} bg-ink-900 rounded border border-ink-800 overflow-hidden flex items-center justify-center shadow-inner group-hover:border-bronze-600/50 transition-colors">
        
        <!-- Fallback Placeholder (shown until the photo loads, or if it is missing) -->
        <div class="text-ink-400 text-center p-6 flex flex-col items-center justify-center">
          <div class="w-16 h-16 rounded-full bg-ink-800/80 border border-bronze-600/30 flex items-center justify-center mb-3 text-bronze-400">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <span class="text-xs font-semibold text-bronze-400/80 font-sans">Photo coming soon</span>
        </div>

        <!-- Image Overlay -->
        ${member.photoUrl ? `
          <img 
            src="${member.photoUrl}" 
            alt="${member.name}" 
            class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 z-10"
            onerror="this.style.display='none'"
          />
        ` : ''}
        
        <!-- Team Badge -->
        <div class="absolute top-3 right-3 bg-ink-900/90 backdrop-blur-md border border-bronze-500/40 text-bronze-300 text-xs font-semibold px-3 py-1 rounded-full shadow-md z-20 flex items-center gap-1.5 font-sans">
          <span class="w-1.5 h-1.5 rounded-full bg-bronze-400"></span>
          ${member.desk}
        </div>
      </div>

      <!-- Info Block -->
      <div class="space-y-2">
        <h3 class="font-serif text-xl font-bold text-ink-900 group-hover:text-bronze-700 transition-colors">
          ${member.name}
        </h3>
        
        <p class="text-sm text-bronze-700 font-semibold font-sans">
          ${member.role}
        </p>
        
        <p class="text-ink-700 text-sm leading-relaxed pt-3 border-t border-ink-100 font-sans">
          ${member.bio}
        </p>
      </div>

    </article>
  `;

  container.innerHTML = `
    <section id="leadership" class="py-20 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto space-y-12">
        
        <!-- Section Header -->
        <div class="border-b border-ink-200 pb-6 relative text-center max-w-2xl mx-auto">
          <div class="w-12 h-1 bg-bronze-500 mb-4 rounded-full mx-auto"></div>
          <h2 class="font-serif text-3xl md:text-4xl text-ink-900">Executive Leadership</h2>
          <p class="text-ink-600 text-base mt-3 leading-relaxed font-sans">
            The people who set ISD's direction and keep the work moving.
          </p>
        </div>

        <!-- Layout: Director on top, team below -->
        <div class="space-y-8">
          
          <!-- Director -->
          <div class="flex justify-center">
            ${renderCard(director, true)}
          </div>

          <!-- Operations and Secretariat -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            ${teamMembers.map(member => renderCard(member, false)).join('')}
          </div>

        </div>

        <!-- Mission Note -->
        <div class="mt-16 max-w-3xl mx-auto border-l-4 border-bronze-500 pl-6 py-5 bg-paper shadow-xs rounded-r-xl border-y border-r border-ink-200">
          <p class="text-ink-700 italic text-base sm:text-lg leading-relaxed font-serif">
            "Our mission is simple: rigorous research, in plain language, that helps people make better foreign policy decisions."
          </p>
          <p class="mt-4 text-sm font-semibold text-bronze-700 font-sans">The ISD leadership team</p>
        </div>

      </div>
    </section>
  `;
}