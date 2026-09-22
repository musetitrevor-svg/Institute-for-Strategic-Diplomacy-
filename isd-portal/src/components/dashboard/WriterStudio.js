// src/components/dashboard/WriterStudio.js
import { supabase } from '../../config/supabaseClient';

const OFFICIAL_DESKS = [
  "Foreign Policy",
  "Global Security",
  "IPE & Development",
  "Multilateralism",
  "Cyber Diplomacy",
  "Diplomatic Practice"
];

// Helper: Dynamically load pdf-lib library from CDN
async function loadPdfLib() {
  if (window.PDFLib) return window.PDFLib;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.onload = () => resolve(window.PDFLib);
    script.onerror = () => reject(new Error('Failed to load PDF watermarking library.'));
    document.head.appendChild(script);
  });
}

// Helper: Stamp ISD Institutional Watermark on every PDF page
async function watermarkPDF(file) {
  try {
    const { PDFDocument, rgb, degrees, StandardFonts } = await loadPdfLib();
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (const page of pages) {
      const { width, height } = page.getSize();
      const mainFontSize = Math.min(width, height) * 0.038;
      const subFontSize = mainFontSize * 0.55;
      const centerX = width / 2 - mainFontSize * 6;
      const centerY = height / 2;

      page.drawText('INSTITUTE FOR STRATEGIC DIPLOMACY', {
        x: centerX,
        y: centerY,
        size: mainFontSize,
        font: font,
        color: rgb(0.1, 0.1, 0.15),
        opacity: 0.14,
        rotate: degrees(45),
      });

      page.drawText('OFFICIAL RESEARCH RECORD • VERIFIED POLICY BRIEF', {
        x: centerX - mainFontSize * 1.5,
        y: centerY - mainFontSize * 1.6,
        size: subFontSize,
        font: font,
        color: rgb(0.65, 0.45, 0.15),
        opacity: 0.18,
        rotate: degrees(45),
      });
    }

    const watermarkedBytes = await pdfDoc.save();
    return new File([watermarkedBytes], file.name, { type: 'application/pdf' });
  } catch (err) {
    console.warn("PDF Watermarking fallback (uploading original):", err);
    return file;
  }
}

export function renderWriterStudio(container, currentUser) {
  if (!container) return;

  container.innerHTML = `
    <div class="bg-paper border border-ink-200 rounded-lg p-6 md:p-8 shadow-sm space-y-6">
      
      <!-- Studio Header & Navigation Tabs -->
      <div class="border-b border-ink-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span class="text-xs uppercase tracking-[0.2em] text-bronze-600 font-bold font-sans">Institutional Publishing</span>
          <h2 class="font-serif text-2xl text-ink-900 mt-1">Research &amp; Dispatch Studio</h2>
        </div>
        
        <!-- Tab Switcher -->
        <div class="flex items-center gap-1 bg-ink-50 p-1 border border-ink-200 rounded text-xs font-sans">
          <button id="tab-brief" class="px-3 py-1.5 rounded font-bold bg-ink-900 text-paper transition-all cursor-pointer">Policy Brief</button>
          <button id="tab-wire" class="px-3 py-1.5 rounded font-medium text-ink-700 hover:text-ink-900 transition-all cursor-pointer">Wire Dispatch</button>
          <button id="tab-event" class="px-3 py-1.5 rounded font-medium text-ink-700 hover:text-ink-900 transition-all cursor-pointer">Symposium Event</button>
        </div>
      </div>

      <!-- Dynamic Form Viewport -->
      <div id="studio-viewport"></div>
    </div>
  `;

  const viewport = container.querySelector('#studio-viewport');
  const btnBrief = container.querySelector('#tab-brief');
  const btnWire = container.querySelector('#tab-wire');
  const btnEvent = container.querySelector('#tab-event');

  function setActiveTab(activeBtn) {
    [btnBrief, btnWire, btnEvent].forEach(b => {
      b.className = "px-3 py-1.5 rounded font-medium text-ink-700 hover:text-ink-900 transition-all cursor-pointer";
    });
    activeBtn.className = "px-3 py-1.5 rounded font-bold bg-ink-900 text-paper transition-all cursor-pointer";
  }

  function escapeHtml(value = '') {
    const element = document.createElement('div');
    element.textContent = value;
    return element.innerHTML;
  }

  async function loadPublishedItems({ table, listId, emptyMessage, dateField = 'created_at' }) {
    const list = viewport.querySelector(`#${listId}`);
    if (!list) return;

    list.innerHTML = '<p class="text-xs text-ink-500 font-sans animate-pulse">Loading published items...</p>';
    const { data: items, error } = await supabase
      .from(table)
      .select('*')
      .order(dateField, { ascending: false });

    if (error) {
      list.innerHTML = `<p class="text-xs text-red-700 font-sans">Could not load items: ${escapeHtml(error.message)}</p>`;
      return;
    }

    if (!items?.length) {
      list.innerHTML = `<p class="text-xs text-ink-500 font-sans">${emptyMessage}</p>`;
      return;
    }

    list.innerHTML = items.map(item => `
      <div class="flex items-center justify-between gap-4 rounded border border-ink-200 bg-ink-50/50 px-3 py-2.5">
        <div class="min-w-0">
          <p class="truncate font-serif text-sm font-bold text-ink-900">${escapeHtml(item.title)}</p>
          <p class="mt-0.5 text-[11px] text-ink-500 font-sans">${item[dateField] ? new Date(item[dateField]).toLocaleString() : 'Date unavailable'}</p>
        </div>
        <button type="button" data-delete-id="${item.id}" class="delete-published-item shrink-0 rounded border border-red-200 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-700 hover:bg-red-50 cursor-pointer">
          Delete
        </button>
      </div>
    `).join('');

    list.querySelectorAll('.delete-published-item').forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.deleteId;
        if (!window.confirm('Delete this item permanently? This cannot be undone.')) return;

        button.disabled = true;
        button.textContent = 'Deleting...';
        const { data: deletedItems, error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', id)
          .select('id');
        if (deleteError) {
          button.disabled = false;
          button.textContent = 'Delete';
          window.alert(`Could not delete this item: ${deleteError.message}`);
          return;
        }

        if (!deletedItems?.length) {
          button.disabled = false;
          button.textContent = 'Delete';
          window.alert('Nothing was deleted. Your Supabase Row Level Security policy may not allow this account to delete the item.');
          return;
        }

        await loadPublishedItems({ table, listId, emptyMessage, dateField });
      });
    });
  }

  // ==========================================
  // TAB 1: POLICY BRIEF FORM
  // ==========================================
  function renderBriefForm() {
    setActiveTab(btnBrief);
    let selectedFile = null;

    viewport.innerHTML = `
      <div id="submission-status" class="hidden p-4 rounded text-xs font-sans"></div>
      <form id="writer-brief-form" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2 space-y-1.5">
            <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">
              Brief Title <span class="text-red-700">*</span>
            </label>
            <input 
              type="text" 
              id="brief-title" 
              required
              placeholder="e.g. Geopolitical Implications of Sovereign Debt Restructuring in East Africa"
              class="w-full bg-paper border border-ink-200 focus:border-bronze-500 rounded px-4 py-2.5 text-sm text-ink-900 outline-none font-serif"
            />
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">
              Assigned Research Desk <span class="text-red-700">*</span>
            </label>
            <select 
              id="brief-desk" 
              required
              class="w-full bg-paper border border-ink-200 focus:border-bronze-500 rounded px-3 py-2.5 text-sm text-ink-900 outline-none font-sans"
            >
              <option value="" disabled selected>Select Desk</option>
              ${OFFICIAL_DESKS.map(desk => `<option value="${desk}">${desk}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">
            Executive Summary / Abstract <span class="text-red-700">*</span>
          </label>
          <textarea 
            id="brief-abstract" 
            required
            rows="3"
            placeholder="Summarize key findings, strategic imperatives, and diplomatic takeaways..."
            class="w-full bg-paper border border-ink-200 focus:border-bronze-500 rounded p-3 text-sm text-ink-900 outline-none font-sans"
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">
            Full Policy Assessment Text
          </label>
          <textarea 
            id="brief-body" 
            rows="6"
            placeholder="Write or paste your full analysis text here..."
            class="w-full bg-paper border border-ink-200 focus:border-bronze-500 rounded p-4 text-sm text-ink-900 outline-none font-serif leading-relaxed"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-ink-100">
          <div class="space-y-2">
            <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">
              Attach supporting document
            </label>
            <div id="file-drop-zone" class="border-2 border-dashed border-ink-300 hover:border-bronze-500 rounded-lg p-5 text-center bg-ink-50/50 cursor-pointer">
              <input type="file" id="brief-file-input" accept=".pdf,.doc,.docx" class="hidden" />
              <div id="file-prompt-container" class="space-y-2">
                <p class="text-xs font-sans font-semibold text-ink-800">Click to choose file or drag &amp; drop here</p>
                <p class="text-[11px] text-bronze-700 font-sans font-semibold">PDFs are watermarked once, after executive approval</p>
              </div>
              <div id="file-preview-bar" class="hidden flex items-center justify-between bg-paper border border-ink-200 p-3 rounded text-left">
                <span id="file-preview-name" class="text-xs font-bold text-ink-900 truncate font-sans"></span>
                <button type="button" id="remove-file-btn" class="text-xs font-bold text-red-700">Remove</button>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs uppercase tracking-wider font-bold text-ink-700 font-sans">External Reference Link</label>
            <input type="url" id="brief-link" placeholder="https://..." class="w-full bg-paper border border-ink-200 rounded px-4 py-2.5 text-sm outline-none font-sans" />
          </div>
        </div>

        <div class="pt-4 flex justify-end">
          <button type="submit" id="submit-brief-btn" class="px-6 py-3 bg-ink-900 hover:bg-bronze-600 text-paper font-sans text-xs uppercase tracking-[0.15em] font-bold rounded cursor-pointer flex items-center gap-2">
            <span>Submit for review</span>
            <span id="btn-spinner" class="hidden animate-spin">⏳</span>
          </button>
        </div>
      </form>
    `;

    const fileDropZone = viewport.querySelector('#file-drop-zone');
    const fileInput = viewport.querySelector('#brief-file-input');
    const filePrompt = viewport.querySelector('#file-prompt-container');
    const filePreview = viewport.querySelector('#file-preview-bar');
    const fileNameDisplay = viewport.querySelector('#file-preview-name');
    const removeFileBtn = viewport.querySelector('#remove-file-btn');

    fileDropZone.addEventListener('click', (e) => {
      if (e.target.closest('#remove-file-btn')) return;
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
        fileNameDisplay.innerText = `${selectedFile.name} (${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)`;
        filePrompt.classList.add('hidden');
        filePreview.classList.remove('hidden');
      }
    });

    removeFileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedFile = null;
      fileInput.value = '';
      filePreview.classList.add('hidden');
      filePrompt.classList.remove('hidden');
    });

    viewport.querySelector('#writer-brief-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = viewport.querySelector('#brief-title').value.trim();
      const desk_name = viewport.querySelector('#brief-desk').value;
      const abstract = viewport.querySelector('#brief-abstract').value.trim();
      const body = viewport.querySelector('#brief-body').value.trim();
      const external_link = viewport.querySelector('#brief-link').value.trim();
      const statusEl = viewport.querySelector('#submission-status');
      const submitBtn = viewport.querySelector('#submit-brief-btn');
      const spinner = viewport.querySelector('#btn-spinner');

      submitBtn.disabled = true;
      spinner.classList.remove('hidden');
      let uploadedFileUrl = external_link || null;

      try {
        if (selectedFile) {
          showStatus(statusEl, 'Uploading document assets...', 'info');
          const fileExt = selectedFile.name.split('.').pop();
          const filePath = `briefs/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: storageError } = await supabase.storage.from('brief-documents').upload(filePath, selectedFile);
          if (!storageError) {
            const { data: publicUrlData } = supabase.storage.from('brief-documents').getPublicUrl(filePath);
            uploadedFileUrl = publicUrlData?.publicUrl || uploadedFileUrl;
          }
        }

        const { error } = await supabase.from('policy_briefs').insert([{
          title, desk_name, category: desk_name, abstract, body,
          file_url: uploadedFileUrl, author_id: currentUser?.id,
          author_name: currentUser?.email?.split('@')[0] || 'Desk Analyst',
          status: 'pending_review'
        }]);

        if (error) throw error;
        showStatus(statusEl, 'Policy brief submitted for executive review.', 'success');
        viewport.querySelector('#writer-brief-form').reset();
        selectedFile = null;
        filePreview.classList.add('hidden');
        filePrompt.classList.remove('hidden');
      } catch (err) {
        showStatus(statusEl, `Submission Failed: ${err.message}`, 'error');
      } finally {
        submitBtn.disabled = false;
        spinner.classList.add('hidden');
      }
    });
  }

  // ==========================================
  // TAB 2: WIRE DISPATCH FORM (With Image Upload)
  // ==========================================
  function renderWireForm() {
    setActiveTab(btnWire);
    viewport.innerHTML = `
      <div id="wire-status" class="hidden p-4 rounded text-xs font-sans"></div>
      <form id="create-wire-form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Dispatch Title</label>
            <input type="text" id="wire-title" required placeholder="e.g. Horn of Africa Security Protocol..." class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Geographic Region</label>
            <input type="text" id="wire-region" placeholder="e.g. East Africa / Red Sea" class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Situational Summary</label>
          <textarea id="wire-summary" rows="4" required placeholder="Rapid analytical notes..." class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none"></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Attach Situational / News Photo</label>
            <input type="file" id="wire-image" accept="image/*" class="w-full text-xs text-ink-600 file:py-2 file:px-4 file:rounded file:bg-bronze-600 file:text-paper cursor-pointer" />
          </div>
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Author Desk</label>
            <input type="text" id="wire-analyst" value="ISD Strategy Desk" class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
        </div>

        <button type="submit" id="wire-submit-btn" class="w-full py-3 bg-bronze-600 hover:bg-bronze-500 text-paper text-xs uppercase tracking-widest font-bold rounded cursor-pointer">
          Publish Wire Dispatch Live
        </button>
      </form>

      <div class="border-t border-ink-200 pt-5 space-y-3">
        <div>
          <h3 class="font-serif text-base font-bold text-ink-900">Published Wire Dispatches</h3>
          <p class="text-[11px] text-ink-500 font-sans">Delete a dispatch that should no longer appear on the public wire.</p>
        </div>
        <div id="wire-published-list" class="space-y-2"></div>
      </div>
    `;

    loadPublishedItems({
      table: 'geopolitical_wire',
      listId: 'wire-published-list',
      emptyMessage: 'No wire dispatches have been published yet.'
    });

    viewport.querySelector('#create-wire-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('wire-submit-btn');
      const statusEl = document.getElementById('wire-status');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publishing Dispatch...';

      try {
        let imageUrl = null;
        const fileInput = document.getElementById('wire-image');
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const filePath = `wire/${Date.now()}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage.from('isd-media').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('isd-media').getPublicUrl(filePath);
          imageUrl = data.publicUrl;
        }

        const { error } = await supabase.from('geopolitical_wire').insert([{
          title: document.getElementById('wire-title').value,
          region: document.getElementById('wire-region').value,
          summary: document.getElementById('wire-summary').value,
          analyst_name: document.getElementById('wire-analyst').value,
          image_url: imageUrl
        }]);

        if (error) throw error;
        showStatus(statusEl, 'Wire dispatch broadcasted live successfully!', 'success');
        document.getElementById('create-wire-form').reset();
        loadPublishedItems({
          table: 'geopolitical_wire',
          listId: 'wire-published-list',
          emptyMessage: 'No wire dispatches have been published yet.'
        });
      } catch (err) {
        showStatus(statusEl, 'Error: ' + err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publish Wire Dispatch Live';
      }
    });
  }

  // ==========================================
  // TAB 3: SYMPOSIUM EVENT FORM (With Flyer Upload)
  // ==========================================
  function renderEventForm() {
    setActiveTab(btnEvent);
    viewport.innerHTML = `
      <div id="event-status" class="hidden p-4 rounded text-xs font-sans"></div>
      <form id="create-event-form" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Symposium Title</label>
            <input type="text" id="event-title" required placeholder="e.g. Quarterly Statecraft Symposium..." class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Venue</label>
            <input type="text" id="event-venue" value="Zetech University Auditorium" class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Event Date &amp; Time</label>
            <input type="datetime-local" id="event-date" required class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none" />
          </div>
          <div>
            <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Event Flyer / Photo</label>
            <input type="file" id="event-image" accept="image/*" class="w-full text-xs text-ink-600 file:py-2 file:px-4 file:rounded file:bg-bronze-600 file:text-paper cursor-pointer" />
          </div>
        </div>

        <div>
          <label class="block text-[11px] uppercase font-bold tracking-wider text-ink-700 mb-1">Agenda &amp; Description</label>
          <textarea id="event-desc" rows="4" required placeholder="Overview of speakers..." class="w-full px-3 py-2 text-xs bg-paper border border-ink-300 rounded outline-none"></textarea>
        </div>

        <button type="submit" id="event-submit-btn" class="w-full py-3 bg-bronze-600 hover:bg-bronze-500 text-paper text-xs uppercase tracking-widest font-bold rounded cursor-pointer">
          Schedule Symposium Publicly
        </button>
      </form>

      <div class="border-t border-ink-200 pt-5 space-y-3">
        <div>
          <h3 class="font-serif text-base font-bold text-ink-900">Scheduled Symposiums</h3>
          <p class="text-[11px] text-ink-500 font-sans">Delete an event that should no longer appear on the public schedule.</p>
        </div>
        <div id="event-published-list" class="space-y-2"></div>
      </div>
    `;

    loadPublishedItems({
      table: 'institute_events',
      listId: 'event-published-list',
      emptyMessage: 'No symposium events have been scheduled yet.',
      dateField: 'event_date'
    });

    viewport.querySelector('#create-event-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('event-submit-btn');
      const statusEl = document.getElementById('event-status');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Scheduling Event...';

      try {
        let imageUrl = null;
        const fileInput = document.getElementById('event-image');
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          const filePath = `events/${Date.now()}.${file.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage.from('isd-media').upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from('isd-media').getPublicUrl(filePath);
          imageUrl = data.publicUrl;
        }

        const { error } = await supabase.from('institute_events').insert([{
          title: document.getElementById('event-title').value,
          venue: document.getElementById('event-venue').value,
          event_date: document.getElementById('event-date').value,
          description: document.getElementById('event-desc').value,
          image_url: imageUrl
        }]);

        if (error) throw error;
        showStatus(statusEl, 'Symposium successfully scheduled!', 'success');
        document.getElementById('create-event-form').reset();
        loadPublishedItems({
          table: 'institute_events',
          listId: 'event-published-list',
          emptyMessage: 'No symposium events have been scheduled yet.',
          dateField: 'event_date'
        });
      } catch (err) {
        showStatus(statusEl, 'Error: ' + err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Schedule Symposium Publicly';
      }
    });
  }

  function showStatus(el, msg, type) {
    if (!el) return;
    el.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-800', 'bg-red-50', 'text-red-800', 'bg-blue-50', 'text-blue-800');
    if (type === 'success') el.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200');
    else if (type === 'error') el.classList.add('bg-red-50', 'text-red-800', 'border', 'border-red-200');
    else el.classList.add('bg-blue-50', 'text-blue-800', 'border', 'border-blue-200');
    el.innerText = msg;
  }

  // Hook up tab clicks
  btnBrief.addEventListener('click', renderBriefForm);
  btnWire.addEventListener('click', renderWireForm);
  btnEvent.addEventListener('click', renderEventForm);

  // Initialize view to Policy Briefs
  renderBriefForm();
}
