// src/components/dashboard/ExecutiveReviewPanel.js
import { supabase } from '../../config/supabaseClient';
import { openBriefModal } from '../BriefModal';
import { applyInstitutionalWatermark } from '../../utils/watermarkPDF';

// Change this string to match your exact Supabase Storage bucket name if it differs
const STORAGE_BUCKET = 'policy_briefs_bucket';

export async function renderExecutiveReviewPanel(container, currentUser) {
  if (!container) return;

  let activeTab = 'pending_review'; // 'pending_review' or 'published'

  async function loadBriefs() {
    container.innerHTML = `
      <div class="bg-paper border border-ink-200 rounded-lg p-6 shadow-sm space-y-4 animate-pulse">
        <div class="h-6 bg-ink-200 w-1/4 rounded"></div>
        <div class="h-20 bg-ink-100 rounded"></div>
      </div>
    `;

    try {
      const { data: briefs, error } = await supabase
        .from('policy_briefs')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      renderPanelUI(briefs || []);
    } catch (err) {
      console.error("Error loading briefs:", err);
      container.innerHTML = `
        <div class="p-6 bg-red-50 border border-red-200 rounded text-xs text-red-800 font-sans">
          Failed to load briefs: ${err.message}
        </div>
      `;
    }
  }

  function renderPanelUI(briefs) {
    container.innerHTML = `
      <div class="bg-paper border border-ink-200 rounded-lg p-6 md:p-8 shadow-sm space-y-6">
        
        <!-- Header -->
        <div class="border-b border-ink-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span class="text-xs uppercase tracking-[0.2em] text-bronze-600 font-bold font-sans">
              Directorate & Secretariat Governance
            </span>
            <h2 class="font-serif text-2xl text-ink-900 mt-1">
              Executive Management & Review Panel
            </h2>
          </div>
          
          <div class="flex items-center gap-2 font-sans text-xs">
            <!-- Filter Tabs -->
            <button 
              id="tab-pending"
              class="px-3 py-1.5 rounded font-bold cursor-pointer transition-colors ${
                activeTab === 'pending_review' 
                  ? 'bg-ink-900 text-paper' 
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }"
            >
              Pending Reviews
            </button>

            <button 
              id="tab-published"
              class="px-3 py-1.5 rounded font-bold cursor-pointer transition-colors ${
                activeTab === 'published' 
                  ? 'bg-ink-900 text-paper' 
                  : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
              }"
            >
              Published Archive
            </button>
          </div>
        </div>

        <!-- List Content -->
        ${briefs.length === 0 ? `
          <div class="p-8 text-center border border-dashed border-ink-200 rounded-lg bg-ink-50/50">
            <p class="font-serif text-ink-700 text-base">
              No briefs found in ${activeTab === 'pending_review' ? 'Pending Queue' : 'Published Archive'}.
            </p>
          </div>
        ` : `
          <div class="space-y-4">
            ${briefs.map(brief => `
              <div 
                data-brief-id="${brief.id}"
                class="border border-ink-200 hover:border-bronze-500 rounded-lg p-5 bg-paper transition-all space-y-4 shadow-xs"
              >
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-ink-100 pb-3 font-sans">
                  <div class="flex items-center gap-2 text-xs">
                    <span class="font-bold text-bronze-700 uppercase tracking-wider">${brief.desk_name || 'General Desk'}</span>
                    <span class="text-ink-400">&bull;</span>
                    <span class="text-ink-600">By: <strong>${brief.author_name || 'Analyst'}</strong></span>
                  </div>
                  <span class="text-[11px] text-ink-400 font-mono">
                    ${new Date(brief.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h3 class="font-serif text-lg font-bold text-ink-900 leading-snug">
                    ${brief.title}
                  </h3>
                  <p class="text-xs text-ink-600 line-clamp-2 mt-1 font-sans">
                    ${brief.abstract}
                  </p>
                </div>

                <div class="flex flex-wrap items-center justify-between gap-3 pt-2 font-sans text-xs">
                  <div class="flex items-center gap-3">
                    <button 
                      data-action="read"
                      data-brief-id="${brief.id}"
                      class="text-bronze-700 hover:text-ink-900 font-bold underline cursor-pointer"
                    >
                      Inspect Brief ➔
                    </button>
                    ${brief.file_url ? `
                      <a href="${brief.file_url}" target="_blank" class="text-ink-600 hover:text-bronze-700 font-semibold flex items-center gap-1">
                        📄 File Link
                      </a>
                    ` : ''}
                  </div>

                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    ${activeTab === 'pending_review' ? `
                      <button 
                        data-action="approve"
                        data-brief-id="${brief.id}"
                        class="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        Approve &amp; Publish
                      </button>

                      <button 
                        data-action="revision"
                        data-brief-id="${brief.id}"
                        class="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        Request Revision
                      </button>
                    ` : ''}

                    <!-- DELETE BUTTON -->
                    <button 
                      data-action="delete"
                      data-brief-id="${brief.id}"
                      class="px-3 py-1.5 bg-red-800 hover:bg-red-900 text-white font-semibold rounded text-[11px] uppercase tracking-wider cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            `).join('')}
          </div>
        `}

      </div>
    `;

    // Tab Event Listeners
    container.querySelector('#tab-pending')?.addEventListener('click', () => { activeTab = 'pending_review'; loadBriefs(); });
    container.querySelector('#tab-published')?.addEventListener('click', () => { activeTab = 'published'; loadBriefs(); });

    // Inspect Modal
    container.querySelectorAll('button[data-action="read"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const briefId = e.currentTarget.getAttribute('data-brief-id');
        const brief = briefs.find(b => String(b.id) === String(briefId));
        if (brief) openBriefModal(brief);
      });
    });

    // Approve & Watermark Handler
    container.querySelectorAll('button[data-action="approve"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const briefId = e.currentTarget.getAttribute('data-brief-id');
        if (!confirm("Approve, watermark, and publish this policy brief?")) return;

        try {
          const { data: brief, error: fetchError } = await supabase
            .from('policy_briefs')
            .select('*')
            .eq('id', briefId)
            .single();

          if (fetchError) throw fetchError;

          let finalFileUrl = brief.file_url;

          if (brief.file_url && brief.file_url.toLowerCase().endsWith('.pdf')) {
            const response = await fetch(brief.file_url);
            const originalArrayBuffer = await response.arrayBuffer();

            const watermarkedBytes = await applyInstitutionalWatermark(originalArrayBuffer);

            const fileName = `watermarked_${briefId}_${Date.now()}.pdf`;
            const { error: uploadError } = await supabase.storage
              .from(STORAGE_BUCKET)
              .upload(fileName, watermarkedBytes, {
                contentType: 'application/pdf',
                upsert: true
              });

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
              .from(STORAGE_BUCKET)
              .getPublicUrl(fileName);

            finalFileUrl = publicUrlData.publicUrl;
          }

          const { error: updateError } = await supabase
            .from('policy_briefs')
            .update({ 
              status: 'published',
              file_url: finalFileUrl 
            })
            .eq('id', briefId);

          if (updateError) throw updateError;

          alert("Policy brief successfully watermarked and published.");
          loadBriefs();

        } catch (err) {
          console.error("Publishing error:", err);
          alert("Failed to process and publish brief: " + err.message);
        }
      });
    });

    // Request Revision Handler
    container.querySelectorAll('button[data-action="revision"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const briefId = e.currentTarget.getAttribute('data-brief-id');
        const feedbackReason = prompt("Enter revision notes/reason for the writer:");
        if (!feedbackReason) return;

        const { error } = await supabase
          .from('policy_briefs')
          .update({ 
            status: 'revision_requested',
            review_notes: feedbackReason 
          })
          .eq('id', briefId);

        if (error) {
          alert("Error updating brief: " + error.message);
        } else {
          alert("Brief sent back to writer with review notes.");
          loadBriefs();
        }
      });
    });

    // DELETE HANDLER (With Strict Confirmation Prompt)
    container.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const briefId = e.currentTarget.getAttribute('data-brief-id');
        if (!confirm("⚠️ Are you sure you want to PERMANENTLY DELETE this policy brief? This action cannot be undone.")) return;

        const { error } = await supabase.from('policy_briefs').delete().eq('id', briefId);
        if (error) {
          alert("Failed to delete: " + error.message);
        } else {
          alert("Policy Brief removed permanently.");
          loadBriefs();
        }
      });
    });
  }

  await loadBriefs();
}