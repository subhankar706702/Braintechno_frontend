import { EditorBlock } from '../../models/editor-block.model';

function normalizeUrl(parent: any, url: string): string {
  const value = String(url || '#').trim();
  if (/^(https?:\/\/|mailto:|tel:|javascript:|#|\/)/i.test(value)) return parent.attr(value);
  return parent.attr(`https://${value}`);
}

function safeYoutubeEmbed(url: string): string {
  const raw = String(url || '').trim();
  const match = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function fieldHtml(parent: any, field: any): string {
  const label = parent.escape(field?.label || 'Field');
  const name = parent.attr(field?.name || 'field');
  const placeholder = parent.attr(field?.placeholder || '');
  const required = field?.required ? ' required' : '';
  switch (field?.type) {
    case 'textarea':
      return `<label class="bt-popup-field"><span>${label}</span><textarea name="${name}" placeholder="${placeholder}"${required}></textarea></label>`;
    case 'email':
      return `<label class="bt-popup-field"><span>${label}</span><input type="email" name="${name}" placeholder="${placeholder}"${required}></label>`;
    case 'tel':
      return `<label class="bt-popup-field"><span>${label}</span><input type="tel" name="${name}" placeholder="${placeholder}"${required}></label>`;
    case 'select': {
      const options = Array.isArray(field?.options) && field.options.length ? field.options : ['Option 1', 'Option 2'];
      return `<label class="bt-popup-field"><span>${label}</span><select name="${name}"${required}>${options.map((option: string) => `<option value="${parent.attr(option)}">${parent.escape(option)}</option>`).join('')}</select></label>`;
    }
    default:
      return `<label class="bt-popup-field"><span>${label}</span><input type="text" name="${name}" placeholder="${placeholder}"${required}></label>`;
  }
}

export function renderPopupBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
  const variant = String(c.variant || 'offer');
  const editorPreview = parent?.__editorPreviewMode === true;
  const width = Math.max(280, Number(c.width ?? 560));
  const padding = Math.max(12, Number(c.padding ?? 28));
  const radius = Math.max(0, Number(c.radius ?? 20));
  const overlay = String(s.overlay || 'rgba(15,23,42,.62)');
  const accent = parent.css(s.accent, '#FF4D6D');
  const background = parent.css(s.background, '#FFFFFF');
  const color = parent.css(s.color, '#0F172A');
  const muted = parent.css(s.mutedColor, '#64748B');
  const position = ['top', 'center', 'bottom'].includes(c.position) ? c.position : 'center';
  const animation = ['fade', 'scale', 'slide-up', 'slide-down'].includes(c.animation) ? c.animation : 'scale';
  const formFields = Array.isArray(c.fields) ? c.fields : [];
  const video = safeYoutubeEmbed(c.videoUrl);
  const showImage = c.showImage === true && c.image;
  const showVideo = c.showVideo === true && video;
  const showForm = c.showForm === true;
  const showOverlay = c.showOverlay !== false;
  const trigger = c.trigger || 'delay';
  const frequency = c.frequency || 'session';
  const key = `${block.id || 'popup'}-${variant}`.replace(/[^a-z0-9_-]/gi, '-');
  const title = parent.escape(c.title || 'Popup Title');
  const text = parent.escape(c.text || 'Add your popup message here.');
  const ctaLabel = parent.escape(c.ctaLabel || 'Continue');
  const secondaryLabel = parent.escape(c.secondaryLabel || 'Close');
  const ctaUrl = normalizeUrl(parent, c.ctaUrl || '#');
  const secondaryUrl = normalizeUrl(parent, c.secondaryUrl || '#');
  const eventHtml = variant === 'event'
    ? `<div class="bt-popup-event-meta"><span>${parent.escape(c.eventDate || 'Date')}</span><span>${parent.escape(c.eventTime || 'Time')}</span><span>${parent.escape(c.eventLocation || 'Location')}</span></div>`
    : '';
  const couponHtml = variant === 'coupon' && c.couponCode
    ? `<div class="bt-popup-coupon"><small>Your coupon</small><strong>${parent.escape(c.couponCode)}</strong></div>`
    : '';
  const qrHtml = variant === 'qr'
    ? `<div class="bt-popup-qr-wrap">${c.qrImage ? `<img src="${parent.attr(c.qrImage)}" alt="QR code" class="bt-popup-qr">` : `<div class="bt-popup-qr-empty">QR</div>`}<span>${parent.escape(c.qrText || 'Scan this code to continue')}</span></div>`
    : '';
  const formHtml = showForm
    ? `<form class="bt-popup-form" data-popup-form>${c.formHeading ? `<strong class="bt-popup-form-title">${parent.escape(c.formHeading)}</strong>` : ''}${formFields.map((field: any) => fieldHtml(parent, field)).join('')}<button class="bt-popup-submit" type="submit">${parent.escape(c.submitLabel || 'Submit')}</button><div class="bt-popup-success" data-popup-success>${parent.escape(c.successMessage || 'Thanks! We received your request.')}</div></form>`
    : '';
  const mediaHtml = showVideo
    ? `<div class="bt-popup-video"><iframe src="${parent.attr(video)}" title="Popup video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
    : showImage
      ? `<img class="bt-popup-image" src="${parent.attr(c.image)}" alt="${parent.attr(c.title || '')}">`
      : '';
  const specialBadge = variant === 'offer' ? '<span class="bt-popup-badge">LIMITED OFFER</span>' : variant === 'announcement' ? '<span class="bt-popup-badge">ANNOUNCEMENT</span>' : '';
  const demoTrigger = trigger === 'click'
    ? `<button type="button" class="bt-popup-demo-trigger" data-popup-open="${parent.attr(key)}">${parent.escape(c.triggerLabel || 'Open Popup')}</button>`
    : '';

  const css = `<style>
    .bt-popup-host{position:relative;min-height:92px;}
    .bt-popup-preview-card{position:relative;max-width:${width}px;margin:0 auto;padding:${padding}px;border-radius:${radius}px;background:${background};color:${color};border:1px solid ${parent.css(s.borderColor, '#E2E8F0')};box-shadow:${parent.css(s.shadow, '0 26px 80px rgba(15,23,42,.28)')};overflow:hidden;box-sizing:border-box;}
    .bt-popup-preview-card[data-theme="dark"]{background:#0F172A;color:#fff;border-color:#334155;}
    .bt-popup-demo-note{display:inline-flex;align-items:center;padding:5px 9px;border-radius:999px;background:${accent};color:#fff;font-size:10px;font-weight:900;letter-spacing:.04em;text-transform:uppercase;}
    .bt-popup-badge{display:inline-flex;padding:5px 9px;border-radius:999px;background:${accent};color:#fff;font-size:10px;font-weight:900;letter-spacing:.04em;margin-bottom:10px;}
    .bt-popup-head{display:flex;gap:14px;align-items:flex-start;}
    .bt-popup-head h3{margin:0;font-size:26px;line-height:1.18;color:inherit;}
    .bt-popup-body{margin-top:10px;color:${muted};line-height:1.7;}
    .bt-popup-preview-card[data-theme="dark"] .bt-popup-body{color:#CBD5E1;}
    .bt-popup-close{position:absolute;top:12px;right:12px;width:34px;height:34px;border:1px solid ${parent.css(s.borderColor, '#E2E8F0')};border-radius:999px;background:rgba(255,255,255,.82);color:#0F172A;display:grid;place-items:center;cursor:pointer;font-size:19px;line-height:1;}
    .bt-popup-media{margin:16px 0 0;}
    .bt-popup-image{display:block;width:100%;max-height:270px;object-fit:cover;border-radius:${Math.max(8, radius - 4)}px;}
    .bt-popup-video{aspect-ratio:16/9;overflow:hidden;border-radius:${Math.max(8, radius - 4)}px;margin-top:16px;background:#000;}
    .bt-popup-video iframe{width:100%;height:100%;border:0;display:block;}
    .bt-popup-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px;}
    .bt-popup-actions a,.bt-popup-submit,.bt-popup-demo-trigger{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:10px 15px;border-radius:11px;border:0;text-decoration:none;font:inherit;font-weight:800;cursor:pointer;}
    .bt-popup-primary,.bt-popup-submit,.bt-popup-demo-trigger{background:${accent};color:${parent.css(s.buttonText, '#FFFFFF')};}
    .bt-popup-secondary{background:transparent;color:${accent};border:1px solid ${accent}!important;}
    .bt-popup-form{display:grid;gap:10px;margin-top:18px;padding-top:16px;border-top:1px solid ${parent.css(s.borderColor, '#E2E8F0')};}
    .bt-popup-form-title{font-size:14px;}
    .bt-popup-field{display:grid;gap:6px;font-size:12px;font-weight:800;}
    .bt-popup-field input,.bt-popup-field textarea,.bt-popup-field select{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid ${parent.css(s.borderColor, '#E2E8F0')};border-radius:10px;background:transparent;color:inherit;font:inherit;}
    .bt-popup-field textarea{min-height:90px;resize:vertical;}
    .bt-popup-success{display:none;padding:10px 12px;border-radius:10px;background:#DCFCE7;color:#166534;font-size:12px;font-weight:800;}
    .bt-popup-event-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;}
    .bt-popup-event-meta span{padding:6px 9px;border-radius:9px;background:${parent.css(s.iconBackground, '#FFF1F4')};color:${accent};font-size:11px;font-weight:900;}
    .bt-popup-coupon{display:grid;gap:4px;margin-top:14px;padding:14px;border:2px dashed ${accent};border-radius:12px;text-align:center;background:rgba(255,77,109,.05);}
    .bt-popup-coupon small{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;color:${muted};}
    .bt-popup-coupon strong{font-size:28px;letter-spacing:.12em;color:${accent};}
    .bt-popup-qr-wrap{display:grid;justify-items:center;gap:10px;margin-top:16px;text-align:center;color:${muted};font-size:12px;font-weight:700;}
    .bt-popup-qr{width:180px;height:180px;object-fit:cover;border-radius:14px;border:1px solid ${parent.css(s.borderColor, '#E2E8F0')};}
    .bt-popup-qr-empty{width:180px;height:180px;border-radius:14px;border:1px dashed ${parent.css(s.borderColor, '#E2E8F0')};display:grid;place-items:center;font-size:34px;font-weight:900;color:${accent};}
    .bt-popup-demo-trigger{margin-bottom:12px;}
    .bt-popup-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;padding:20px;box-sizing:border-box;background:${showOverlay ? overlay : 'transparent'};align-items:${position === 'top' ? 'flex-start' : position === 'bottom' ? 'flex-end' : 'center'};justify-content:center;}
    .bt-popup-modal{width:min(${width}px,100%);max-height:min(92vh,920px);overflow:auto;position:relative;box-sizing:border-box;background:${background};color:${color};border-radius:${radius}px;box-shadow:${parent.css(s.shadow, '0 26px 80px rgba(15,23,42,.28)')};}
    .bt-popup-modal[data-theme="dark"]{background:#0F172A;color:#fff;}
    .bt-popup-modal-inner{padding:${padding}px;}
    .bt-popup-modal[data-mobile-fullscreen="true"]{max-width:100%;}
    @keyframes btPopupFade{from{opacity:0}to{opacity:1}}
    @keyframes btPopupScale{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    @keyframes btPopupSlideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes btPopupSlideDown{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}
    .bt-popup-overlay.is-open .bt-popup-modal{animation:${animation === 'fade' ? 'btPopupFade' : animation === 'slide-up' ? 'btPopupSlideUp' : animation === 'slide-down' ? 'btPopupSlideDown' : 'btPopupScale'} .24s ease both;}
    @media(max-width:640px){.bt-popup-overlay{padding:10px}.bt-popup-modal[data-mobile-fullscreen="true"]{width:100%;height:100%;max-height:100%;border-radius:0}.bt-popup-head h3{font-size:22px}.bt-popup-actions{flex-direction:column}.bt-popup-actions a,.bt-popup-submit{width:100%}}
  </style>`;

  const modal = (!editorPreview || c.previewOpen !== false)
    ? `<div class="bt-popup-overlay is-open" data-popup-overlay data-popup-key="${parent.attr(key)}" style="display:flex"><div class="bt-popup-modal" data-mobile-fullscreen="${c.mobileFullScreen === true ? 'true' : 'false'}" data-theme="${parent.attr(c.theme || 'light')}"><div class="bt-popup-modal-inner">${c.showClose !== false ? `<button type="button" class="bt-popup-close" data-popup-close aria-label="Close">×</button>` : ''}${specialBadge}<div class="bt-popup-head"><div><h3>${title}</h3></div></div><div class="bt-popup-body">${text}</div>${eventHtml}${mediaHtml ? `<div class="bt-popup-media">${mediaHtml}</div>` : ''}${couponHtml}${qrHtml}${formHtml}<div class="bt-popup-actions">${c.ctaLabel ? `<a class="bt-popup-primary" href="${ctaUrl}">${ctaLabel}</a>` : ''}${c.showSecondary && c.secondaryLabel ? `<a class="bt-popup-secondary" href="${secondaryUrl}">${secondaryLabel}</a>` : ''}</div></div></div></div>`
    : '';
  const previewLauncher = editorPreview && c.previewOpen === false
    ? `<button type="button" class="bt-popup-demo-trigger" data-popup-reopen>Open Popup Preview</button>`
    : '';
  const runtime = `<script>(function(){var root=document.currentScript&&document.currentScript.previousElementSibling;if(!root)return;var host=root.closest('[data-bt-popup]');if(!host)return;var key=host.getAttribute('data-popup-key'),overlay=host.querySelector('[data-popup-overlay]'),trigger=host.getAttribute('data-trigger')||'delay',delay=Number(host.getAttribute('data-delay'))||0,scroll=Number(host.getAttribute('data-scroll'))||60,frequency=host.getAttribute('data-frequency')||'session',autoClose=Number(host.getAttribute('data-autoclose'))||0;function canShow(){if(frequency==='always')return true;if(frequency==='once')return localStorage.getItem('bt-popup-'+key)!=='1';return sessionStorage.getItem('bt-popup-'+key)!=='1';}function markShown(){if(frequency==='once')try{localStorage.setItem('bt-popup-'+key,'1');}catch(e){}else if(frequency==='session')try{sessionStorage.setItem('bt-popup-'+key,'1');}catch(e){}}function open(){if(!overlay||!canShow())return;overlay.style.display='flex';overlay.classList.add('is-open');markShown();if(autoClose>0)setTimeout(close,autoClose*1000);}function close(){if(overlay){overlay.classList.remove('is-open');overlay.style.display='none';}}if(overlay){overlay.addEventListener('click',function(e){if(e.target===overlay)close();});var c=overlay.querySelector('[data-popup-close]');if(c)c.addEventListener('click',close);var f=overlay.querySelector('[data-popup-form]');if(f)f.addEventListener('submit',function(e){e.preventDefault();var s=f.querySelector('[data-popup-success]');if(s){s.style.display='block';}});}document.querySelectorAll('[data-popup-open]').forEach(function(btn){if(btn.getAttribute('data-popup-open')===key)btn.addEventListener('click',open);});if(trigger==='load')setTimeout(open,0);if(trigger==='delay')setTimeout(open,delay);if(trigger==='scroll'){var fired=false;function onScroll(){if(fired)return;var h=document.documentElement.scrollHeight-window.innerHeight,p=(window.scrollY/Math.max(h,1))*100;if(p>=scroll){fired=true;open();window.removeEventListener('scroll',onScroll);}}window.addEventListener('scroll',onScroll,{passive:true});}if(trigger==='exit'){function exit(e){if(e.clientY<=0){open();document.removeEventListener('mouseout',exit);}}document.addEventListener('mouseout',exit);}if(host.getAttribute('data-enabled')==='false')close();})();</script>`;

  return `${css}<section class="bt-popup-host" style="${common};background:transparent;border:0;box-shadow:none;color:${color};" data-bt-popup data-popup-key="${parent.attr(key)}" data-trigger="${parent.attr(trigger)}" data-delay="${Math.max(0, Number(c.delay ?? 1500))}" data-scroll="${Math.min(100, Math.max(0, Number(c.scrollPercent ?? 60)))}" data-frequency="${parent.attr(frequency)}" data-autoclose="${Math.max(0, Number(c.autoCloseSeconds ?? 0))}" data-enabled="${c.enabled === false ? 'false' : 'true'}" data-preview-open="${c.previewOpen !== false ? 'true' : 'false'}">${demoTrigger || previewLauncher}${c.previewOpen !== false ? `<div class="bt-popup-preview-card" data-theme="${parent.attr(c.theme || 'light')}">${c.showClose !== false ? '<span class="bt-popup-demo-note">Popup Preview</span>' : ''}${specialBadge}<div class="bt-popup-head"><div><h3>${title}</h3></div></div><div class="bt-popup-body">${text}</div>${eventHtml}${mediaHtml ? `<div class="bt-popup-media">${mediaHtml}</div>` : ''}${couponHtml}${qrHtml}<div class="bt-popup-actions">${c.ctaLabel ? `<a class="bt-popup-primary" href="${ctaUrl}">${ctaLabel}</a>` : ''}${c.showSecondary && c.secondaryLabel ? `<a class="bt-popup-secondary" href="${secondaryUrl}">${secondaryLabel}</a>` : ''}</div></div>` : ''}${modal}</section>${runtime}`;
}
