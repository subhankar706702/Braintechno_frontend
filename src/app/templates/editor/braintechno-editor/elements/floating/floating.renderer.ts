import { EditorBlock } from '../../models/editor-block.model';

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'https://cdn.simpleicons.org/facebook/1877F2',
  instagram: 'https://cdn.simpleicons.org/instagram/E4405F',
  youtube: 'https://cdn.simpleicons.org/youtube/FF0000',
  linkedin: 'https://cdn.tools.unlayer.com/social/icons/circle/linkedin.png',
  twitter: 'https://cdn.simpleicons.org/x/111111'
};

function safeHref(parent: any, value: string): string {
  const raw = String(value || '#').trim();
  if (/^https?:\/\//i.test(raw) || /^mailto:/i.test(raw) || /^tel:/i.test(raw) || /^sms:/i.test(raw) || raw.startsWith('#') || raw.startsWith('/')) {
    return parent.attr(raw);
  }
  return parent.attr(`https://${raw}`);
}

function normalizedItems(c: Record<string, any>): any[] {
  const source = Array.isArray(c.actions) ? c.actions : Array.isArray(c.items) ? c.items : [];
  const list = source.filter((item: any) => item && item.enabled !== false);
  return list.length ? list : [{
    type: 'custom', label: c.mainLabel || 'Action', icon: c.mainIcon || 'touch_app',
    url: '#', color: '#FF4D6D', target: '_self', tooltip: true, enabled: true
  }];
}

function actionIcon(parent: any, item: any): string {
  const platform = String(item?.socialPlatform || '').toLowerCase();
  if (item?.type === 'social' && SOCIAL_ICONS[platform]) {
    return `<img src="${parent.attr(SOCIAL_ICONS[platform])}" alt="" loading="lazy">`;
  }
  if (item?.image) {
    return `<img src="${parent.attr(item.image)}" alt="" loading="lazy">`;
  }
  return `<span class="material-symbols-rounded" aria-hidden="true">${parent.escape(item?.icon || 'touch_app')}</span>`;
}

function itemHref(item: any): string {
  if (item?.type === 'backtop') return '#top';
  return String(item?.url || '#');
}

export function renderFloatingBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const layout = String(c.layout || 'expand');
  const openMode = String(c.openMode || 'click');
  const position = String(s.position || 'bottom-right');
  const items = normalizedItems(c);
  const bg = parent.css(s.background, '#FF4D6D');
  const fg = parent.css(s.color, '#FFFFFF');
  const size = Math.max(34, Number(s.size ?? 50));
  const actionSize = Math.max(32, Number(s.actionSize ?? 44));
  const gap = Math.max(4, Number(s.gap ?? 10));
  const radius = Math.max(0, Number(s.radius ?? 999));
  const offsetX = Math.max(0, Number(s.offsetX ?? 20));
  const offsetY = Math.max(0, Number(s.offsetY ?? 20));
  const z = Math.max(100, Number(s.zIndex ?? 1200));
  const shadow = String(s.shadow || '0 12px 28px rgba(15,23,42,.18)');
  const editorOpen = c.openState === true || openMode === 'always';
  const shouldShowMain = openMode === 'click' && layout !== 'single';
  const classes = [
    'bt-floating',
    `bt-floating--${parent.safeDomId(layout)}`,
    `bt-floating--${parent.safeDomId(position)}`,
    c.mobileOnly ? 'is-mobile-only' : '',
    c.desktopOnly ? 'is-desktop-only' : ''
  ].filter(Boolean).join(' ');

  const actionButtons = items.map((item: any) => {
    const label = parent.escape(item.label || 'Action');
    const itemBg = parent.css(item.color, bg);
    const target = item.target === '_blank' ? '_blank' : '_self';
    const href = safeHref(parent, itemHref(item));
    const title = item.tooltip !== false ? ` title="${parent.attr(item.label || 'Action')}"` : '';
    return `<a class="bt-floating-action" href="${href}" target="${target}" rel="${target === '_blank' ? 'noopener noreferrer' : ''}" data-floating-action="${parent.attr(item.type || 'custom')}"${item.socialPlatform ? ` data-social-platform="${parent.attr(item.socialPlatform)}"` : ''}${title} style="min-width:${actionSize}px;height:${actionSize}px;background:${itemBg};color:#fff;border-radius:${radius}px;box-shadow:${shadow}"><span class="bt-floating-action-icon">${actionIcon(parent, item)}</span>${c.showLabels !== false ? `<span class="bt-floating-action-label">${label}</span>` : ''}</a>`;
  }).join('');

  const mainButton = shouldShowMain
    ? `<button type="button" class="bt-floating-main" aria-label="${parent.attr(c.mainLabel || 'Open actions')}" data-floating-toggle="true" style="width:${size}px;height:${size}px;background:${bg};color:${fg};border-radius:${radius}px;box-shadow:${shadow}">${c.mainImage ? `<img src="${parent.attr(c.mainImage)}" alt="">` : `<span class="material-symbols-rounded">${parent.escape(c.mainIcon || 'add')}</span>`}</button>`
    : '';

  const positionStyle = `right:${position.includes('right') ? `${offsetX}px` : 'auto'};left:${position.includes('left') ? `${offsetX}px` : 'auto'};bottom:${position.includes('bottom') ? `${offsetY}px` : 'auto'};top:${position.includes('center') ? '50%' : 'auto'};transform:${position.includes('center') ? 'translateY(-50%)' : 'none'};`;
  const classSelector = `.${classes.split(' ').join('.')}`;

  return `<div class="${classes}" data-bt-floating="true" style="position:fixed;${positionStyle}z-index:${z};${common}">
    <div class="bt-floating-actions" data-floating-open="${editorOpen ? 'true' : 'false'}" style="gap:${gap}px">${actionButtons}</div>
    ${mainButton}
  </div>
  <style>
    ${classSelector}{box-sizing:border-box;pointer-events:auto;}
    ${classSelector} .bt-floating-actions{display:flex;align-items:flex-end;justify-content:flex-end;flex-direction:${layout === 'horizontal' ? 'row' : 'column'};gap:${gap}px;}
    ${classSelector}.bt-floating--horizontal .bt-floating-actions{flex-direction:row;}
    ${classSelector} .bt-floating-action{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:0 10px;text-decoration:none;box-sizing:border-box;font-weight:800;font-size:12px;overflow:hidden;cursor:pointer;transition:transform .16s ease,filter .16s ease;}
    ${classSelector} .bt-floating-action-icon{width:${actionSize}px;height:${actionSize}px;display:grid;place-items:center;flex:0 0 auto;}
    ${classSelector} .bt-floating-action img{width:22px;height:22px;object-fit:contain;display:block;}
    ${classSelector} .bt-floating-action .material-symbols-rounded{font-size:20px;}
    ${classSelector} .bt-floating-main{border:0;display:grid;place-items:center;cursor:pointer;padding:0;margin:0;}
    ${classSelector} .bt-floating-main img{width:24px;height:24px;object-fit:contain;}
    ${classSelector} .bt-floating-main .material-symbols-rounded{font-size:24px;}
    ${classSelector} .bt-floating-action-label{white-space:nowrap;}
    ${classSelector} .bt-floating-actions[data-floating-open="false"] .bt-floating-action{display:none;}
    ${classSelector} .bt-floating-main{animation:${s.animation === 'pulse' ? 'btFloatingPulse 1.8s infinite' : s.animation === 'bounce' ? 'btFloatingBounce 2.2s infinite' : s.animation === 'shake' ? 'btFloatingShake 2.5s infinite' : 'none'};}
    ${classSelector} .bt-floating-action:hover{filter:brightness(.96);transform:translateY(-1px);}
    ${classSelector} .bt-floating-main:focus-visible,${classSelector} .bt-floating-action:focus-visible{outline:3px solid rgba(255,77,109,.28);outline-offset:2px;}
    @keyframes btFloatingPulse{50%{transform:scale(1.08)}}
    @keyframes btFloatingBounce{0%,80%,100%{transform:translateY(0)}88%{transform:translateY(-7px)}}
    @keyframes btFloatingShake{0%,100%{transform:rotate(0)}92%{transform:rotate(0)}94%{transform:rotate(-6deg)}96%{transform:rotate(6deg)}98%{transform:rotate(-4deg)}}
    @media(max-width:700px){
      ${classSelector} .bt-floating-action{min-width:${Math.max(32, Number(s.mobileSize ?? 48))}px;height:${Math.max(32, Number(s.mobileSize ?? 48))}px;padding:0 ${c.showLabels === false ? 0 : 10}px;}
      ${classSelector} .bt-floating-action-label{font-size:11px;}
      ${classSelector} .bt-floating-actions{gap:${Math.max(4, Number(s.mobileGap ?? gap))}px;}
      ${classSelector}.is-mobile-only{display:block!important;}
      ${classSelector}.is-desktop-only{display:none!important;}
      ${classSelector}.bt-floating--horizontal .bt-floating-actions{flex-wrap:wrap;max-width:calc(100vw - 28px);}
    }
    /* Editor preview: fixed becomes absolute inside the selected preview block. Published/exported pages keep fixed. */
    .bt-export-preview ${classSelector}{position:absolute!important;right:auto;left:auto;top:auto;bottom:auto;transform:none;}
    .bt-export-preview ${classSelector}.bt-floating--bottom-right{right:14px!important;bottom:14px!important;}
    .bt-export-preview ${classSelector}.bt-floating--bottom-left{left:14px!important;bottom:14px!important;}
    .bt-export-preview ${classSelector}.bt-floating--center-right{right:14px!important;top:50%!important;transform:translateY(-50%)!important;}
    .bt-export-preview ${classSelector}.bt-floating--center-left{left:14px!important;top:50%!important;transform:translateY(-50%)!important;}
  </style>
  <script>(function(){
    var root=document.currentScript&&document.currentScript.previousElementSibling&&document.currentScript.previousElementSibling.previousElementSibling;
    if(!root||!root.matches('[data-bt-floating]')) return;
    var main=root.querySelector('[data-floating-toggle]');
    var actions=root.querySelector('[data-floating-open]');
    if(main&&actions){main.addEventListener('click',function(){var open=actions.getAttribute('data-floating-open')==='true';actions.setAttribute('data-floating-open',open?'false':'true');});}
    root.querySelectorAll('[data-floating-action]').forEach(function(link){link.addEventListener('click',function(e){var type=link.getAttribute('data-floating-action');if(type==='share'){e.preventDefault();if(navigator.share){navigator.share({url:location.href,title:document.title}).catch(function(){});}else{try{navigator.clipboard.writeText(location.href);}catch(_){} }}else if(type==='backtop'){e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});}});});
  })();</script>`;
}
