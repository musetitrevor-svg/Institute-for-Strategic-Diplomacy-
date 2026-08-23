/**
 * Renders the official rotating circular institutional seal.
 */
export function renderIsdLiveLogo() {
  return `
    <div class="relative w-32 h-32 flex items-center justify-center">
      <!-- Outer Ring with Rotating SVG Text -->
      <svg class="absolute inset-0 w-full h-full animate-[spin_25s_linear_infinite]" viewBox="0 0 100 100">
        <defs>
          <path id="circlePath" d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text class="text-[7.5px] uppercase tracking-[0.25em] font-sans fill-bronze-700 font-bold">
          <textPath href="#circlePath" startOffset="0%">
            • Sovereign &amp; Multilateral Statecraft • Institute for Strategic Diplomacy
          </textPath>
        </text>
      </svg>

      <!-- Static Center Core of the Seal -->
      <div class="w-16 h-16 rounded-full border-2 border-bronze-600 bg-paper flex flex-col items-center justify-center shadow-sm">
        <span class="font-serif text-sm tracking-widest text-bronze-800 font-bold">ISD</span>
      </div>
    </div>
  `;
}