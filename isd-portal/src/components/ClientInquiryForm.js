import { supabase } from '../config/supabaseClient';

export function renderClientInquiryForm(container) {
  container.innerHTML = `
    <section class="bg-ink-900 text-white py-16 px-6 lg:px-10 border-t border-ink-800">
      <div class="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Column: What we offer + contact emails -->
        <div class="lg:col-span-5 space-y-6">
          <h2 class="font-serif text-3xl md:text-4xl text-paper leading-tight">
            Work with us
          </h2>
          <p class="text-ink-300 text-base leading-relaxed">
            We provide policy analysis and geopolitical briefings for organisations, agencies, and diplomatic missions.
          </p>
          <div class="space-y-4 pt-4 border-t border-ink-800 text-sm text-ink-300">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Risk advisory and forecasts</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Country and regional studies</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Private briefings for executives and diplomats</span>
            </div>
          </div>

          <!-- Institutional emails -->
          <div class="pt-6 border-t border-ink-800">
            <h3 class="font-serif text-xl text-paper mb-4">Prefer to email us?</h3>
            <dl class="space-y-3 text-sm">
              <div>
                <dt class="text-ink-400">General enquiries</dt>
                <dd><a href="mailto:info@instituteforstrategicdiplomacy.org" class="text-bronze-300 hover:text-bronze-200 underline underline-offset-4 break-all">info@instituteforstrategicdiplomacy.org</a></dd>
              </div>
              <div>
                <dt class="text-ink-400">Research</dt>
                <dd><a href="mailto:isdresearch@instituteforstrategicdiplomacy.org" class="text-bronze-300 hover:text-bronze-200 underline underline-offset-4 break-all">isdresearch@instituteforstrategicdiplomacy.org</a></dd>
              </div>
              <div>
                <dt class="text-ink-400">Secretariat</dt>
                <dd><a href="mailto:secretariat@instituteforstrategicdiplomacy.org" class="text-bronze-300 hover:text-bronze-200 underline underline-offset-4 break-all">secretariat@instituteforstrategicdiplomacy.org</a></dd>
              </div>
              <div>
                <dt class="text-ink-400">Director's office</dt>
                <dd><a href="mailto:director@instituteforstrategicdiplomacy.org" class="text-bronze-300 hover:text-bronze-200 underline underline-offset-4 break-all">director@instituteforstrategicdiplomacy.org</a></dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Right Column: Submission Form -->
        <div class="lg:col-span-7 bg-paper text-ink-900 p-8 rounded-lg shadow-xl border border-ink-200">
          <h3 class="font-serif text-2xl text-ink-900 mb-2">Send us a request</h3>
          <p class="text-sm text-ink-600 mb-6">We aim to reply within 24 hours.</p>

          <form id="public-client-inquiry-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="inquiry-company" class="block text-sm font-semibold text-ink-800 mb-1">Company or institution *</label>
                <input type="text" id="inquiry-company" required placeholder="e.g. Acme Global Logistics" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
              <div>
                <label for="inquiry-person" class="block text-sm font-semibold text-ink-800 mb-1">Contact person *</label>
                <input type="text" id="inquiry-person" required placeholder="e.g. Jane Doe, VP Strategy" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="inquiry-email" class="block text-sm font-semibold text-ink-800 mb-1">Email *</label>
                <input type="email" id="inquiry-email" required placeholder="j.doe@company.com" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
              <div>
                <label for="inquiry-tier" class="block text-sm font-semibold text-ink-800 mb-1">Service needed *</label>
                <select id="inquiry-tier" required class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30">
                  <option value="Enterprise Risk Advisory">Risk advisory</option>
                  <option value="Bespoke Research Brief">Custom research brief</option>
                  <option value="Executive Briefings">Executive and diplomatic briefings</option>
                  <option value="Corporate Subscription">Corporate subscription</option>
                </select>
              </div>
            </div>

            <div>
              <label for="inquiry-scope" class="block text-sm font-semibold text-ink-800 mb-1">Tell us what you need *</label>
              <textarea id="inquiry-scope" rows="4" required placeholder="Your questions, the country or region, and your timeline" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30"></textarea>
            </div>

            <div id="inquiry-feedback" class="text-sm" aria-live="polite"></div>

            <button type="submit" id="submit-inquiry-btn" class="w-full py-3 px-6 text-sm font-bold text-white bg-bronze-700 hover:bg-bronze-800 rounded transition-colors shadow-sm cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-bronze-600 focus-visible:ring-offset-2">
              Send request
            </button>
          </form>
        </div>

      </div>
    </section>
  `;

  // Handle Submission
  const form = document.getElementById('public-client-inquiry-form');
  const feedback = document.getElementById('inquiry-feedback');
  const submitBtn = document.getElementById('submit-inquiry-btn');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    feedback.innerHTML = '';

    const payload = {
      company_name: document.getElementById('inquiry-company').value.trim(),
      contact_person: document.getElementById('inquiry-person').value.trim(),
      email: document.getElementById('inquiry-email').value.trim(),
      service_tier: document.getElementById('inquiry-tier').value,
      project_scope: document.getElementById('inquiry-scope').value.trim(),
    };

    try {
      const { error } = await supabase.from('client_inquiries').insert([payload]);
      if (error) throw error;

      feedback.innerHTML = `
        <div class="p-3 bg-green-50 border border-green-200 text-green-800 rounded font-medium">
          Thank you. We have received your request and will be in touch shortly.
        </div>
      `;
      form.reset();
    } catch (err) {
      console.error(err);
      feedback.innerHTML = `
        <div class="p-3 bg-red-50 border border-red-200 text-red-800 rounded font-medium">
          We could not send your request. Please try again, or email us at
          <a href="mailto:info@instituteforstrategicdiplomacy.org" class="underline">info@instituteforstrategicdiplomacy.org</a>.
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request';
    }
  });
}