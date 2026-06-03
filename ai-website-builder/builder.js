import { renderSectionHtml } from './mtemp.js';

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generate-btn'); 
  const redoBtn = document.getElementById('redo-btn'); 
  const promptInput = document.getElementById('prompt-input'); 
  const previewCanvas = document.getElementById('website-preview'); 

  async function generateWebsiteLayout() {
    const promptText = promptInput.value.trim();
    if (!promptText) return alert('Please enter a description first.');

    // ABSOLUTE WIPEDOWN: Clears old DOM nodes completely before running API fetch
    previewCanvas.innerHTML = `
      <div class="loading-state" style="text-align:center; padding: 100px 20px; font-family: sans-serif;">
        <div class="spinner" style="border: 4px solid #f3f4f6; border-top: 4px solid #3b82f6; border-radius: 50%; width:40px; height:40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <h3>Architecting Full 9-Section Layout via Groq...</h3>
        <p style="color:#6b7280;">Generating structural elements, layouts, and custom typography.</p>
      </div>
      <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) throw new Error('Server generation error failed');
      const sectionsBlueprint = await response.json();

      // Clear the loading spinner completely
      previewCanvas.innerHTML = '';

      // Loop and construct all returned sections cleanly
      sectionsBlueprint.forEach((sectionData) => {
        const rawHtmlString = renderSectionHtml(sectionData);
        previewCanvas.insertAdjacentHTML('beforeend', rawHtmlString);
      });

    } catch (error) {
      console.error("Layout Engine Failure:", error);
      previewCanvas.innerHTML = `
        <div style="padding: 40px; text-align: center; color: #ef4444;">
          <h3>Generation Failed</h3>
          <p>Could not compile structural design components. Check your browser console for errors.</p>
        </div>
      `;
    }
  }

  // Attach event listeners to your buttons
  if (generateBtn) generateBtn.addEventListener('click', generateWebsiteLayout);
  if (redoBtn) redoBtn.addEventListener('click', generateWebsiteLayout);
});
