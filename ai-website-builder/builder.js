// builder.js
import { getTemplateById, renderSectionHtml } from './mtemp.js';

/**
 * Builds and mounts a specific template to the DOM.
 * @param {string} templateId - The ID of the template from mtemp.js
 * @param {string} containerId - The ID of the HTML element to render into
 */
export function buildPage(templateId, containerId = 'app') {
  const container = document.getElementById(containerId);
  const template = getTemplateById(templateId);

  if (!container) {
    console.error(`Container element #${containerId} not found.`);
    return;
  }

  if (!template) {
    console.error(`Template with ID "${templateId}" not found.`);
    return;
  }

  // 1. Filter out metadata (id and name) so we only process sections
  const sectionEntries = Object.entries(template).filter(
    ([key]) => !['id', 'name'].includes(key)
  );

  // 2. Map through sections and generate HTML
  const pageHtml = sectionEntries
    .map(([sectionType, variant]) => {
      // Pass the necessary data to your renderer
      return renderSectionHtml({
        type: sectionType,
        variant: variant,
        content: {
          title: formatTitle(sectionType),
          subtitle: `Variant: ${variant}`,
          text: `This is the ${sectionType} section.`
        }
      });
    })
    .join('');

  // 3. Mount to DOM
  container.innerHTML = pageHtml;
  console.log(`Successfully built template: ${template.name}`);
}

/**
 * Simple helper to make section titles look nice
 */
function formatTitle(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Optional: Auto-run or attach to a button
// buildPage('saas_dark', 'app');
