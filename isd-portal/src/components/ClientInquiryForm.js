import { supabase } from '../config/supabaseClient';

export function renderClientInquiryForm(container) {
  container.innerHTML = `
    <section class="bg-ink-900 text-white py-16 px-6 lg:px-10 border-t border-ink-800">
      <div class="max-w-content mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        <!-- Left Column: Value Proposition -->
        <div class="lg:col-span-5 space-y-6">
          <span class="text-xs uppercase tracking-[0.25em] text-bronze-400 font-semibold">Institutional Services</span>
          <h2 class="font-serif text-3xl md:text-4xl text-paper leading-tight">
            Commission Strategic Advisory & Policy Research
          </h2>
          <p class="text-ink-300 text-sm leading-relaxed">
            The Institute for Strategic Diplomacy delivers bespoke geopolitical risk intelligence, market-entry assessments, and policy analysis for global corporate leaders, development agencies, and diplomatic missions.
          </p>
          <div class="space-y-4 pt-4 border-t border-ink-800 text-xs text-ink-400">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Enterprise Risk Advisory & Strategic Forecasts</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Bespoke Country & Regional Feasibility Studies</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-bronze-500"></span>
              <span>Closed-Door Executive & Diplomatic Briefings</span>
            </div>
          </div>
        </div>

        <!-- Right Column: Submission Form -->
        <div class="lg:col-span-7 bg-paper text-ink-900 p-8 rounded-lg shadow-xl border border-ink-200">
          <h3 class="font-serif text-2xl text-ink-900 mb-2">Submit an Advisory Inquiry</h3>
          <p class="text-xs text-ink-600 mb-6">Our Secretariat and Desk Leadership review institutional requests within 24 hours.</p>

          <form id="public-client-inquiry-form" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Company / Institution *</label>
                <input type="text" id="inquiry-company" required placeholder="e.g. Acme Global Logistics" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Contact Person *</label>
                <input type="text" id="inquiry-person" required placeholder="e.g. Jane Doe, VP Strategy" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Official Email *</label>
                <input type="email" id="inquiry-email" required placeholder="j.doe@company.com" class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30" />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Service Required *</label>
                <select id="inquiry-tier" required class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30">
                  <option value="Enterprise Risk Advisory">Enterprise Risk Advisory</option>
                  <option value="Bespoke Research Brief">Bespoke Research Brief</option>
                  <option value="Executive Briefings">Executive & Diplomatic Briefings</option>
                  <option value="Corporate Subscription">Corporate Subscription</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-1">Scope & Objectives *</label>
              <textarea id="inquiry-scope" rows="4" required placeholder="Outline your key research questions, geographic focus, or operational timeline..." class="w-full text-sm p-3 border border-ink-200 rounded focus:outline-none focus:ring-1 focus:ring-bronze-600 bg-ink-50/30"></textarea>
            </div>

            <div id="inquiry-feedback" class="text-xs"></div>

            <button type="submit" id="submit-inquiry-btn" class="w-full py-3 px-6 text-xs font-bold uppercase tracking-widest text-white bg-bronze-700 hover:bg-bronze-800 rounded transition-colors shadow-sm">
              Submit Request
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
    submitBtn.textContent = 'Submitting...';
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
          Thank you. Your institutional request has been logged. Our executive office will get in touch shortly.
        </div>
      `;
      form.reset();
    } catch (err) {
      console.error(err);
      feedback.innerHTML = `
        <div class="p-3 bg-red-50 border border-red-200 text-red-800 rounded font-medium">
          Submission failed: ${err.message}
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Request';
    }
  });
}