import { EditorBlock } from '../../models/editor-block.model';
import { FOOTER_SOCIAL_PLATFORMS, normalizeFooterSocial } from './footer.repeat';

function safeUrl(parent: any, url: string): string {
  const value = String(url || '#').trim();
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value) || /^tel:/i.test(value) || /^\/\//.test(value) || /^\//.test(value) || value === '#') return parent.attr(value);
  return parent.attr(`https://${value}`);
}

function socialHref(platform: string, url: string): string {
  const value = String(url || '').trim();
  if (value) return value;
  return FOOTER_SOCIAL_PLATFORMS[platform]?.defaultUrl || '#';
}

export function renderFooterBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = String(c.variant || 'simple');
  const groups = Array.isArray(c.columns) ? c.columns : [];
  const socials = Array.isArray(c.socials) ? c.socials.map(normalizeFooterSocial) : [];

  const accent = parent.css(s.accent, '#FF4D6D');
  const bg = parent.css(s.background, '#F8FAFC');
  const color = parent.css(s.color, '#0F172A');
  const muted = parent.css(s.mutedColor, '#64748B');
  const linkColor = parent.css(s.linkColor, '#334155');
  const border = parent.css(s.borderColor, '#E2E8F0');
  const card = parent.css(s.cardBackground, '#FFFFFF');
  const buttonBg = parent.css(s.buttonBackground, accent);
  const buttonColor = parent.css(s.buttonColor, '#FFFFFF');
  const maxWidth = Math.max(760, Math.min(1600, Number(s.contentMaxWidth ?? 1180)));
  const pt = Math.max(0, Number(s.paddingTop ?? 34));
  const pb = Math.max(0, Number(s.paddingBottom ?? 26));
  const gap = Math.max(10, Number(s.columnGap ?? 22));
  const radius = Math.max(0, Number(s.radius ?? 0));

  const backgroundImage = String(s.backgroundImage || '').trim();
  const overlay = parent.css(s.overlay, 'rgba(0,0,0,.28)');
  const sectionBackground = backgroundImage
    ? `background-color:${bg};background-image:linear-gradient(${overlay},${overlay}),url('${parent.attr(backgroundImage)}');background-size:cover;background-position:center;`
    : `background:${bg};`;

  const brandHtml = `
    <div class="bt-footer-brand">
      ${c.logo ? `<img src="${parent.attr(c.logo)}" alt="${parent.attr(c.brand || 'Logo')}" style="max-width:${Math.max(60, Math.min(320, Number(c.logoWidth || 150)))}px;max-height:62px;object-fit:contain;display:block;margin-bottom:12px">` : ''}
      ${c.showBrand !== false ? `<div class="bt-footer-brand__name">${parent.escape(c.brand || 'Brand')}</div>` : ''}
      ${c.tagline ? `<div class="bt-footer-brand__tagline">${parent.escape(c.tagline)}</div>` : ''}
      ${c.text ? `<p class="bt-footer-brand__text">${parent.escape(c.text)}</p>` : ''}
    </div>`;

  const linkGroupHtml = (group: any, accordion = false): string => {
    const links = Array.isArray(group?.links) ? group.links : [];
    const linksHtml = links.map((link: any) => `<a href="${safeUrl(parent, link?.url)}" target="${parent.attr(link?.target || '_self')}" rel="${link?.target === '_blank' ? 'noopener noreferrer' : ''}" class="bt-footer-link">${parent.escape(link?.label || 'Link')}</a>`).join('');
    if (accordion) return `<details class="bt-footer-accordion"><summary>${parent.escape(group?.title || 'Links')}</summary><div class="bt-footer-accordion__links">${linksHtml}</div></details>`;
    return `<div class="bt-footer-group"><h4>${parent.escape(group?.title || 'Links')}</h4>${linksHtml}</div>`;
  };

  const desktopGroups = groups.map((g: any) => linkGroupHtml(g)).join('');
  const mobileAccordion = groups.map((g: any) => linkGroupHtml(g, true)).join('');

  const socialShape = String(c.socialShape || 'round');
  const socialStyle = String(c.socialStyle || 'logo');
  const socialSize = Math.max(20, Math.min(64, Number(c.socialSize || 34)));
  const socialGap = Math.max(0, Math.min(40, Number(c.socialGap || 9)));
  const socialShowName = Boolean(c.socialShowName) || socialStyle === 'logo-name' || socialStyle === 'cards';
  const socialNewTab = c.socialOpenNewTab !== false;
  const socialTitle = String(c.socialTitle || 'Follow us');
  const socialBg = socialStyle === 'soft' ? card : 'transparent';
  const socialBorder = socialStyle === 'cards' || socialStyle === 'soft' ? `1px solid ${border}` : '0';
  const socialPadding = socialStyle === 'cards' || socialStyle === 'soft' ? '9px 11px' : '4px';
  const socialRadius = socialShape === 'pill' ? 999 : socialShape === 'square' ? 10 : socialShape === 'round' ? 999 : 8;

  const socialsHtml = c.showSocials !== false && socials.length
    ? `<div class="bt-footer-socials"><div class="bt-footer-socials__title">${parent.escape(socialTitle)}</div><div class="bt-footer-socials__list" style="gap:${socialGap}px">${socials.map((raw: any) => {
      const item = normalizeFooterSocial(raw);
      const icon = item.icon;
      const isImage = /^https?:\/\//i.test(icon) || /^data:image\//i.test(icon);
      const iconHtml = isImage
        ? `<img src="${parent.attr(icon)}" alt="${parent.attr(item.name)} logo" width="${socialSize}" height="${socialSize}" loading="lazy">`
        : `<span class="material-symbols-rounded" style="font-size:${socialSize}px;line-height:1">${parent.escape(icon || 'public')}</span>`;
      const target = socialNewTab ? '_blank' : (item.target || '_self');
      const href = safeUrl(parent, socialHref(item.platform, item.url));
      return `<a class="bt-footer-social" href="${href}" target="${target}" rel="noopener noreferrer" aria-label="${parent.attr(item.name)}" title="${parent.attr(item.name)}" style="background:${socialBg};border:${socialBorder};padding:${socialPadding};border-radius:${socialRadius}px;min-height:${socialSize + 8}px">${iconHtml}${socialShowName ? `<span class="bt-footer-social__name">${parent.escape(item.name)}</span>` : ''}</a>`;
    }).join('')}</div></div>`
    : '';

  const contactHtml = `<div class="bt-footer-contact">
    ${c.showPhone !== false && c.phone ? `<a href="tel:${parent.attr(String(c.phone).replace(/\s+/g, ''))}" class="bt-footer-contact__item">${parent.escape(c.phone)}</a>` : ''}
    ${c.showWhatsapp !== false && c.whatsapp ? `<a href="https://wa.me/${parent.attr(String(c.whatsapp).replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener noreferrer" class="bt-footer-contact__item">WhatsApp · ${parent.escape(c.whatsapp)}</a>` : ''}
    ${c.showEmail !== false && c.email ? `<a href="mailto:${parent.attr(c.email)}" class="bt-footer-contact__item">${parent.escape(c.email)}</a>` : ''}
    ${c.showAddress && c.address ? `<div class="bt-footer-contact__text">${parent.escape(c.address)}${c.mapUrl ? ` <a href="${safeUrl(parent, c.mapUrl)}" target="_blank" rel="noopener noreferrer">Map</a>` : ''}</div>` : ''}
    ${c.showHours && c.hours ? `<div class="bt-footer-contact__text">${parent.escape(c.hours)}</div>` : ''}
  </div>`;

  const newsletterHtml = c.showNewsletter
    ? `<div class="bt-footer-card bt-footer-newsletter"><div><span class="bt-footer-eyebrow">Newsletter</span><h3>${parent.escape(c.newsletterTitle || 'Stay updated')}</h3><p>${parent.escape(c.newsletterText || '')}</p></div><div class="bt-footer-newsletter__form"><input type="email" placeholder="${parent.attr(c.newsletterPlaceholder || 'Your email address')}"><button type="button" style="background:${buttonBg};color:${buttonColor}">${parent.escape(c.newsletterButton || 'Subscribe')}</button></div></div>`
    : '';

  const ctaHtml = c.showCta
    ? `<div class="bt-footer-cta" style="background:linear-gradient(135deg,${accent},#C0265E)"><div><span class="bt-footer-eyebrow bt-footer-eyebrow--light">Let’s work together</span><h2>${parent.escape(c.ctaTitle || 'Ready to get started?')}</h2><p>${parent.escape(c.ctaText || '')}</p></div><a href="${safeUrl(parent, c.ctaUrl)}">${parent.escape(c.ctaLabel || 'Get Started')}</a></div>`
    : '';

  const appHtml = c.showAppButtons || c.showQr
    ? `<div class="bt-footer-app"><div>${c.showQr && c.qrImage ? `<img src="${parent.attr(c.qrImage)}" alt="QR code" class="bt-footer-app__qr">` : ''}</div><div><div class="bt-footer-eyebrow">${parent.escape(c.appTitle || 'Get the app')}</div>${c.showAppButtons ? `<div class="bt-footer-app__buttons"><a href="${safeUrl(parent, c.androidUrl)}">Android</a><a href="${safeUrl(parent, c.iosUrl)}">iOS</a></div>` : ''}</div></div>`
    : '';

  const legalHtml = c.showLegal !== false
    ? `<div class="bt-footer-legal"><span>${parent.escape(c.copyright || '')}</span><span class="bt-footer-legal__links">${c.privacyUrl ? `<a href="${safeUrl(parent, c.privacyUrl)}">Privacy</a>` : ''}${c.termsUrl ? `<a href="${safeUrl(parent, c.termsUrl)}">Terms</a>` : ''}</span></div>`
    : '';

  const layoutClass = `bt-footer bt-footer--${parent.safeDomId(variant)}`;
  let body = '';

  if (variant === 'minimal') {
    body = `<div class="bt-footer-centered">${brandHtml}${socialsHtml}<nav class="bt-footer-minimal-links">${groups.flatMap((g: any) => Array.isArray(g?.links) ? g.links : []).slice(0, 8).map((l: any) => `<a href="${safeUrl(parent, l.url)}">${parent.escape(l.label)}</a>`).join('')}</nav></div>`;
  } else if (variant === 'centered') {
    body = `<div class="bt-footer-centered bt-footer-centered--spacious">${brandHtml}${socialsHtml}<nav class="bt-footer-minimal-links">${groups.flatMap((g: any) => Array.isArray(g?.links) ? g.links : []).slice(0, 12).map((l: any) => `<a href="${safeUrl(parent, l.url)}">${parent.escape(l.label)}</a>`).join('')}</nav>${contactHtml}</div>`;
  } else if (variant === 'split') {
    body = `<div class="bt-footer-split"><div>${brandHtml}${socialsHtml}</div><div class="bt-footer-card">${desktopGroups}${contactHtml}</div></div>`;
  } else if (variant === 'dark-premium') {
    body = `<div class="bt-footer-premium-head"><div>${brandHtml}</div>${socialsHtml}</div><div class="bt-footer-premium-grid">${desktopGroups}<div class="bt-footer-card bt-footer-premium-contact">${contactHtml}</div></div>`;
  } else if (variant === 'newsletter') {
    body = `${newsletterHtml}<div class="bt-footer-grid bt-footer-grid--3">${desktopGroups}</div>${socialsHtml}`;
  } else if (variant === 'cta') {
    body = `${ctaHtml}<div class="bt-footer-grid bt-footer-grid--4"><div>${brandHtml}</div>${desktopGroups}${contactHtml}</div>${socialsHtml}`;
  } else if (variant === 'contact') {
    body = `<div class="bt-footer-split bt-footer-split--contact"><div>${brandHtml}${socialsHtml}</div><div class="bt-footer-card bt-footer-contact-card"><span class="bt-footer-eyebrow">Contact</span><h3>Let’s talk</h3>${contactHtml}</div></div>`;
  } else if (variant === 'business') {
    body = `<div class="bt-footer-grid bt-footer-grid--business"><div>${brandHtml}</div>${desktopGroups}<div class="bt-footer-card">${contactHtml}</div></div>${socialsHtml}`;
  } else if (variant === 'accordion-mobile') {
    body = `<div class="bt-footer-desktop-only bt-footer-grid bt-footer-grid--4"><div>${brandHtml}</div>${desktopGroups}</div><div class="bt-footer-mobile-only">${brandHtml}${mobileAccordion}${contactHtml}</div>${socialsHtml}`;
  } else if (variant === 'app-download') {
    body = `<div class="bt-footer-grid bt-footer-grid--3"><div>${brandHtml}</div><div>${desktopGroups}</div><div class="bt-footer-card">${appHtml}</div></div>${socialsHtml}`;
  } else if (variant === 'social-wall') {
    body = `<div class="bt-footer-centered">${brandHtml}<div class="bt-footer-social-wall"><span class="bt-footer-eyebrow">Connect everywhere</span>${socialsHtml}</div>${appHtml}</div>`;
  } else if (variant === 'large-brand') {
    body = `<div class="bt-footer-large-brand">${brandHtml}<div class="bt-footer-large-brand__word">${parent.escape(c.brand || 'Brand')}</div><div class="bt-footer-large-brand__bottom"><div>${desktopGroups}</div>${contactHtml}</div>${socialsHtml}</div>`;
  } else if (variant === 'floating-actions') {
    body = `<div class="bt-footer-grid bt-footer-grid--4"><div>${brandHtml}</div>${desktopGroups}${contactHtml}</div>${socialsHtml}`;
  } else if (variant === 'columns') {
    body = `<div class="bt-footer-grid bt-footer-grid--4"><div>${brandHtml}</div>${desktopGroups}${contactHtml}</div>${socialsHtml}`;
  } else if (variant === 'mega') {
    body = `<div class="bt-footer-grid bt-footer-grid--5"><div>${brandHtml}${socialsHtml}</div>${desktopGroups}</div>${contactHtml}${appHtml}`;
  } else {
    body = `<div class="bt-footer-grid bt-footer-grid--classic"><div>${brandHtml}${socialsHtml}</div>${desktopGroups}${contactHtml}</div>${newsletterHtml}${appHtml}`;
  }

  const floating = c.showFloatingActions
    ? `<div class="bt-footer-fixed-actions"><div class="bt-footer-fixed-actions__group">${c.actionCall ? `<a href="tel:${parent.attr(String(c.phone || '').replace(/\s+/g, ''))}" style="background:${buttonBg};color:${buttonColor}">Call</a>` : ''}${c.actionWhatsapp ? `<a href="https://wa.me/${parent.attr(String(c.whatsapp || '').replace(/[^0-9]/g, ''))}" target="_blank" rel="noopener noreferrer" style="background:#16A34A;color:#fff">WhatsApp</a>` : ''}${c.actionMessage ? `<a href="mailto:${parent.attr(c.email || '')}" style="background:${color};color:${bg}">Message</a>` : ''}</div></div>`
    : '';

  const backToTop = c.showBackToTop ? `<button type="button" class="bt-footer-backtop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">↑</button>` : '';

  const css = `
    <style>
      .${layoutClass.replace(/ /g, '.')} *{box-sizing:border-box}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-shell{max-width:${maxWidth}px;margin:0 auto}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid{display:grid;align-items:start;gap:${gap}px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--classic{grid-template-columns:minmax(0,1.35fr) repeat(2,minmax(0,1fr)) minmax(220px,.8fr)}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--3{grid-template-columns:repeat(3,minmax(0,1fr))}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--4{grid-template-columns:repeat(4,minmax(0,1fr))}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--5{grid-template-columns:1.25fr repeat(4,minmax(0,1fr))}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--business{grid-template-columns:1.2fr repeat(2,minmax(0,1fr)) 1fr}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-brand__name{font-size:${variant === 'large-brand' ? 32 : 24}px;line-height:1.05;font-weight:950;letter-spacing:-.04em;color:${color}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-brand__tagline{margin-top:7px;font-weight:700;color:${muted}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-brand__text{margin:12px 0 0;color:${muted};line-height:1.7;max-width:540px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-group h4{margin:0 0 11px;color:${color};font-size:13px;letter-spacing:.04em;text-transform:uppercase}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-link{display:block;margin:8px 0;color:${linkColor};text-decoration:none;line-height:1.45}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-link:hover,.${layoutClass.replace(/ /g, '.')} .bt-footer-minimal-links a:hover,.${layoutClass.replace(/ /g, '.')} .bt-footer-contact a:hover{color:${accent}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-contact{display:grid;gap:8px;align-content:start}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-contact__item{color:${linkColor};text-decoration:none;line-height:1.45}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-contact__text{color:${muted};line-height:1.6}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-contact__text a{color:${accent};text-decoration:none}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-card{padding:20px;background:${card};border:1px solid ${border};border-radius:16px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-eyebrow{display:block;color:${accent};font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.11em;margin-bottom:7px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-eyebrow--light{color:rgba(255,255,255,.82)}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-socials{margin-top:18px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-socials__title{font-size:11px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;color:${muted};margin-bottom:8px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-socials__list{display:flex;flex-wrap:wrap;align-items:center}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-social{display:inline-flex;align-items:center;justify-content:center;gap:8px;color:${linkColor};text-decoration:none;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-social:hover{transform:translateY(-2px);box-shadow:0 9px 22px rgba(15,23,42,.12)}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-social img{display:block;object-fit:contain;flex:0 0 auto}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-social__name{font-size:12px;font-weight:800;white-space:nowrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-bottom:${gap}px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter h3{margin:0 0 5px;font-size:23px;color:${color}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter p{margin:0;color:${muted};line-height:1.6;max-width:640px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter__form{display:flex;gap:8px;min-width:min(100%,420px)}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter__form input{min-width:0;flex:1;padding:12px 13px;border:1px solid ${border};border-radius:10px;background:transparent;color:${color};font:inherit}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter__form button{border:0;border-radius:10px;padding:12px 15px;font:inherit;font-weight:900;cursor:pointer}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-cta{display:flex;align-items:center;justify-content:space-between;gap:22px;padding:22px 24px;color:#fff;border-radius:18px;margin-bottom:24px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-cta h2{margin:0 0 6px;font-size:25px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-cta p{margin:0;opacity:.9;line-height:1.6}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-cta>a{display:inline-flex;padding:11px 15px;background:#fff;color:${accent};border-radius:10px;text-decoration:none;font-weight:950;white-space:nowrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-app{display:flex;align-items:center;gap:15px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-app__qr{width:78px;height:78px;object-fit:cover;border-radius:10px;background:#fff}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-app__buttons{display:flex;gap:8px;flex-wrap:wrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-app__buttons a{padding:9px 11px;border:1px solid ${border};border-radius:9px;color:${linkColor};text-decoration:none;font-weight:800}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-centered{text-align:center;display:grid;justify-items:center;gap:4px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-centered--spacious{gap:8px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-minimal-links{display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-top:16px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-minimal-links a{color:${linkColor};text-decoration:none;font-weight:750}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-split,.${layoutClass.replace(/ /g, '.')} .bt-footer-premium-head{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:${gap}px;align-items:start}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-premium-head{grid-template-columns:minmax(0,1fr) auto;align-items:end}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-premium-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${gap}px;margin-top:24px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-premium-contact{height:100%}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-contact-card h3{margin:0 0 14px;font-size:28px;color:${color}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-large-brand__word{font-size:clamp(54px,10vw,142px);line-height:.82;font-weight:950;letter-spacing:-.07em;margin:28px 0 34px;color:${color};word-break:break-word}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-large-brand__bottom{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;flex-wrap:wrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-accordion{border-top:1px solid ${border}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-accordion:last-child{border-bottom:1px solid ${border}}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-accordion summary{cursor:pointer;list-style:none;padding:13px 0;font-weight:850;color:${color}
      }
      .${layoutClass.replace(/ /g, '.')} .bt-footer-accordion summary::-webkit-details-marker{display:none}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-accordion__links{padding:0 0 10px}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-mobile-only{display:none}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-fixed-actions{position:fixed;right:18px;bottom:18px;z-index:99999}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-fixed-actions__group{display:flex;gap:8px;flex-direction:column}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-fixed-actions a{padding:10px 13px;border-radius:999px;text-decoration:none;font-weight:900;box-shadow:0 10px 25px rgba(15,23,42,.18)}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-backtop{position:absolute;right:18px;bottom:18px;width:38px;height:38px;border:1px solid ${border};border-radius:50%;background:${card};color:${color};cursor:pointer;font-weight:950}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-legal{max-width:${maxWidth}px;margin:26px auto 0;padding-top:15px;border-top:1px solid ${border};font-size:12px;color:${muted};display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-legal__links{display:flex;gap:14px;flex-wrap:wrap}
      .${layoutClass.replace(/ /g, '.')} .bt-footer-legal__links a{color:inherit;text-decoration:none}
      @media(max-width:900px){
        .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--classic,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--5,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--business{grid-template-columns:repeat(2,minmax(0,1fr))}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--4,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--3,.${layoutClass.replace(/ /g, '.')} .bt-footer-premium-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-split,.${layoutClass.replace(/ /g, '.')} .bt-footer-premium-head{grid-template-columns:1fr}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-premium-head{align-items:start}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-desktop-only{display:none}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-mobile-only{display:block}
      }
      @media(max-width:620px){
        .${layoutClass.replace(/ /g, '.')} .bt-footer-grid--classic,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--5,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--business,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--4,.${layoutClass.replace(/ /g, '.')} .bt-footer-grid--3,.${layoutClass.replace(/ /g, '.')} .bt-footer-premium-grid{grid-template-columns:1fr}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter,.${layoutClass.replace(/ /g, '.')} .bt-footer-cta{align-items:flex-start;flex-direction:column}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-newsletter__form{width:100%;min-width:0}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-large-brand__bottom{display:grid;grid-template-columns:1fr}
        .${layoutClass.replace(/ /g, '.')} .bt-footer-backtop{position:static;margin-left:auto;margin-top:18px}
      }
    </style>`;

  return `<footer class="${layoutClass}" style="${common};${sectionBackground}color:${color};padding:${pt}px 0 ${pb}px;position:relative;box-sizing:border-box;overflow:hidden;border-radius:${radius}px">
    ${css}
    <div class="bt-footer-shell" style="max-width:${maxWidth}px;margin:0 auto;padding:0 18px">${body}</div>
    <div class="bt-footer-shell">${legalHtml}</div>
    ${backToTop}${floating}
  </footer>`;
}
