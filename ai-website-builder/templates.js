export function renderSectionHtml(section) {
  const { type, title, subtitle, content, theme } = section;
  
  // Safe fallback styles if AI omits colors
  const bg = theme?.bg || '#ffffff';
  const text = theme?.text || '#1f2937';
  const accent = theme?.accent || '#2563eb';
  const inlineStyles = `background-color: ${bg}; color: ${text}; padding: 80px 24px; font-family: system-ui, sans-serif;`;

  // Standardize naming variants to lower-case to avoid structural dropouts
  switch (type.toLowerCase()) {
    case 'header':
      return `
        <header style="background-color: ${bg}; color: ${text}; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.1);">
          <div style="font-size: 24px; font-weight: bold;">${title || 'Brand'}</div>
          <nav style="display: flex; gap: 20px;">
            ${(content?.links || ['About', 'Services', 'FAQ']).map(link => `<a href="#${link.toLowerCase()}" style="color: ${text}; text-decoration: none; font-weight: 500;">${link}</a>`).join('')}
          </nav>
        </header>
      `;

    case 'hero':
      return `
        <section id="hero" style="${inlineStyles} text-align: center; padding: 120px 24px;">
          <h1 style="font-size: 48px; font-weight: 800; margin-bottom: 20px; line-height: 1.2;">${title || 'Innovate Your Workflow'}</h1>
          <p style="font-size: 20px; max-width: 600px; margin: 0 auto 30px; opacity: 0.85;">${subtitle || 'The modern engine built to maximize efficiency and build continuous value parameters.'}</p>
          <button style="background-color: ${accent}; color: #ffffff; padding: 14px 28px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;">${content?.ctaText || 'Get Started'}</button>
        </section>
      `;

    case 'about':
      return `
        <section id="about" style="${inlineStyles}">
          <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 20px;">${title || 'About Us'}</h2>
            <p style="font-size: 18px; line-height: 1.6; opacity: 0.9;">${subtitle || 'We are dedicated to restructuring operational standards globally through scalable, clean modular engineering configurations.'}</p>
          </div>
        </section>
      `;

    case 'services':
      return `
        <section id="services" style="${inlineStyles}">
          <div style="max-width: 1100px; margin: 0 auto; text-align: center;">
            <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 16px;">${title || 'Our Services'}</h2>
            <p style="margin-bottom: 50px; opacity: 0.8;">Everything you need to grow your digital infrastructure footprint.</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
              <div style="padding: 30px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); border-radius: 8px;">
                <h3 style="margin-bottom: 10px; color: ${accent};">Core Solution</h3>
                <p style="font-size: 14px; opacity: 0.8;">Full architecture migration and pipeline deployments.</p>
              </div>
              <div style="padding: 30px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.1); border-radius: 8px;">
                <h3 style="margin-bottom: 10px; color: ${accent};">Custom Automation</h3>
                <p style="font-size: 14px; opacity: 0.8;">Eliminate operational latency loops with native smart apps.</p>
              </div>
            </div>
          </div>
        </section>
      `;

    case 'whyus':
      return `
        <section id="whyus" style="${inlineStyles} text-align: center;">
          <div style="max-width: 900px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 20px;">${title || 'Why Choose Us'}</h2>
            <p style="line-height: 1.6; opacity: 0.85; font-size: 18px;">${subtitle || 'We design with execution velocity and pixel integrity at the center of every architectural layer.'}</p>
          </div>
        </section>
      `;

    case 'testimonials':
      return `
        <section id="testimonials" style="${inlineStyles} text-align: center;">
          <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 40px;">${title || 'Client Testimonials'}</h2>
            <div style="padding: 30px; background: rgba(0,0,0,0.02); border-left: 4px solid ${accent}; border-radius: 0 8px 8px 0;">
              <p style="font-size: 22px; font-style: italic; line-height: 1.4; margin-bottom: 20px;">"${subtitle || 'This automation structural redesign completely shifted how we service end user properties daily.'}"</p>
              <div style="font-weight: 600; color: ${accent};">— Operations Lead</div>
            </div>
          </div>
        </section>
      `;

    case 'faq':
      return `
        <section id="faq" style="${inlineStyles}">
          <div style="max-width: 750px; margin: 0 auto;">
            <h2 style="font-size: 36px; font-weight: 700; text-align: center; margin-bottom: 40px;">${title || 'Frequently Asked Questions'}</h2>
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);">
              <h4 style="font-size: 18px; margin-bottom: 8px;">How long does deployment take?</h4>
              <p style="opacity: 0.8; font-size: 15px;">Standard production setup pipelines resolve in less than 48 hours.</p>
            </div>
            <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(0,0,0,0.1);">
              <h4 style="font-size: 18px; margin-bottom: 8px;">Do you provide ongoing support?</h4>
              <p style="opacity: 0.8; font-size: 15px;">Yes, all our plans include 24/7 dedicated engineering support.</p>
            </div>
          </div>
        </section>
      `;

    case 'gallery':
      return `
        <section id="gallery" style="${inlineStyles} text-align: center;">
          <h2 style="font-size: 36px; font-weight: 700; margin-bottom: 40px;">${title || 'Visual Gallery'}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; max-width: 1200px; margin: 0 auto;">
            <div style="background: rgba(0,0,0,0.05); padding-top: 75%; border-radius: 6px; position: relative;"><span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.5;">Project Frame 1</span></div>
            <div style="background: rgba(0,0,0,0.05); padding-top: 75%; border-radius: 6px; position: relative;"><span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.5;">Project Frame 2</span></div>
            <div style="background: rgba(0,0,0,0.05); padding-top: 75%; border-radius: 6px; position: relative;"><span style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); opacity:0.5;">Project Frame 3</span></div>
          </div>
        </section>
      `;

    case 'footer':
      return `
        <footer style="background-color: ${bg}; color: ${text}; padding: 40px 24px; text-align: center; font-family: sans-serif; border-top: 1px solid rgba(0,0,0,0.1); font-size: 14px;">
          <p style="margin-bottom: 10px; font-weight: bold;">${title || 'Brand Inc.'}</p>
          <p style="opacity: 0.6;">&copy; ${new Date().getFullYear()} Architectural Platform System. All rights reserved.</p>
        </footer>
      `;

    default:
      return `<section style="padding:40px; text-align:center;"><h3>Missing Section Type: ${type}</h3></section>`;
  }
}
