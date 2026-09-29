import { EditorBlock } from '../models/editor-block.model';

export interface NavbarRenderHelpers {
  escape(value: any): string;
  attr(value: any): string;
}

export function renderNavbarBlock(
  block: EditorBlock,
  common: string,
  helpers: NavbarRenderHelpers
): string {
  const c = block.content || {};
  const s = block.style || {};
  const escape = helpers.escape;
  const attr = helpers.attr;
          const variant = String(c.variant || 'logo-menu-button');
          const rawMenuItems = Array.isArray(c.menuItems)
            ? c.menuItems
            : String(c.links || '')
                .split(',')
                .map((x:string)=>({ label: x.trim(), url: '#', icon: '', target: '_self', children: [], childrenJson: '' }))
                .filter((x:any)=>x.label);

          const menuItems = rawMenuItems.map((item:any) => {
            const next = { ...item };
            const childJson = String(next.childrenJson || '').trim();
            if (childJson) {
              try {
                const parsed = JSON.parse(childJson);
                next.children = Array.isArray(parsed) ? parsed : [];
              } catch {
                next.children = [];
              }
            } else if (!Array.isArray(next.children)) {
              next.children = [];
            }
            return next;
          });

          const logo = String(c.logo || '').trim();
          const brandName = String(c.brand || 'BRAIN TECHNO');
          const logoSize = Math.max(24, Math.min(120, Number(c.logoSize) || 42));
          const logoRadius = Math.max(0, Math.min(50, Number(c.logoRadius) || 0));
          const logoShape = String(c.logoShape || 'rounded');
          const logoRadiusCss = logoShape === 'circle' ? '50%' : `${logoRadius}%`;

          const presets: Record<string, any> = {
            'logo-only': {
              bg: '#FFFFFF', color: '#0F172A', border: '0', shadow: 'none', radius: 0, pad: 14,
              menuBg: 'transparent', menuColor: '#0F172A', menuBorder: '0', menuRadius: 0,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 10, menuStyle: 'plain', mobilePanelBg: '#FFFFFF'
            },
            'logo-brand': {
              bg: '#FFFFFF', color: '#111827', border: '0 0 1px 0', shadow: 'none', radius: 0, pad: 16,
              menuBg: 'transparent', menuColor: '#475569', menuBorder: '0', menuRadius: 0,
              ctaBg: '#111827', ctaColor: '#FFFFFF', ctaRadius: 9, menuStyle: 'plain', mobilePanelBg: '#FFFFFF'
            },
            'logo-menu': {
              bg: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0', shadow: 'none', radius: 14, pad: 12,
              menuBg: '#FFFFFF', menuColor: '#334155', menuBorder: '1px solid #E2E8F0', menuRadius: 9,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 9, menuStyle: 'card', mobilePanelBg: '#FFFFFF'
            },
            'logo-menu-button': {
              bg: '#FFFFFF', color: '#0F172A', border: '1px solid #EDF1F5', shadow: '0 10px 28px rgba(15,23,42,.08)', radius: 16, pad: 13,
              menuBg: 'transparent', menuColor: '#334155', menuBorder: '0', menuRadius: 8,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 11, menuStyle: 'plain', mobilePanelBg: '#FFFFFF'
            },
            'center-logo': {
              bg: '#FFFFFF', color: '#0F172A', border: '1px solid #E8EDF3', shadow: 'none', radius: 12, pad: 12,
              menuBg: '#F8FAFC', menuColor: '#334155', menuBorder: '0', menuRadius: 999,
              ctaBg: '#0F172A', ctaColor: '#FFFFFF', ctaRadius: 999, menuStyle: 'pill', mobilePanelBg: '#FFFFFF'
            },
            'split-menu': {
              bg: '#F4F7FB', color: '#14213D', border: '0', shadow: 'none', radius: 0, pad: 15,
              menuBg: '#FFFFFF', menuColor: '#475569', menuBorder: '1px solid #DCE4EE', menuRadius: 12,
              ctaBg: '#4F46E5', ctaColor: '#FFFFFF', ctaRadius: 10, menuStyle: 'outlined', mobilePanelBg: '#FFFFFF'
            },
            'right-logo': {
              bg: '#FFFFFF', color: '#0F172A', border: '0 0 1px 0', shadow: 'none', radius: 0, pad: 16,
              menuBg: 'transparent', menuColor: '#334155', menuBorder: '0', menuRadius: 0,
              ctaBg: '#0F172A', ctaColor: '#FFFFFF', ctaRadius: 9, menuStyle: 'plain', mobilePanelBg: '#FFFFFF'
            },
            'stacked': {
              bg: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0', shadow: 'none', radius: 16, pad: 12,
              menuBg: '#FFFFFF', menuColor: '#475569', menuBorder: '1px solid #E2E8F0', menuRadius: 999,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 999, menuStyle: 'pill', mobilePanelBg: '#FFFFFF'
            },
            'underline': {
              bg: '#FFFFFF', color: '#0F172A', border: '0 0 1px 0', shadow: 'none', radius: 0, pad: 15,
              menuBg: 'transparent', menuColor: '#475569', menuBorder: '0', menuRadius: 0,
              ctaBg: '#FFF1F4', ctaColor: '#D92E4E', ctaRadius: 8, menuStyle: 'underline', mobilePanelBg: '#FFFFFF'
            },
            'dark': {
              bg: '#0F172A', color: '#F8FAFC', border: '0', shadow: '0 12px 32px rgba(2,6,23,.24)', radius: 0, pad: 15,
              menuBg: 'transparent', menuColor: '#E2E8F0', menuBorder: '0', menuRadius: 0,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 10, menuStyle: 'dark', mobilePanelBg: '#111827'
            },
            'transparent': {
              bg: 'transparent', color: '#0F172A', border: '0', shadow: 'none', radius: 0, pad: 10,
              menuBg: 'rgba(255,255,255,.74)', menuColor: '#0F172A', menuBorder: '1px solid rgba(148,163,184,.22)', menuRadius: 999,
              ctaBg: '#0F172A', ctaColor: '#FFFFFF', ctaRadius: 999, menuStyle: 'glass', mobilePanelBg: 'rgba(255,255,255,.98)'
            },
            'pill': {
              bg: '#EEF2FF', color: '#1E1B4B', border: '0', shadow: 'none', radius: 999, pad: 9,
              menuBg: '#FFFFFF', menuColor: '#4338CA', menuBorder: '0', menuRadius: 999,
              ctaBg: '#4F46E5', ctaColor: '#FFFFFF', ctaRadius: 999, menuStyle: 'pill', mobilePanelBg: '#FFFFFF'
            },
            'bordered': {
              bg: '#FFFFFF', color: '#0F172A', border: '1px solid #CBD5E1', shadow: 'none', radius: 10, pad: 10,
              menuBg: '#FFFFFF', menuColor: '#334155', menuBorder: '1px solid #CBD5E1', menuRadius: 8,
              ctaBg: '#FFFFFF', ctaColor: '#0F172A', ctaRadius: 8, menuStyle: 'outlined', mobilePanelBg: '#FFFFFF'
            },
            'shop': {
              bg: '#FFFBF5', color: '#3F2F20', border: '1px solid #F1E2CB', shadow: '0 8px 24px rgba(91,62,31,.08)', radius: 14, pad: 13,
              menuBg: 'transparent', menuColor: '#6B4F34', menuBorder: '0', menuRadius: 8,
              ctaBg: '#8B5E34', ctaColor: '#FFFFFF', ctaRadius: 9, menuStyle: 'plain', mobilePanelBg: '#FFFCF8'
            },
            'mobile-first': {
              bg: '#0B1220', color: '#F8FAFC', border: '1px solid #1E293B', shadow: '0 14px 32px rgba(2,6,23,.24)', radius: 14, pad: 11,
              menuBg: '#162033', menuColor: '#E2E8F0', menuBorder: '1px solid #253149', menuRadius: 10,
              ctaBg: '#FF4D6D', ctaColor: '#FFFFFF', ctaRadius: 10, menuStyle: 'dark-card', mobilePanelBg: '#0F172A'
            }
          };

          const p = presets[variant] || presets['logo-menu-button'];
          const isDark = variant === 'dark' || variant === 'mobile-first';
          const showBrand = c.showBrand !== false;
          const logoHtml = logo
            ? `<img src="${attr(logo)}" alt="${attr(brandName)}" style="width:${logoSize}px;height:${logoSize}px;object-fit:cover;border-radius:${logoRadiusCss};display:block;flex:0 0 auto">`
            : `<span aria-hidden="true" style="width:${logoSize}px;height:${logoSize}px;border-radius:${logoRadiusCss};display:grid;place-items:center;background:linear-gradient(135deg,${isDark ? '#24324A' : '#F1F5F9'},${isDark ? '#334155' : '#E2E8F0'});color:${isDark ? '#CBD5E1' : '#94A3B8'};font-size:${Math.max(10, Math.round(logoSize/4))}px;font-weight:800;letter-spacing:.04em;flex:0 0 auto">LOGO</span>`;
          const brand = `<div class="bt-nav-brand" style="display:flex;align-items:center;gap:10px;min-width:0;flex:0 0 auto">${logoHtml}${showBrand ? `<strong style="font-size:${variant === 'mobile-first' ? 17 : 19}px;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escape(brandName)}</strong>` : ''}</div>`;

          const icon = (x:any) => c.showIcons && x.icon
            ? `<span class="material-symbols-rounded" aria-hidden="true" style="font-size:18px;line-height:1">${escape(x.icon)}</span>`
            : '';

          const submenuHtml = (children:any[]) => {
            if (!Array.isArray(children) || !children.length) return '';
            return `<div class="bt-nav-submenu">${children.map((child:any) => {
              const childChildren = Array.isArray(child.children) ? child.children : [];
              return `<div class="bt-nav-subitem"><a href="${attr(child.url || '#')}" target="${attr(child.target || '_self')}" style="color:inherit;text-decoration:none;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;white-space:nowrap;font-weight:700">${escape(child.label || 'Sub item')}${childChildren.length ? '<span class="material-symbols-rounded" style="font-size:16px">chevron_right</span>' : ''}</a>${childChildren.length ? `<div class="bt-nav-subsubmenu">${childChildren.map((grand:any)=>`<a href="${attr(grand.url || '#')}" target="${attr(grand.target || '_self')}" style="color:inherit;text-decoration:none;display:block;padding:8px 10px;white-space:nowrap">${escape(grand.label || 'Item')}</a>`).join('')}</div>` : ''}</div>`;
            }).join('')}</div>`;
          };

          const linkClass = `bt-nav-link bt-nav-link-${escape(variant)}`;
          const menus = menuItems.map((x:any) => `<div class="bt-nav-menu-item" style="position:relative;min-width:0"><a class="${linkClass}" href="${attr(x.url || '#')}" target="${attr(x.target || '_self')}" style="display:inline-flex;gap:6px;align-items:center;font-weight:700;text-decoration:none;color:inherit;white-space:nowrap">${icon(x)}${escape(x.label || 'Menu')}${Array.isArray(x.children) && x.children.length ? '<span class="material-symbols-rounded bt-nav-caret" aria-hidden="true">keyboard_arrow_down</span>' : ''}</a>${submenuHtml(x.children)}</div>`).join('');

          const showCta = c.showCta !== false && String(c.cta || '').trim();
          const cta = showCta
            ? `<a class="bt-nav-cta" href="${attr(c.ctaUrl || '#')}" style="display:inline-flex;align-items:center;justify-content:center;text-decoration:none;background:${p.ctaBg};color:${p.ctaColor};padding:10px 16px;border-radius:${p.ctaRadius}px;font-weight:800;white-space:nowrap;border:1px solid ${p.ctaBg === '#FFFFFF' ? '#CBD5E1' : p.ctaBg};box-shadow:${variant === 'shop' ? '0 5px 14px rgba(139,94,52,.18)' : 'none'}">${escape(c.cta)}</a>`
            : '';

          const triggerMap: Record<string,string> = { menu: 'menu', dots: 'more_vert', plus: 'add', arrow: 'keyboard_arrow_down' };
          const triggerIcon = triggerMap[String(c.mobileTrigger || 'menu')] || 'menu';
          const mobile = c.mobileMenu !== false && variant !== 'logo-only'
            ? `<details class="bt-nav-mobile"><summary aria-label="${attr(c.mobileLabel || 'Menu')}"><span class="material-symbols-rounded">${triggerIcon}</span></summary><div class="bt-nav-mobile-panel">${menus}${cta}</div></details>`
            : '';

          const menuAlign = c.menuAlign === 'center' ? 'center' : c.menuAlign === 'left' ? 'flex-start' : 'flex-end';
          const menuGap = Math.max(6, Number(c.menuGap) || 18);
          const leftMenus = `<div class="bt-nav-desktop-menu bt-nav-desktop-menu--${escape(variant)}" style="display:flex;align-items:center;justify-content:${menuAlign};gap:${menuGap}px;flex-wrap:wrap;min-width:0">${menus}</div>`;
          const centerMenus = `<div class="bt-nav-desktop-menu bt-nav-desktop-menu--${escape(variant)}" style="display:flex;align-items:center;justify-content:center;gap:${menuGap}px;flex-wrap:wrap;min-width:0">${menus}</div>`;

          const logoPosition = c.logoPosition === 'right' ? 'right' : c.logoPosition === 'center' ? 'center' : 'left';
          const layoutClass = `bt-nav-layout bt-nav-layout-${escape(variant)} bt-nav-layout-logo-${logoPosition}`;
          let body = '';

          if (variant === 'logo-only') {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:center;width:100%">${brand}</div>`;
          } else if (variant === 'logo-brand') {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:16px">${brand}${mobile}</div>`;
          } else if (variant === 'center-logo') {
            body = `<div class="${layoutClass}" style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;width:100%;gap:18px"><div class="bt-nav-side-left">${leftMenus}</div>${brand}<div style="display:flex;justify-content:flex-end">${mobile}</div></div>`;
          } else if (variant === 'right-logo') {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:18px"><div class="bt-nav-left-cluster" style="display:flex;align-items:center;gap:18px;min-width:0">${leftMenus}</div>${brand}${mobile}</div>`;
          } else if (variant === 'stacked') {
            body = `<div class="${layoutClass}"><div class="bt-nav-stacked-top" style="display:flex;align-items:center;justify-content:space-between;width:100%;margin-bottom:10px">${brand}${mobile}</div><div class="bt-nav-stacked-menu" style="display:flex;justify-content:center">${centerMenus}</div></div>`;
          } else if (variant === 'split-menu') {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:18px">${brand}<div class="bt-nav-right-cluster" style="display:flex;align-items:center;gap:12px;min-width:0">${leftMenus}${cta}${mobile}</div></div>`;
          } else if (variant === 'logo-menu' || variant === 'logo-menu-button' || variant === 'shop' || variant === 'dark' || variant === 'transparent' || variant === 'pill' || variant === 'bordered' || variant === 'underline' || variant === 'mobile-first') {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:18px">${brand}<div class="bt-nav-right-cluster" style="display:flex;align-items:center;gap:12px;min-width:0">${leftMenus}${cta}${mobile}</div></div>`;
          } else {
            body = `<div class="${layoutClass}" style="display:flex;align-items:center;justify-content:space-between;width:100%;gap:18px">${brand}<div class="bt-nav-right-cluster" style="display:flex;align-items:center;gap:12px;min-width:0">${centerMenus}${cta}${mobile}</div></div>`;
          }

          const navSelector = `.bt-nav-root.bt-nav-${escape(variant)}`;
          const submenuBg = p.mobilePanelBg;
          const linkExtra = p.menuStyle === 'card'
            ? `background:${p.menuBg};border:1px solid #E2E8F0;border-radius:${p.menuRadius}px;padding:9px 12px;`
            : p.menuStyle === 'pill'
              ? `background:${p.menuBg};border-radius:${p.menuRadius}px;padding:8px 13px;`
              : p.menuStyle === 'outlined'
                ? `border:1px solid ${isDark ? '#334155' : '#CBD5E1'};border-radius:${p.menuRadius}px;padding:8px 12px;background:${p.menuBg};`
                : p.menuStyle === 'underline'
                  ? 'padding:8px 2px;border-bottom:2px solid transparent;'
                  : p.menuStyle === 'dark-card'
                    ? `background:${p.menuBg};border:1px solid #253149;border-radius:${p.menuRadius}px;padding:8px 11px;`
                    : p.menuStyle === 'dark'
                      ? 'padding:8px 2px;'
                      : p.menuStyle === 'glass'
                        ? 'padding:8px 13px;background:rgba(255,255,255,.78);border:1px solid rgba(148,163,184,.22);border-radius:999px;backdrop-filter:blur(10px);'
                        : 'padding:8px 2px;';

          const css = `<style>
            ${navSelector}{position:relative;z-index:60;overflow:visible;isolation:isolate}
            ${navSelector} .bt-nav-layout{min-width:0}
            ${navSelector} .bt-nav-link{${linkExtra}color:${p.menuColor};transition:transform .18s ease,color .18s ease,background .18s ease,border-color .18s ease,box-shadow .18s ease}
            ${navSelector} .bt-nav-link:hover{${variant === 'dark' || variant === 'mobile-first' ? 'color:#FFFFFF;' : 'color:#FF4D6D;'}transform:translateY(-1px)}
            ${navSelector}.bt-nav-pill .bt-nav-link:hover{transform:none;background:#E0E7FF}
            ${navSelector}.bt-nav-underline .bt-nav-menu-item:first-child>.bt-nav-link{border-bottom-color:#FF4D6D;color:#D92E4E}
            ${navSelector} .bt-nav-caret{font-size:16px;line-height:1;opacity:.7}
            ${navSelector} .bt-nav-submenu{display:none;position:absolute;top:calc(100% + 2px);left:0;min-width:190px;padding:7px;background:${submenuBg};color:${p.menuColor};border:1px solid ${isDark ? '#334155' : 'rgba(148,163,184,.28)'};border-radius:${variant === 'pill' ? 16 : 12}px;box-shadow:0 22px 50px rgba(15,23,42,.18);z-index:99999;overflow:visible}
            ${navSelector} .bt-nav-menu-item:hover>.bt-nav-submenu{display:block}
            ${navSelector} .bt-nav-subitem{position:relative}
            ${navSelector} .bt-nav-subitem:hover{background:${isDark ? '#1E293B' : '#F8FAFC'};border-radius:8px}
            ${navSelector} .bt-nav-subsubmenu{display:none;position:absolute;left:calc(100% + 6px);top:-7px;min-width:170px;padding:7px;background:${submenuBg};border:1px solid ${isDark ? '#334155' : 'rgba(148,163,184,.28)'};border-radius:10px;box-shadow:0 18px 40px rgba(15,23,42,.14);z-index:100000}
            ${navSelector} .bt-nav-subitem:hover>.bt-nav-subsubmenu{display:block}
            ${navSelector} .bt-nav-mobile{display:none;position:relative;flex:0 0 auto}
            ${navSelector} .bt-nav-mobile>summary{list-style:none;cursor:pointer;display:grid;place-items:center;width:42px;height:42px;border:1px solid ${isDark ? '#334155' : 'rgba(148,163,184,.35)'};border-radius:${variant === 'pill' ? '50%' : variant === 'bordered' ? '8px' : '12px'};background:${isDark ? '#162033' : '#FFFFFF'};color:${isDark ? '#FFFFFF' : '#0F172A'};box-shadow:${variant === 'shop' ? '0 4px 12px rgba(139,94,52,.10)' : 'none'}}
            ${navSelector} .bt-nav-mobile>summary::-webkit-details-marker{display:none}
            ${navSelector} .bt-nav-mobile>summary:hover{transform:translateY(-1px)}
            ${navSelector} .bt-nav-mobile-panel{position:absolute;top:calc(100% + 8px);right:0;z-index:99999;width:min(340px,calc(100vw - 28px));max-height:calc(100vh - 92px);overflow:auto;display:flex;flex-direction:column;gap:7px;padding:12px;background:${submenuBg};color:${p.menuColor};border:1px solid ${isDark ? '#334155' : 'rgba(148,163,184,.25)'};border-radius:${variant === 'pill' ? 18 : variant === 'shop' ? 16 : 14}px;box-shadow:0 24px 58px rgba(15,23,42,.22)}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-desktop-menu{display:flex !important}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-menu-item{width:100%}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-link{display:flex !important;width:100%;justify-content:space-between;margin:0 !important}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-submenu{display:block;position:static;min-width:0;margin:2px 0 0 10px;border:0;border-left:2px solid ${isDark ? '#334155' : '#E2E8F0'};border-radius:0;box-shadow:none;padding:2px 0 2px 8px;background:transparent}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-subsubmenu{display:block;position:static;min-width:0;margin-left:10px;border:0;border-left:1px dashed ${isDark ? '#334155' : '#CBD5E1'};border-radius:0;box-shadow:none;background:transparent}
            ${navSelector} .bt-nav-mobile-panel .bt-nav-cta{display:flex !important;width:100%;margin-top:4px}
            ${navSelector} .bt-nav-stacked-menu{overflow:visible}
            ${navSelector}.bt-nav-right-logo .bt-nav-layout-logo-right .bt-nav-left-cluster{order:1;}
            ${navSelector}.bt-nav-right-logo .bt-nav-layout-logo-right .bt-nav-brand{order:3;margin-left:auto}
            ${navSelector}.bt-nav-right-logo .bt-nav-layout-logo-right .bt-nav-mobile{order:2}
            @media(max-width:720px){
              ${navSelector}{padding:${Math.max(10, Number(p.pad) - 1)}px !important;border-radius:${Math.min(18, Number(p.radius) || 0)}px !important}
              ${navSelector} .bt-nav-layout{display:flex !important;align-items:center !important;justify-content:space-between !important;gap:12px !important;width:100% !important}
              ${navSelector} .bt-nav-desktop-menu,${navSelector} .bt-nav-cta{display:none !important}
              ${navSelector} .bt-nav-mobile{display:block}
              ${navSelector} .bt-nav-layout .bt-nav-brand{order:1 !important;min-width:0;margin:0 !important}
              ${navSelector} .bt-nav-layout .bt-nav-mobile{order:2;margin-left:auto}
              ${navSelector} .bt-nav-layout .bt-nav-left-cluster{display:none !important}
              ${navSelector} .bt-nav-layout .bt-nav-right-cluster{display:flex !important;margin-left:auto;gap:0 !important}
              ${navSelector} .bt-nav-layout .bt-nav-side-left{display:none !important}
              ${navSelector} .bt-nav-stacked-top{margin-bottom:0 !important;width:100%;display:flex !important;align-items:center;justify-content:space-between}
              ${navSelector} .bt-nav-stacked-menu{display:none !important}
              ${navSelector}.bt-nav-center-logo .bt-nav-layout{display:flex !important}
              ${navSelector}.bt-nav-center-logo .bt-nav-layout .bt-nav-brand{margin:0 !important}
              ${navSelector} .bt-nav-mobile-panel .bt-nav-menu-item{padding:0}
            }
          </style>`;

          return `${css}<nav class="bt-nav-root bt-nav-${escape(variant)}" style="${common}background:${attr(p.bg)};color:${attr(p.color)};border:${attr(p.border)};border-radius:${Number(p.radius)||0}px;box-shadow:${attr(p.shadow)};padding:${Number(p.pad)||0}px;display:flex;align-items:center;min-width:0;position:relative;z-index:60;overflow:visible">${body}</nav>`;
}
