import { supabase } from '../../config/supabaseClient';

export function renderCorporateAdvisoryView(container, currentUser) {
  container.innerHTML = `
    <div class="bg-paper border border-ink-200 rounded-lg p-8 shadow-sm space-y-6">
      <div class="border-b border-ink-100 pb-4">
        <span class="text-xs uppercase tracking-[0.2em] text-bronze-600 font-bold">Commercial Operations</span>
        <h2 class="font-serif text-2xl text-ink-900 mt-1">Corporate Advisory & Client Inquiries</h2>
        <p class="text-ink-600 text-sm mt-1">Manage inbound enterprise risk advisory requests, custom research commissions, and subscription leads.</p>
      </div>

      <div id="inquiries-list" class="space-y-4">
        <p class="text-sm text-ink-500 italic">Loading active client leads...</p>
      </div>
    </div>
  `;

  loadInquiries();

  async function loadInquiries() {
    const listEl = document.getElementById('inquiries-list');
    try {
      const { data, error } = await supabase
        .from('client_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        listEl.innerHTML = `
          <div class="p-6 bg-ink-50 rounded border border-ink-200 text-center text-ink-600 text-sm">
            No corporate client inquiries received yet. Inbound commercial leads will appear here.
          </div>
        `;
        return;
      }

      listEl.innerHTML = `
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="border-b border-ink-200 text-xs uppercase tracking-wider text-ink-500 bg-ink-50">
                <th class="p-3">Company / Client</th>
                <th class="p-3">Service Tier</th>
                <th class="p-3">Scope / Details</th>
                <th class="p-3">Date</th>
                <th class="p-3">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-ink-100">
              ${data.map(item => `
                <tr class="hover:bg-ink-50/50 transition-colors">
                  <td class="p-3 font-medium text-ink-900">
                    ${item.company_name}
                    <div class="text-xs text-ink-500 font-normal">${item.contact_person} (${item.email})</div>
                  </td>
                  <td class="p-3 text-ink-700"><span class="px-2 py-1 bg-bronze-50 text-bronze-800 rounded text-xs font-semibold">${item.service_tier}</span></td>
                  <td class="p-3 text-ink-600 max-w-xs truncate">${item.project_scope}</td>
                  <td class="p-3 text-ink-500 text-xs">${new Date(item.created_at).toLocaleDateString()}</td>
                  <td class="p-3">
                    <select 
                      data-id="${item.id}"
                      class="status-select bg-ink-50 text-xs px-2 py-1 rounded border border-ink-200 font-medium text-ink-800 focus:outline-none focus:ring-1 focus:ring-bronze-600 cursor-pointer">
                      <option value="pending" ${item.status?.toLowerCase() === 'pending' ? 'selected' : ''}>PENDING</option>
                      <option value="in_progress" ${item.status?.toLowerCase() === 'in_progress' ? 'selected' : ''}>IN PROGRESS</option>
                      <option value="contracted" ${item.status?.toLowerCase() === 'contracted' ? 'selected' : ''}>CONTRACTED</option>
                      <option value="resolved" ${item.status?.toLowerCase() === 'resolved' ? 'selected' : ''}>RESOLVED</option>
                      <option value="archived" ${item.status?.toLowerCase() === 'archived' ? 'selected' : ''}>ARCHIVED</option>
                    </select>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Attach dynamic change listeners to every status dropdown
      listEl.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const inquiryId = e.target.dataset.id;
          const newStatus = e.target.value;

          e.target.disabled = true; // Prevent multiple clicks while updating

          const { error: updateError } = await supabase
            .from('client_inquiries')
            .update({ status: newStatus })
            .eq('id', inquiryId);

          if (updateError) {
            console.error('Failed to update status:', updateError);
            alert('Error updating status: ' + updateError.message);
            e.target.disabled = false;
          } else {
            loadInquiries(); // Refresh the table view cleanly
          }
        });
      });

    } catch (err) {
      console.error(err);
      listEl.innerHTML = `<p class="text-red-700 text-sm">Error loading inquiries: ${err.message}</p>`;
    }
  }
}