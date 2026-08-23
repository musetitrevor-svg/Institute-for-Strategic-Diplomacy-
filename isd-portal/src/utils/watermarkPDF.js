// src/utils/watermarkPDF.js
import { PDFDocument, rgb, degrees } from 'pdf-lib';

/**
 * Applies an official institutional watermark and footer to a PDF document.
 * @param {ArrayBuffer|Uint8Array} existingPdfBytes - The original PDF file bytes.
 * @returns {Promise<Uint8Array>} - The watermarked PDF bytes.
 */
export async function applyInstitutionalWatermark(existingPdfBytes) {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  const watermarkText = "INSTITUTE FOR STRATEGIC DIPLOMACY — OFFICIAL RESEARCH ARCHIVE";

  for (const page of pages) {
    const { width, height } = page.getSize();

    // Draw diagonal background stamp across the page
    page.drawText(watermarkText, {
      x: width / 6,
      y: height / 2,
      size: 16,
      color: rgb(0.75, 0.70, 0.60), // Institutional bronze/grey tone
      opacity: 0.22,
      angle: degrees(45),
    });

    // Add secure footer certification line
    page.drawText("Verified & Published by the Directorate of Strategic Studies | Institute for Strategic Diplomacy", {
      x: 50,
      y: 25,
      size: 7.5,
      color: rgb(0.4, 0.4, 0.4),
      opacity: 0.7,
    });
  }

  return await pdfDoc.save();
}