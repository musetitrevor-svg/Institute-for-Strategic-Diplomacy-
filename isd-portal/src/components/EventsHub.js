// src/components/EventsHub.js
import { supabase } from '../config/supabaseClient';

export async function renderEventsHub(container) {
  if (!container) return;

  container.innerHTML = `
    <section id="events" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-content mx-auto space-y-10">
        <div class="border-b border-ink-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold font-sans">Forums &amp; Convenings</span>
            <h2 class="font-serif text-3xl md:text-4xl text-ink-900 mt-1">Symposiums &amp; Events</h2>
            <p class="text-ink-600 text-sm mt-1 max-w-2xl">
              Upcoming conversations, roundtables, and forums from the Institute.
            </p>
          </div>
        </div>

        <div id="events-grid" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-6 border border-ink-200 rounded-lg animate-pulse h-64 bg-ink-50"></div>
          <div class="p-6 border border-ink-200 rounded-lg animate-pulse h-64 bg-ink-50"></div>
        </div>
      </div>
    </section>

    <!-- RSVP Modal Backdrop -->
    <div id="rsvp-modal" class="fixed inset-0 bg-ink-950/60 backdrop-blur-xs hidden z-50 flex items-center justify-center p-4">
      <div class="bg-paper border border-ink-200 rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 relative animate-in fade-in zoom-in duration-200">
        <div class="flex items-center justify-between border-b border-ink-200 pb-3">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-widest text-bronze-600 font-sans">Official Accreditation</span>
            <h3 id="modal-event-title" class="font-serif text-lg font-bold text-ink-900">Secure Symposium Seat</h3>
          </div>
          <button id="close-rsvp-modal" class="text-ink-400 hover:text-ink-900 text-lg font-bold">&times;</button>
        </div>

        <form id="rsvp-form" class="space-y-4">
          <input type="hidden" id="modal-event-id" />
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Full Name / Title</label>
            <input type="text" id="attendee-name" required placeholder="e.g. Dr. Jane Doe" class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none focus:border-bronze-600" />
          </div>
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Institutional Email</label>
            <input type="email" id="attendee-email" required placeholder="name@institution.ac.ke" class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none focus:border-bronze-600" />
          </div>
          <button type="submit" id="rsvp-submit-btn" class="w-full py-2.5 bg-ink-900 hover:bg-bronze-600 text-paper text-xs uppercase tracking-widest font-bold rounded transition-colors cursor-pointer">
            Confirm Accreditation RSVP
          </button>
          <div id="rsvp-feedback" class="text-xs text-center font-sans hidden"></div>
        </form>
      </div>
    </div>
  `;

  const gridContainer = container.querySelector('#events-grid');
  const modal = container.querySelector('#rsvp-modal');
  const closeModalBtn = container.querySelector('#close-rsvp-modal');
  const rsvpForm = container.querySelector('#rsvp-form');
  const modalTitle = container.querySelector('#modal-event-title');
  const modalEventIdInput = container.querySelector('#modal-event-id');
  const rsvpFeedback = container.querySelector('#rsvp-feedback');

  closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  try {
    const { data: events, error } = await supabase
      .from('institute_events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error || !events || events.length === 0) {
      gridContainer.innerHTML = `
        <div class="col-span-2 p-12 text-center border border-dashed border-ink-300 rounded-lg bg-ink-50">
          <p class="font-serif text-ink-700 text-lg">No public events are scheduled yet.</p>
          <p class="text-xs text-ink-500 mt-1 font-sans">New events will be announced here when dates are confirmed.</p>
        </div>
      `;
      return;
    }

    gridContainer.innerHTML = events.map(event => `
      <article class="bg-paper border border-ink-200 hover:border-bronze-500 rounded-lg p-6 shadow-xs transition-all duration-300 flex flex-col justify-between space-y-6">
        <div class="space-y-4">
          ${event.image_url ? `
            <div class="overflow-hidden rounded-md border border-ink-200 h-48 bg-ink-50">
              <img src="${event.image_url}" alt="${event.title}" class="w-full h-full object-cover" />
            </div>
          ` : ''}
          <div class="flex items-center justify-between text-xs font-sans text-bronze-700 uppercase tracking-wider font-bold">
            <span>${event.venue || 'Zetech University / Nairobi'}</span>
            <span>${new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h3 class="font-serif text-2xl font-bold text-ink-900">
            ${event.title}
          </h3>
          <p class="text-ink-600 text-xs leading-relaxed font-serif">
            ${event.description}
          </p>
        </div>
        <div class="pt-4 border-t border-ink-100 flex items-center justify-between">
          <span class="text-xs text-ink-500 font-sans">Status: <strong class="text-emerald-600">Open for RSVP</strong></span>
          <button data-id="${event.id}" data-title="${event.title}" class="open-rsvp-btn px-4 py-2 bg-ink-900 hover:bg-bronze-700 text-paper text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer">
            Secure Accreditation
          </button>
        </div>
      </article>
    `).join('');

    // Attach click listeners to all dynamically created RSVP buttons
    container.querySelectorAll('.open-rsvp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modalTitle.textContent = btn.getAttribute('data-title');
        modalEventIdInput.value = btn.getAttribute('data-id');
        rsvpFeedback.classList.add('hidden');
        rsvpForm.reset();
        modal.classList.remove('hidden');
      });
    });

  } catch (err) {
    console.error("Events fetch error:", err);
  }

  // Handle RSVP Submission
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('rsvp-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting Credentials...';

    try {
      const { error } = await supabase.from('event_rsvps').insert([{
        event_id: modalEventIdInput.value,
        attendee_name: document.getElementById('attendee-name').value.trim(),
        attendee_email: document.getElementById('attendee-email').value.trim()
      }]);

      if (error) throw error;

      rsvpFeedback.textContent = "Accreditation secured successfully! Check your email for pass details.";
      rsvpFeedback.className = "text-xs text-center font-sans text-emerald-600 font-bold";
      rsvpFeedback.classList.remove('hidden');
      
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 2000);

    } catch (err) {
      rsvpFeedback.textContent = "Error securing accreditation: " + err.message;
      rsvpFeedback.className = "text-xs text-center font-sans text-red-600 font-bold";
      rsvpFeedback.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Confirm Accreditation RSVP';
    }
  });
}
