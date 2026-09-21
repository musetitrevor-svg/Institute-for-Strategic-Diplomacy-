// src/components/FellowshipPortal.js
import { supabase } from '../config/supabaseClient';

export async function renderFellowshipPortal(container) {
  if (!container) return;

  container.innerHTML = `
    <section id="fellowship" class="py-16 px-6 lg:px-10 bg-paper border-t border-ink-200">
      <div class="max-w-2xl mx-auto space-y-8">
        <div class="text-center space-y-2">
          <span class="text-xs uppercase tracking-[0.25em] text-bronze-600 font-bold font-sans">Research fellowship</span>
          <h2 class="font-serif text-3xl md:text-4xl text-ink-900">Apply to work and learn with us.</h2>
          <p class="text-ink-600 text-sm max-w-lg mx-auto leading-relaxed">
            Submit credentials to join the Institute’s junior analyst pool, editorial review committees, or specialized research desks.
          </p>
        </div>

        <form id="fellowship-form" class="bg-paper border border-ink-200 rounded-lg p-8 shadow-sm space-y-6">
          <div class="space-y-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 font-sans">Full name</label>
            <input type="text" id="applicant-name" required class="w-full px-4 py-2.5 bg-paper border border-ink-300 rounded text-sm text-ink-900 focus:outline-none focus:border-bronze-500 font-sans" placeholder="e.g. Trevor Museti" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 font-sans">Email</label>
              <input type="email" id="applicant-email" required class="w-full px-4 py-2.5 bg-paper border border-ink-300 rounded text-sm text-ink-900 focus:outline-none focus:border-bronze-500 font-sans" placeholder="name@domain.org" />
            </div>
            <div class="space-y-1">
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 font-sans">Preferred Research Desk</label>
              <select id="applicant-desk" class="w-full px-4 py-2.5 bg-paper border border-ink-300 rounded text-sm text-ink-900 focus:outline-none focus:border-bronze-500 font-sans">
                <option>Foreign Policy & Statecraft</option>
                <option>Multilateral Governance</option>
                <option>Global Security & Defense</option>
                <option>IPE & Economic Corridors</option>
              </select>
            </div>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 font-sans">Tell us about your background</label>
            <textarea id="applicant-statement" rows="4" required class="w-full px-4 py-2.5 bg-paper border border-ink-300 rounded text-sm text-ink-900 focus:outline-none focus:border-bronze-500 font-sans" placeholder="Briefly detail your background in international relations or policy analysis..."></textarea>
          </div>

          <button type="submit" id="submit-btn" class="w-full py-3 bg-ink-900 hover:bg-bronze-700 text-paper text-xs font-bold uppercase tracking-widest rounded transition-colors shadow-sm">
            Submit application
          </button>
          
          <div id="form-feedback" class="text-xs text-center font-sans hidden"></div>
        </form>
      </div>
    </section>
  `;

  const form = container.querySelector('#fellowship-form');
  const feedback = container.querySelector('#form-feedback');
  const submitBtn = container.querySelector('#submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting Credentials...';

    const payload = {
      applicant_name: container.querySelector('#applicant-name').value,
      email: container.querySelector('#applicant-email').value,
      research_desk: container.querySelector('#applicant-desk').value,
      statement: container.querySelector('#applicant-statement').value,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('fellowship_applications').insert([payload]);

      if (error) throw error;

      feedback.textContent = "Application successfully registered with the Secretariat review queue.";
      feedback.className = "text-xs text-center font-sans text-emerald-600 font-bold";
      feedback.classList.remove('hidden');
      form.reset();
    } catch (err) {
      console.error("Submission error:", err);
      feedback.textContent = "Error submitting application. Please try again.";
      feedback.className = "text-xs text-center font-sans text-red-600 font-bold";
      feedback.classList.remove('hidden');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit application';
    }
  });
}
