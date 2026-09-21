import './style.css';
import { store } from './state/store';
import { briefsService } from './services/briefsService';
import { authService } from './services/authService';
import { supabase } from './config/supabaseClient';

// Core Components
import { renderNavbar } from './components/layout/Navbar';
import { renderFooter } from './components/layout/Footer';
import { renderHeroCarousel } from './components/hero/HeroCarousel';
import { renderLeadership } from './components/Leadership';
import { renderDeskGrid } from './components/desks/DeskGrid';
import { renderPublishedBriefs } from './components/PublishedBriefs';
import { renderClientInquiryForm } from './components/ClientInquiryForm';
import { renderAudienceStrip } from './components/AudienceStrip';
import { renderNewsletterSignup } from './components/NewsletterSignup';

// New Institutional Feature Components
import { renderGeopoliticalWire } from './components/GeopoliticalWire';
import { renderEventsHub } from './components/EventsHub';
import { renderFellowshipPortal } from './components/FellowshipPortal';

// Dashboard / Workspace Views
import { renderWriterStudio } from './components/dashboard/WriterStudio';
import { renderExecutiveReviewPanel } from './components/dashboard/ExecutiveReviewPanel';
import { renderCorporateAdvisoryView } from './components/dashboard/CorporateAdvisoryView';

async function initApp() {
  console.log("[ISD Portal] Starting initialization...");

  // 1. Locate or create navbar container
  let navContainer = document.getElementById('navbar') || document.getElementById('navbar-container') || document.querySelector('header');
  
  if (!navContainer) {
    navContainer = document.createElement('div');
    navContainer.id = 'navbar';
    document.body.prepend(navContainer);
  }

  // 2. Fetch active session user safely
  let currentUser = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    currentUser = session?.user || null;
    console.log("[ISD Portal] Current Auth User:", currentUser ? currentUser.email : "Guest Visitor");
  } catch (err) {
    console.warn("[ISD Portal] Auth check error:", err);
  }

  // 3. Render Navbar
  try {
    await renderNavbar(navContainer, currentUser);
    console.log("[ISD Portal] Navbar rendered successfully.");
  } catch (err) {
    console.error("[ISD Portal] Failed to render Navbar:", err);
  }
  renderFooter(document.getElementById('site-footer'));

  // 4. Locate or create main app view container
  let appRoot = document.getElementById('app-root');
  if (!appRoot) {
    appRoot = document.createElement('main');
    appRoot.id = 'app-root';
    navContainer.after(appRoot);
  }

  const currentHash = window.location.hash;

  if (currentHash === '#portal') {
    // --- DEDICATED MEMBER PORTAL VIEW ---
    if (currentUser) {
      let profile = null;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle();
        profile = data;
      } catch (err) {
        console.warn("[ISD Portal] Profile query warning:", err);
      }

      const dbRole = (profile?.role || currentUser?.user_metadata?.role || 'analyst').toLowerCase();
      const displayName = profile?.full_name || currentUser.email.split('@')[0];
      
      const executiveRoles = new Set(['director', 'executive']);
      const userRole = dbRole;
      const isExecutive = executiveRoles.has(dbRole);

      appRoot.className = 'min-h-[calc(100vh-80px)] bg-ink-50 py-12';
      appRoot.innerHTML = `
        <div class="max-w-content mx-auto px-6 lg:px-10 space-y-8 font-sans">
          
          <!-- User Welcome Banner -->
          <div class="bg-paper border border-ink-200 rounded-lg p-6 md:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs uppercase tracking-[0.2em] text-bronze-600 font-bold">
                  Authorized Session
                </span>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 bg-ink-900 text-bronze-300 rounded">
                  ${userRole.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h1 class="font-serif text-2xl md:text-3xl text-ink-900 mt-1 font-bold">
                Welcome, ${displayName}
              </h1>
              <p class="text-ink-600 text-xs md:text-sm mt-1">
                Institute for Strategic Diplomacy &bull; Internal Research &amp; Governance Portal
              </p>
            </div>

            <button 
              id="portal-logout-btn" 
              class="px-4 py-2 text-xs font-bold text-white bg-red-800 hover:bg-red-900 rounded transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <!-- Dynamic Tools Container -->
          <div id="portal-tools-container" class="space-y-8"></div>
        </div>
      `;

      appRoot.querySelector('#portal-logout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.hash = '#portal';
        window.location.reload();
      });

      const toolsContainer = document.getElementById('portal-tools-container');
      if (toolsContainer) {
        if (isExecutive) {
          const reviewWrapper = document.createElement('div');
          toolsContainer.appendChild(reviewWrapper);
          await renderExecutiveReviewPanel(reviewWrapper, currentUser);

          const advisoryWrapper = document.createElement('div');
          toolsContainer.appendChild(advisoryWrapper);
          renderCorporateAdvisoryView(advisoryWrapper, currentUser);
        }

        const writerWrapper = document.createElement('div');
        toolsContainer.appendChild(writerWrapper);
        renderWriterStudio(writerWrapper, currentUser);
      }
    } else {
      // Dedicated Clean Login Page Experience
      appRoot.className = 'min-h-[calc(100vh-80px)] bg-paper flex items-center justify-center py-16 px-6 font-sans';
      appRoot.innerHTML = `
        <div class="w-full max-w-md space-y-8">
          <div class="text-center space-y-3">
            <div class="w-12 h-12 mx-auto rounded-full border border-bronze-600 flex items-center justify-center bg-paper shadow-xs">
              <span class="font-serif text-xs font-bold text-bronze-800">ISD</span>
            </div>
            <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold">Member portal</span>
            <h1 class="font-serif text-3xl text-ink-900 font-bold">Sign in to the ISD member portal</h1>
            <p class="text-xs text-ink-600 leading-relaxed">
              Access your research workspace and internal Institute tools.
            </p>
          </div>

          <form id="standalone-login-form" class="space-y-5 bg-ink-50/60 p-8 border border-ink-200 rounded-lg shadow-xs">
            <div>
              <label class="block text-[11px] uppercase tracking-wider text-ink-700 font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="login-email" 
                required 
                placeholder="name@instituteforstrategicdiplomacy.org" 
                class="w-full px-3.5 py-3 text-xs bg-paper border border-ink-300 rounded text-ink-900 focus:border-bronze-600 focus:outline-none" 
              />
            </div>
            <div>
              <label class="block text-[11px] uppercase tracking-wider text-ink-700 font-bold mb-2">Password</label>
              <input 
                type="password" 
                id="login-password" 
                required 
                placeholder="••••••••" 
                class="w-full px-3.5 py-3 text-xs bg-paper border border-ink-300 rounded text-ink-900 focus:border-bronze-600 focus:outline-none" 
              />
            </div>
            <button 
              type="submit" 
              class="w-full py-3 bg-bronze-600 hover:bg-bronze-500 text-paper text-xs uppercase tracking-[0.15em] font-bold rounded transition-colors shadow-xs cursor-pointer"
            >
              Sign in
            </button>
            <div id="login-error" class="text-xs text-red-600 mt-2 hidden text-center"></div>
          </form>

          <div class="text-center">
            <a href="#" class="text-xs text-bronze-700 hover:underline font-medium">&larr; Return to Public Homepage</a>
          </div>
        </div>
      `;

      appRoot.querySelector('#standalone-login-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        try {
          errorEl.classList.add('hidden');
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          window.location.hash = '#portal';
          window.location.reload();
        } catch (err) {
          errorEl.textContent = err.message || "Authentication failed. Please verify your credentials.";
          errorEl.classList.remove('hidden');
        }
      });
    }
  } else {
    // --- PUBLIC HOMEPAGE VIEW ---
    appRoot.className = '';
    appRoot.innerHTML = `
      <div id="hero-carousel"></div>
      <div id="director-profile"></div>
      <div id="desk-grid"></div>
      <div id="briefs"></div>
      <div id="wire-container"></div>
      <div id="events-container"></div>
      <div id="fellowship-container"></div>
      <div id="newsletter-container"></div>
      <div id="audience-container"></div>
      <div id="advisory"></div>
      <div id="about"></div>
    `;

    const heroContainer = document.getElementById('hero-carousel');
    const directorContainer = document.getElementById('director-profile');
    const deskContainer = document.getElementById('desk-grid');

    if (heroContainer) renderHeroCarousel(heroContainer);
    if (directorContainer) renderLeadership(directorContainer);
    if (deskContainer) renderDeskGrid(deskContainer);

    const publicationsContainer = document.getElementById('briefs');
    const wireContainer = document.getElementById('wire-container');
    const eventsContainer = document.getElementById('events-container');
    const fellowshipContainer = document.getElementById('fellowship-container');
    await Promise.all([
      publicationsContainer && renderPublishedBriefs(publicationsContainer),
      wireContainer && renderGeopoliticalWire(wireContainer),
      eventsContainer && renderEventsHub(eventsContainer),
      fellowshipContainer && renderFellowshipPortal(fellowshipContainer),
    ].filter(Boolean));

    renderNewsletterSignup(document.getElementById('newsletter-container'));
    renderAudienceStrip(document.getElementById('audience-container'));

    const advisoryContainer = document.getElementById('advisory');
    if (advisoryContainer) renderClientInquiryForm(advisoryContainer);

    const aboutContainer = document.getElementById('about');
    if (aboutContainer) {
      aboutContainer.innerHTML = `
        <section class="py-20 bg-paper border-b border-ink-200">
          <div class="max-w-content mx-auto px-6 lg:px-10">
            <div class="max-w-2xl">
              <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mb-5">About the Institute</h2>
              <p class="font-sans text-ink-700 text-base md:text-lg leading-relaxed">
                The Institute for Strategic Diplomacy (ISD) is an independent research group based in Nairobi. We bring together analysts, economists, and policy experts to break down complex global issues into clear, reliable research. Our goal is to make international relations and foreign policy easy to understand and act upon for everyone, from students to decision-makers.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div class="border-t-2 border-bronze-600 pt-4">
                <p class="font-serif text-bronze-700 text-sm font-bold mb-1">Step 1</p>
                <h3 class="font-serif text-xl text-ink-900 mb-2">Research</h3>
                <p class="font-sans text-ink-600 text-sm leading-relaxed">Our desk leads study a topic and write the brief.</p>
              </div>
              <div class="border-t-2 border-bronze-600 pt-4">
                <p class="font-serif text-bronze-700 text-sm font-bold mb-1">Step 2</p>
                <h3 class="font-serif text-xl text-ink-900 mb-2">Review</h3>
                <p class="font-sans text-ink-600 text-sm leading-relaxed">Each brief is reviewed and edited before it is approved.</p>
              </div>
              <div class="border-t-2 border-bronze-600 pt-4">
                <p class="font-serif text-bronze-700 text-sm font-bold mb-1">Step 3</p>
                <h3 class="font-serif text-xl text-ink-900 mb-2">Publish</h3>
                <p class="font-sans text-ink-600 text-sm leading-relaxed">Approved briefs go live in our research library.</p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 mt-12">
              <button
                type="button"
                data-scroll-target="briefs"
                class="px-6 py-3 bg-bronze-600 hover:bg-bronze-500 text-paper text-sm font-bold rounded transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600 focus-visible:ring-offset-2"
              >
                Read our latest briefs
              </button>
              <button
                type="button"
                data-scroll-target="advisory"
                class="px-6 py-3 border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-paper text-sm font-bold rounded transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600 focus-visible:ring-offset-2"
              >
                Work with us
              </button>
            </div>
          </div>
        </section>
      `;

      // Smooth-scroll buttons. Using scrollIntoView (not #anchor links) because
      // changing the hash triggers the hashchange handler, which re-renders the page.
      aboutContainer.querySelectorAll('[data-scroll-target]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const target = document.getElementById(btn.getAttribute('data-scroll-target'));
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }

    try {
      const briefs = await briefsService.getPublishedBriefs();
      store.setState({ briefs });
    } catch (err) {
      console.warn("[ISD Portal] Live briefs fetch warning:", err);
    }
  }

  console.log("[ISD Portal] Initialization completed successfully.");
}

window.addEventListener('hashchange', () => {
  initApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('DOMContentLoaded', initApp);
