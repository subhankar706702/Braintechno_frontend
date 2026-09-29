import { EditorBlock } from '../../models/editor-block.model';

export function renderTeamBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const rawVariant = String(c.variant || 'classic-grid');
  const legacyMap: Record<string, string> = {
    three: 'classic-grid',
    four: 'classic-grid',
    grid: 'classic-grid',
    social: 'social-bar',
    leadership: 'featured',
    two: 'split',
    dark: 'executive'
  };
  const variant = legacyMap[rawVariant] || rawVariant;
  const items = Array.isArray(c.items) ? c.items : [];
  const accent = parent.css(s.accent, '#FF4D6D');
  const bg = parent.css(s.background, '#FFFFFF');
  const color = parent.css(s.color, '#0F172A');
  const muted = parent.css(s.mutedColor, '#64748B');
  const cardBg = parent.css(s.cardBg, '#FFFFFF');
  const cardBorder = parent.css(s.cardBorder, '#E2E8F0');
  const imageBg = parent.css(s.imageBg, '#E5E7EB');
  const buttonBg = parent.css(s.buttonBg, accent);
  const buttonColor = parent.css(s.buttonColor, '#FFFFFF');
  const cols = Math.max(1, Math.min(6, Number(s.columns) || 3));
  const gap = Math.max(8, Number(s.gap) || 18);
  const cardRadius = Math.max(0, Number(s.cardRadius ?? 16));
  const sectionRadius = Math.max(0, Number(s.radius ?? 0));
  const dark = variant === 'overlay' || variant === 'executive' || s.dark === true;
  const titleColor = parent.css(s.titleColor, dark ? '#FFFFFF' : color);

  const normalizeHref = (url: any): string => {
    const value = String(url || '').trim();
    if (!value) return '#';
    return /^https?:\/\//i.test(value) || /^(mailto:|tel:|sms:|\#|\/)/i.test(value) ? value : `https://${value}`;
  };

  const socialLinks = (item: any, mode: 'inline' | 'bar' | 'overlay' = 'inline'): string => {
    if (c.showSocial === false) return '';
    const links = [
      { key: 'facebook', icon: 'facebook', url: item?.facebook },
      { key: 'instagram', icon: 'photo_camera', url: item?.instagram },
      { key: 'linkedin', icon: 'business', url: item?.linkedin },
      { key: 'x', icon: 'close', url: item?.x }
    ].filter((x: any) => String(x.url || '').trim());
    if (!links.length) return '';
    const bar = mode === 'bar';
    return `<div class="bt-team-social ${bar ? 'bt-team-social--bar' : ''}">${links.map((x: any) => `<a href="${parent.attr(normalizeHref(x.url))}" target="_blank" rel="noopener" aria-label="${x.key}" class="bt-team-social-link"><span class="material-symbols-rounded" aria-hidden="true">${x.icon}</span></a>`).join('')}</div>`;
  };

  const contact = (item: any): string => {
    if (c.showContact === false) return '';
    const links = [
      item?.phone ? `<a href="${parent.attr(normalizeHref(`tel:${item.phone}`))}"><span class="material-symbols-rounded">call</span>${parent.escape(item.phone)}</a>` : '',
      item?.email ? `<a href="${parent.attr(normalizeHref(`mailto:${item.email}`))}"><span class="material-symbols-rounded">mail</span>${parent.escape(item.email)}</a>` : '',
      item?.website ? `<a href="${parent.attr(normalizeHref(item.website))}" target="_blank" rel="noopener"><span class="material-symbols-rounded">language</span>Website</a>` : ''
    ].filter(Boolean);
    return links.length ? `<div class="bt-team-contact">${links.join('')}</div>` : '';
  };

  const meta = (item: any, compact = false): string => {
    const role = c.showRole !== false && item?.role ? `<div class="bt-team-role">${parent.escape(item.role)}</div>` : '';
    const department = c.showDepartment === true && item?.department ? `<span class="bt-team-badge">${parent.escape(item.department)}</span>` : '';
    const experience = c.showExperience === true && item?.experience ? `<span class="bt-team-experience">${parent.escape(item.experience)}</span>` : '';
    const skills = c.showSkills === true && item?.skills ? `<div class="bt-team-skills">${parent.escape(item.skills)}</div>` : '';
    const bio = c.showBio !== false && item?.bio ? `<p class="bt-team-bio ${compact ? 'is-compact' : ''}">${parent.escape(item.bio)}</p>` : '';
    return `${role}<div class="bt-team-meta-row">${department}${experience}</div>${skills}${bio}`;
  };

  const image = (item: any, extraClass = ''): string => {
    if (item?.image) return `<img class="bt-team-image ${extraClass}" src="${parent.attr(item.image)}" alt="${parent.attr(item?.name || 'Team member')}">`;
    const initials = String(item?.name || 'TM').split(/\s+/).filter(Boolean).slice(0, 2).map((x: string) => x.charAt(0).toUpperCase()).join('') || 'TM';
    return `<div class="bt-team-image bt-team-image--empty ${extraClass}"><span>${parent.escape(initials)}</span></div>`;
  };

  const button = (item: any): string => {
    if (c.showButton !== true || !item?.buttonLabel) return '';
    return `<a class="bt-team-button" href="${parent.attr(normalizeHref(item.buttonUrl || '#'))}">${parent.escape(item.buttonLabel)}</a>`;
  };

  const content = (item: any, compact = false): string => `<div class="bt-team-content">${meta(item, compact)}${contact(item)}${button(item)}</div>`;

  const card = (item: any, index: number): string => `<article class="bt-team-card bt-team-card--${parent.safeDomId(variant)}">${image(item)}<div class="bt-team-card-body"><div class="bt-team-name">${parent.escape(item?.name || `Team Member ${index + 1}`)}</div>${content(item)}${socialLinks(item)}</div></article>`;

  const heading = `${c.showTitle !== false && c.title ? `<h2 class="bt-team-title">${parent.escape(c.title)}</h2>` : ''}${c.showSubtitle !== false && c.subtitle ? `<p class="bt-team-subtitle">${parent.escape(c.subtitle)}</p>` : ''}`;

  let body = '';

  if (variant === 'minimal') {
    body = `<div class="bt-team-minimal-grid">${items.map((item: any, i: number) => `<article class="bt-team-minimal-item">${image(item, 'is-small')}<div class="bt-team-minimal-copy"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${meta(item, true)}${socialLinks(item)}</div></article>`).join('')}</div>`;
  } else if (variant === 'list') {
    body = `<div class="bt-team-list">${items.map((item: any, i: number) => `<article class="bt-team-list-item">${image(item, 'is-list')}<div class="bt-team-list-copy"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${content(item, true)}${socialLinks(item)}</div></article>`).join('')}</div>`;
  } else if (variant === 'alternating') {
    body = `<div class="bt-team-alternating">${items.map((item: any, i: number) => `<article class="bt-team-alt-row ${i % 2 ? 'is-reverse' : ''}"><div class="bt-team-alt-media">${image(item, 'is-alt')}</div><div class="bt-team-alt-copy"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${content(item)}${socialLinks(item)}</div></article>`).join('')}</div>`;
  } else if (variant === 'featured') {
    const first = items[0];
    const rest = items.slice(1);
    body = `${first ? `<article class="bt-team-featured">${image(first, 'is-featured')}<div class="bt-team-featured-copy"><div class="bt-team-eyebrow">Featured member</div><div class="bt-team-name">${parent.escape(first.name || 'Team Member')}</div>${content(first)}${socialLinks(first)}</div></article>` : ''}<div class="bt-team-grid bt-team-grid--featured">${rest.map((item: any, i: number) => card(item, i + 1)).join('')}</div>`;
  } else if (variant === 'portrait') {
    body = `<div class="bt-team-portrait-grid">${items.map((item: any, i: number) => `<article class="bt-team-portrait-card">${image(item, 'is-portrait')}<div class="bt-team-portrait-copy"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${meta(item, true)}${socialLinks(item)}</div></article>`).join('')}</div>`;
  } else if (variant === 'circular') {
    body = `<div class="bt-team-circular-grid">${items.map((item: any, i: number) => `<article class="bt-team-circular-card">${image(item, 'is-circle')}<div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${meta(item, true)}${socialLinks(item)}</article>`).join('')}</div>`;
  } else if (variant === 'social-bar') {
    body = `<div class="bt-team-grid bt-team-grid--social">${items.map((item: any, i: number) => `<article class="bt-team-social-card">${image(item, 'is-social')}<div class="bt-team-social-copy"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${meta(item, true)}</div>${socialLinks(item, 'bar')}</article>`).join('')}</div>`;
  } else if (variant === 'overlay') {
    body = `<div class="bt-team-overlay-grid">${items.map((item: any, i: number) => `<article class="bt-team-overlay-card">${image(item, 'is-overlay')}<div class="bt-team-overlay-layer"><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${meta(item, true)}${socialLinks(item, 'overlay')}</div></article>`).join('')}</div>`;
  } else if (variant === 'split') {
    const intro = items[0];
    const rest = items.slice(1);
    body = `<div class="bt-team-split-layout"><aside class="bt-team-split-intro"><div class="bt-team-eyebrow">Our people</div><h3>${parent.escape(intro?.name || 'Our team')}</h3>${intro ? content(intro) : ''}${intro ? socialLinks(intro) : ''}</aside><div class="bt-team-grid bt-team-grid--split">${rest.map((item: any, i: number) => card(item, i + 1)).join('')}</div></div>`;
  } else if (variant === 'slider') {
    body = `<div class="bt-team-slider">${items.map((item: any, i: number) => `<div class="bt-team-slide">${card(item, i)}</div>`).join('')}</div>`;
  } else if (variant === 'departments') {
    const groups: Record<string, any[]> = {};
    items.forEach((item: any) => {
      const dept = String(item?.department || 'Team');
      (groups[dept] ||= []).push(item);
    });
    body = `<div class="bt-team-departments">${Object.entries(groups).map(([dept, members]) => `<section class="bt-team-department"><div class="bt-team-department-head"><span class="bt-team-badge">${parent.escape(dept)}</span><span class="bt-team-department-count">${members.length} member${members.length === 1 ? '' : 's'}</span></div><div class="bt-team-grid">${members.map((item: any, i: number) => card(item, i)).join('')}</div></section>`).join('')}</div>`;
  } else if (variant === 'journey') {
    body = `<div class="bt-team-journey">${items.map((item: any, i: number) => `<article class="bt-team-journey-row"><div class="bt-team-journey-year">${parent.escape(item?.experience || `${i + 1}`)}</div><div class="bt-team-journey-marker"><span></span></div><div class="bt-team-journey-profile">${image(item, 'is-journey')}<div><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${content(item, true)}${socialLinks(item)}</div></div></article>`).join('')}</div>`;
  } else if (variant === 'executive') {
    body = `<div class="bt-team-executive-grid">${items.map((item: any, i: number) => `<article class="bt-team-executive-card">${image(item, 'is-executive')}<div class="bt-team-executive-copy"><div class="bt-team-eyebrow">Executive profile</div><div class="bt-team-name">${parent.escape(item?.name || `Member ${i + 1}`)}</div>${content(item)}${socialLinks(item)}</div></article>`).join('')}</div>`;
  } else {
    body = `<div class="bt-team-grid">${items.map((item: any, i: number) => card(item, i)).join('')}</div>`;
  }

  const bgStyle = String(s.backgroundImage || '').trim()
    ? `background-color:${bg};background-image:linear-gradient(${parent.css(s.overlay, dark ? 'rgba(15,23,42,.78)' : 'rgba(255,255,255,.82)')},${parent.css(s.overlay, dark ? 'rgba(15,23,42,.78)' : 'rgba(255,255,255,.82)')}),url('${parent.attr(s.backgroundImage)}');background-size:cover;background-position:center;`
    : `background:${bg};`;

  const styleClass = `bt-team bt-team--${parent.safeDomId(variant)}`;
  const css = `<style>
    .${styleClass.replace(/ /g, '.')} { color:${color}; border-radius:${sectionRadius}px; box-sizing:border-box; overflow:hidden; }
    .${styleClass.replace(/ /g, '.')} .bt-team-title { margin:0 0 7px; color:${titleColor}; font-size:28px; line-height:1.2; }
    .${styleClass.replace(/ /g, '.')} .bt-team-subtitle { margin:0 0 22px; color:${muted}; line-height:1.65; }
    .${styleClass.replace(/ /g, '.')} .bt-team-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; min-width:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-card { min-width:0; overflow:hidden; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; box-sizing:border-box; }
    .${styleClass.replace(/ /g, '.')} .bt-team-card-body { padding:16px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; background:${imageBg}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image--empty { display:grid; place-items:center; color:${accent}; font-size:24px; font-weight:900; }
    .${styleClass.replace(/ /g, '.')} .bt-team-name { color:${titleColor}; font-size:20px; line-height:1.25; font-weight:900; }
    .${styleClass.replace(/ /g, '.')} .bt-team-role { margin-top:4px; color:${accent}; font-size:13px; font-weight:800; }
    .${styleClass.replace(/ /g, '.')} .bt-team-meta-row { display:flex; flex-wrap:wrap; gap:7px; margin-top:9px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-badge,.${styleClass.replace(/ /g, '.')} .bt-team-experience { display:inline-flex; align-items:center; padding:5px 9px; border-radius:999px; background:${dark ? 'rgba(255,255,255,.09)' : '#FFF1F4'}; color:${dark ? '#FFFFFF' : accent}; font-size:10px; font-weight:900; }
    .${styleClass.replace(/ /g, '.')} .bt-team-skills { margin-top:9px; color:${muted}; font-size:12px; line-height:1.5; }
    .${styleClass.replace(/ /g, '.')} .bt-team-bio { margin:10px 0 0; color:${muted}; line-height:1.65; font-size:14px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-bio.is-compact { font-size:13px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-social { display:flex; align-items:center; gap:7px; flex-wrap:wrap; margin-top:13px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-social-link { width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; border:1px solid ${dark ? 'rgba(255,255,255,.16)' : '#E2E8F0'}; color:${dark ? '#FFFFFF' : '#334155'}; text-decoration:none; background:${dark ? 'rgba(255,255,255,.06)' : '#FFFFFF'}; box-sizing:border-box; }
    .${styleClass.replace(/ /g, '.')} .bt-team-social-link:hover { color:${accent}; border-color:${accent}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-social--bar { margin-top:0; padding:11px 14px; background:${dark ? 'rgba(255,255,255,.06)' : '#F8FAFC'}; border-top:1px solid ${cardBorder}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-contact { display:flex; flex-direction:column; gap:6px; margin-top:11px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-contact a { display:inline-flex; align-items:center; gap:7px; color:${muted}; text-decoration:none; font-size:12px; overflow-wrap:anywhere; }
    .${styleClass.replace(/ /g, '.')} .bt-team-contact .material-symbols-rounded { font-size:17px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-button { display:inline-flex; align-items:center; justify-content:center; margin-top:13px; padding:10px 14px; border-radius:10px; background:${buttonBg}; color:${buttonColor}; text-decoration:none; font-weight:800; font-size:13px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-minimal-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-minimal-item { display:flex; gap:12px; align-items:center; min-width:0; padding:11px 0; border-bottom:1px solid ${cardBorder}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-small { width:58px; height:58px; aspect-ratio:1; border-radius:50%; flex:0 0 auto; }
    .${styleClass.replace(/ /g, '.')} .bt-team-minimal-copy { min-width:0; }

    .${styleClass.replace(/ /g, '.')} .bt-team-list { display:flex; flex-direction:column; gap:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-list-item { display:grid; grid-template-columns:120px minmax(0,1fr); gap:18px; align-items:center; padding:18px 0; border-bottom:1px solid ${cardBorder}; min-width:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-list { width:120px; height:120px; aspect-ratio:1; border-radius:${cardRadius}px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-alternating { display:flex; flex-direction:column; gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-alt-row { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr); gap:${gap}px; align-items:center; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; overflow:hidden; }
    .${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse { grid-template-columns:minmax(0,1.2fr) minmax(220px,.8fr); }
    .${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse .bt-team-alt-media { order:2; }
    .${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse .bt-team-alt-copy { order:1; }
    .${styleClass.replace(/ /g, '.')} .bt-team-alt-copy { padding:22px; min-width:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-alt { height:100%; min-height:260px; aspect-ratio:auto; }

    .${styleClass.replace(/ /g, '.')} .bt-team-featured { display:grid; grid-template-columns:minmax(280px,.9fr) minmax(0,1.1fr); gap:${gap}px; align-items:center; padding:20px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-featured { aspect-ratio:1/1; border-radius:${Math.max(0, cardRadius - 2)}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-featured-copy { min-width:0; padding:8px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-eyebrow { color:${accent}; font-size:11px; font-weight:900; letter-spacing:.09em; text-transform:uppercase; margin-bottom:8px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-grid--featured { margin-top:${gap}px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-portrait-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-portrait-card { min-width:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-portrait { aspect-ratio:3/4; border-radius:${cardRadius}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-portrait-copy { padding-top:12px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-circular-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-circular-card { text-align:center; min-width:0; padding:12px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-circle { width:min(100%,180px); aspect-ratio:1; margin:0 auto 14px; border-radius:50%; border:6px solid ${dark ? 'rgba(255,255,255,.10)' : '#FFF1F4'}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-circular-card .bt-team-meta-row,.${styleClass.replace(/ /g, '.')} .bt-team-circular-card .bt-team-social { justify-content:center; }

    .${styleClass.replace(/ /g, '.')} .bt-team-social-card { overflow:hidden; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-social { aspect-ratio:1/1; }
    .${styleClass.replace(/ /g, '.')} .bt-team-social-copy { padding:14px 14px 12px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-overlay-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-overlay-card { position:relative; overflow:hidden; border-radius:${cardRadius}px; min-width:0; min-height:340px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-overlay { position:absolute; inset:0; width:100%; height:100%; aspect-ratio:auto; }
    .${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer { position:absolute; inset:auto 0 0; padding:22px 18px 18px; background:linear-gradient(transparent,rgba(15,23,42,.92)); color:#FFFFFF; }
    .${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer .bt-team-name { color:#FFFFFF; }
    .${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer .bt-team-role,.${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer .bt-team-bio,.${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer .bt-team-skills,.${styleClass.replace(/ /g, '.')} .bt-team-overlay-layer .bt-team-contact a { color:rgba(255,255,255,.82); }

    .${styleClass.replace(/ /g, '.')} .bt-team-split-layout { display:grid; grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr); gap:${gap}px; align-items:start; }
    .${styleClass.replace(/ /g, '.')} .bt-team-split-intro { position:sticky; top:14px; padding:24px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-grid--split { grid-template-columns:repeat(2,minmax(0,1fr)); }

    .${styleClass.replace(/ /g, '.')} .bt-team-slider { display:flex; gap:${gap}px; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; padding:2px 2px 14px; scrollbar-width:thin; }
    .${styleClass.replace(/ /g, '.')} .bt-team-slide { flex:0 0 clamp(260px,31vw,360px); min-width:0; scroll-snap-align:start; }
    .${styleClass.replace(/ /g, '.')} .bt-team-slide .bt-team-grid { display:block; }

    .${styleClass.replace(/ /g, '.')} .bt-team-departments { display:flex; flex-direction:column; gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-department { padding-top:4px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-department-head { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:12px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-department-count { color:${muted}; font-size:12px; font-weight:800; }

    .${styleClass.replace(/ /g, '.')} .bt-team-journey { display:flex; flex-direction:column; position:relative; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey:before { content:''; position:absolute; left:96px; top:20px; bottom:20px; width:2px; background:${cardBorder}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey-row { display:grid; grid-template-columns:80px 32px minmax(0,1fr); gap:14px; align-items:center; position:relative; min-width:0; padding:10px 0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey-year { text-align:right; color:${accent}; font-size:12px; font-weight:900; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey-marker { display:flex; justify-content:center; z-index:2; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey-marker span { width:14px; height:14px; border-radius:50%; background:${accent}; box-shadow:0 0 0 6px ${dark ? 'rgba(255,255,255,.08)' : '#FFF1F4'}; }
    .${styleClass.replace(/ /g, '.')} .bt-team-journey-profile { display:grid; grid-template-columns:78px minmax(0,1fr); gap:14px; align-items:center; padding:14px; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; min-width:0; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-journey { width:78px; height:78px; aspect-ratio:1; border-radius:14px; }

    .${styleClass.replace(/ /g, '.')} .bt-team-executive-grid { display:grid; grid-template-columns:repeat(${cols},minmax(0,1fr)); gap:${gap}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-executive-card { overflow:hidden; background:${cardBg}; border:1px solid ${cardBorder}; border-radius:${cardRadius}px; }
    .${styleClass.replace(/ /g, '.')} .bt-team-image.is-executive { aspect-ratio:4/3; }
    .${styleClass.replace(/ /g, '.')} .bt-team-executive-copy { padding:18px; }

    @media (max-width: 900px) {
      .${styleClass.replace(/ /g, '.')} .bt-team-grid,.${styleClass.replace(/ /g, '.')} .bt-team-portrait-grid,.${styleClass.replace(/ /g, '.')} .bt-team-circular-grid,.${styleClass.replace(/ /g, '.')} .bt-team-overlay-grid,.${styleClass.replace(/ /g, '.')} .bt-team-executive-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .${styleClass.replace(/ /g, '.')} .bt-team-minimal-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .${styleClass.replace(/ /g, '.')} .bt-team-split-layout { grid-template-columns:1fr; }
      .${styleClass.replace(/ /g, '.')} .bt-team-split-intro { position:static; }
      .${styleClass.replace(/ /g, '.')} .bt-team-grid--split { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .${styleClass.replace(/ /g, '.')} .bt-team-featured { grid-template-columns:1fr; }
    }

    @media (max-width: 650px) {
      .${styleClass.replace(/ /g, '.')} .bt-team-grid,.${styleClass.replace(/ /g, '.')} .bt-team-portrait-grid,.${styleClass.replace(/ /g, '.')} .bt-team-circular-grid,.${styleClass.replace(/ /g, '.')} .bt-team-overlay-grid,.${styleClass.replace(/ /g, '.')} .bt-team-executive-grid,.${styleClass.replace(/ /g, '.')} .bt-team-minimal-grid { grid-template-columns:1fr; }
      .${styleClass.replace(/ /g, '.')} .bt-team-list-item { grid-template-columns:82px minmax(0,1fr); gap:13px; }
      .${styleClass.replace(/ /g, '.')} .bt-team-image.is-list { width:82px; height:82px; }
      .${styleClass.replace(/ /g, '.')} .bt-team-alt-row,.${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse { grid-template-columns:1fr; }
      .${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse .bt-team-alt-media,.${styleClass.replace(/ /g, '.')} .bt-team-alt-row.is-reverse .bt-team-alt-copy { order:initial; }
      .${styleClass.replace(/ /g, '.')} .bt-team-image.is-alt { height:auto; min-height:0; aspect-ratio:4/3; }
      .${styleClass.replace(/ /g, '.')} .bt-team-overlay-card { min-height:310px; }
      .${styleClass.replace(/ /g, '.')} .bt-team-journey:before { left:15px; }
      .${styleClass.replace(/ /g, '.')} .bt-team-journey-row { grid-template-columns:20px minmax(0,1fr); gap:10px; }
      .${styleClass.replace(/ /g, '.')} .bt-team-journey-year { grid-column:2; grid-row:1; text-align:left; }
      .${styleClass.replace(/ /g, '.')} .bt-team-journey-marker { grid-column:1; grid-row:1; }
      .${styleClass.replace(/ /g, '.')} .bt-team-journey-profile { grid-column:2; grid-row:2; grid-template-columns:64px minmax(0,1fr); }
      .${styleClass.replace(/ /g, '.')} .bt-team-image.is-journey { width:64px; height:64px; }
    }
  </style>`;

  return `<section class="${styleClass}" style="${common};${bgStyle}border-radius:${sectionRadius}px;color:${color};">${css}${heading}${body}</section>`;
}
