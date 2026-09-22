import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EditorBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  style: Record<string, any>;
}

interface EditorDesign {
  schemaVersion: number;
  counters: Record<string, number>;
  body: {
    rows: EditorBlock[];
    values: Record<string, any>;
  };
}

@Component({
  selector: 'bt-unlayer-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unlayer-editor.component.html',
  styleUrls: ['./unlayer-editor.component.scss']
})
export class UnlayerEditorComponent implements OnChanges, OnDestroy {
  @Input() design: unknown;
  @Output() readonly ready = new EventEmitter<void>();
  @Output() readonly changed = new EventEmitter<void>();

  readonly elements = [
    { type: 'section', label: 'Section', icon: '▦' },
    { type: 'heading', label: 'Heading', icon: 'T' },
    { type: 'text', label: 'Text', icon: '≡' },
    { type: 'image', label: 'Image', icon: '▧' },
    { type: 'button', label: 'Button', icon: '▣' },
    { type: 'product', label: 'Product', icon: '□' },
    { type: 'offer', label: 'Offer', icon: '%' },
    { type: 'gallery', label: 'Gallery', icon: '▦' },
    { type: 'whatsapp', label: 'WhatsApp', icon: '◉' },
    { type: 'contact', label: 'Contact', icon: '☎' },
    { type: 'form', label: 'Contact Form', icon: '☷' },
    { type: 'map', label: 'Map', icon: '⌖' },
    { type: 'divider', label: 'Divider', icon: '—' },
    { type: 'spacer', label: 'Spacer', icon: '↕' }
  ];

  blocks: EditorBlock[] = [];
  selectedId = '';
  device: 'desktop' | 'tablet' | 'mobile' = 'desktop';
  zoom = 100;
  dragIndex = -1;
  draggingType = '';
  initialized = false;
  private designTimer?: ReturnType<typeof setTimeout>;

  get selected(): EditorBlock | undefined {
    return this.blocks.find(block => block.id === this.selectedId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['design'] && changes['design'].currentValue) {
      this.loadDesign(changes['design'].currentValue);
    }
  }

  ngOnDestroy(): void {
    if (this.designTimer) clearTimeout(this.designTimer);
  }

  loadDesign(value: unknown): void {
    const design = this.normalizeDesign(value);
    this.blocks = design.body.rows.map(row => this.clone(row));
    this.selectedId = this.blocks[0]?.id || '';
    this.initialized = true;
    setTimeout(() => this.ready.emit());
  }

  async saveDesign(): Promise<EditorDesign> {
    return this.buildDesign();
  }

  async exportHtml(): Promise<{ html: string; design: EditorDesign }> {
    const design = this.buildDesign();
    return { design, html: this.buildHtml(design) };
  }

  addElement(type: string, index?: number): void {
    const block = this.createBlock(type);
    const insertAt = Number.isInteger(index) ? Math.max(0, Math.min(index!, this.blocks.length)) : this.blocks.length;
    this.blocks.splice(insertAt, 0, block);
    this.selectedId = block.id;
    this.commitChange();
  }

  select(block: EditorBlock): void {
    if (!block) return;
    this.selectedId = block.id;
  }

  duplicate(block: EditorBlock): void {
    const index = this.blocks.findIndex(item => item.id === block.id);
    const copy = this.clone(block);
    copy.id = this.uid(block.type);
    this.blocks.splice(index + 1, 0, copy);
    this.selectedId = copy.id;
    this.commitChange();
  }

  remove(block: EditorBlock): void {
    const index = this.blocks.findIndex(item => item.id === block.id);
    if (index < 0) return;
    this.blocks.splice(index, 1);
    this.selectedId = this.blocks[Math.max(0, index - 1)]?.id || this.blocks[0]?.id || '';
    this.commitChange();
  }

  move(block: EditorBlock, delta: number): void {
    const index = this.blocks.findIndex(item => item.id === block.id);
    const next = index + delta;
    if (index < 0 || next < 0 || next >= this.blocks.length) return;
    [this.blocks[index], this.blocks[next]] = [this.blocks[next], this.blocks[index]];
    this.selectedId = block.id;
    this.commitChange();
  }

  updateSelected(): void {
    this.commitChange();
  }

  updateGalleryImages(block: EditorBlock): void {
    const text = String(block.content['imagesText'] || '');
    block.content['images'] = text.split('\n').map(value => value.trim()).filter(Boolean);
    this.commitChange();
  }

  setDevice(device: 'desktop' | 'tablet' | 'mobile'): void {
    this.device = device;
  }

  zoomOut(): void {
    this.zoom = Math.max(60, this.zoom - 10);
  }

  zoomIn(): void {
    this.zoom = Math.min(120, this.zoom + 10);
  }

  onToolDragStart(event: DragEvent, type: string): void {
    this.draggingType = type;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setData('text/plain', type);
    }
  }

  onToolDragEnd(): void {
    this.draggingType = '';
  }

  onCanvasDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onCanvasDrop(event: DragEvent): void {
    event.preventDefault();
    const type = event.dataTransfer?.getData('text/plain') || this.draggingType;
    if (type) this.addElement(type);
    this.draggingType = '';
  }

  onBlockDragStart(event: DragEvent, index: number): void {
    this.dragIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', `block:${index}`);
    }
  }

  onBlockDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }

  onBlockDragEnd(): void {
    this.dragIndex = -1;
  }

  onBlockDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const source = this.dragIndex;
    if (source < 0 || source === targetIndex) return;
    const [item] = this.blocks.splice(source, 1);
    let destination = targetIndex;
    if (source < targetIndex) destination--;
    this.blocks.splice(Math.max(0, destination), 0, item);
    this.selectedId = item.id;
    this.dragIndex = -1;
    this.commitChange();
  }

  trackById(_: number, item: EditorBlock): string {
    return item.id;
  }

  private createBlock(type: string): EditorBlock {
    const base = { id: this.uid(type), type, content: {}, style: this.defaultStyle() };
    switch (type) {
      case 'section': return { ...base, content: { title: 'New Section', text: 'Add your section content here.' }, style: { ...base.style, background: '#ffffff', padding: 32 } };
      case 'heading': return { ...base, content: { text: 'Your Heading', level: 'h2' }, style: { ...base.style, fontSize: 30, fontWeight: 700, color: '#0f172a', align: 'center' } };
      case 'text': return { ...base, content: { text: 'Write your business message here.' }, style: { ...base.style, fontSize: 16, color: '#475569', align: 'center' } };
      case 'image': return { ...base, content: { url: 'https://placehold.co/1200x600/png?text=Your+Image', alt: 'Business image' }, style: { ...base.style, padding: 12, align: 'center' } };
      case 'button': return { ...base, content: { label: 'Contact Us', url: '#', target: '_self' }, style: { ...base.style, align: 'center', buttonBg: '#FF4D6D', buttonText: '#ffffff', radius: 10, fontSize: 15 } };
      case 'product': return { ...base, content: { name: 'Product Name', price: '₹499', description: 'Short product description', image: 'https://placehold.co/700x500/png?text=Product', cta: 'Buy Now', url: '#' }, style: { ...base.style, background: '#ffffff', align: 'left' } };
      case 'offer': return { ...base, content: { badge: 'LIMITED OFFER', title: 'Special Offer', discount: '20% OFF', description: 'Offer valid for a limited time.', cta: 'Unlock Offer', url: '#' }, style: { ...base.style, background: '#fff7f8', accent: '#FF4D6D', align: 'center', radius: 18 } };
      case 'gallery': return { ...base, content: { images: ['https://placehold.co/500x400/png?text=Image+1', 'https://placehold.co/500x400/png?text=Image+2', 'https://placehold.co/500x400/png?text=Image+3'], imagesText: 'https://placehold.co/500x400/png?text=Image+1\nhttps://placehold.co/500x400/png?text=Image+2\nhttps://placehold.co/500x400/png?text=Image+3' }, style: { ...base.style, columns: 3, gap: 10 } };
      case 'whatsapp': return { ...base, content: { phone: '919999999999', message: 'Hello, I want to know more.' , label: 'Chat on WhatsApp' }, style: { ...base.style, align: 'center', buttonBg: '#25D366', buttonText: '#ffffff', radius: 999, fontSize: 15 } };
      case 'contact': return { ...base, content: { phone: '+91 99999 99999', email: 'hello@example.com', address: 'Your business address', hours: 'Mon - Sat: 10 AM - 8 PM' }, style: { ...base.style, background: '#f8fafc', align: 'left' } };
      case 'form': return { ...base, content: { title: 'Get in touch', subtitle: 'Send us your enquiry and we will contact you.' }, style: { ...base.style, background: '#ffffff', align: 'left' } };
      case 'map': return { ...base, content: { url: 'https://www.google.com/maps?q=Kolkata&output=embed', height: 300 }, style: { ...base.style, padding: 0 } };
      case 'divider': return { ...base, content: {}, style: { ...base.style, padding: 12, borderColor: '#e2e8f0' } };
      case 'spacer': return { ...base, content: {}, style: { ...base.style, height: 48, padding: 0 } };
      default: return { ...base, type: 'text', content: { text: 'New content' } };
    }
  }

  private defaultStyle(): Record<string, any> {
    return { background: '#ffffff', padding: 24, align: 'left', color: '#0f172a', fontSize: 16, fontWeight: 400, radius: 0 };
  }

  private normalizeDesign(value: unknown): EditorDesign {
    if (this.isCustomDesign(value)) {
      return {
        schemaVersion: 100,
        counters: value.counters || {},
        body: {
          values: value.body.values || { backgroundColor: '#f5f7fa', contentWidth: '760px' },
          rows: Array.isArray(value.body.rows) ? value.body.rows.map((r: any) => this.normalizeBlock(r)) : []
        }
      };
    }

    const old = value as any;
    const oldRows = Array.isArray(old?.body?.rows) ? old.body.rows : [];
    const rows: EditorBlock[] = [];
    for (const row of oldRows) {
      const columns = Array.isArray(row?.columns) ? row.columns : [];
      const contents = columns.flatMap((column: any) => Array.isArray(column?.contents) ? column.contents : []);
      for (const content of contents) {
        const type = String(content?.type || 'text').toLowerCase();
        const values = content?.values || {};
        if (type === 'text') rows.push(this.createImported('text', { text: this.stripHtml(String(values.text || 'Text')) }));
        else if (type === 'image') rows.push(this.createImported('image', { url: values.src || values.url || '' , alt: values.altText || '' }));
        else if (type === 'button') rows.push(this.createImported('button', { label: this.stripHtml(String(values.text || 'Button')), url: values.href || '#' }));
        else if (type === 'divider') rows.push(this.createImported('divider', {}));
      }
    }
    if (!rows.length) rows.push(this.createBlock('heading'), this.createBlock('text'));
    return { schemaVersion: 100, counters: {}, body: { values: { backgroundColor: '#f5f7fa', contentWidth: '760px' }, rows } };
  }

  private isCustomDesign(value: any): value is EditorDesign {
    return !!value?.body && Array.isArray(value.body.rows) && (value.schemaVersion === 100 || value.body.rows.some((r: any) => !!r?.type));
  }

  private normalizeBlock(row: any): EditorBlock {
    const type = String(row?.type || 'text');
    const created = this.createBlock(type);
    return {
      id: String(row?.id || this.uid(type)),
      type,
      content: { ...created.content, ...(row?.content || {}) },
      style: { ...created.style, ...(row?.style || {}) }
    };
  }

  private createImported(type: string, content: Record<string, any>): EditorBlock {
    const block = this.createBlock(type);
    return { ...block, content: { ...block.content, ...content } };
  }

  private buildDesign(): EditorDesign {
    return {
      schemaVersion: 100,
      counters: {},
      body: {
        rows: this.blocks.map(block => this.clone(block)),
        values: { backgroundColor: '#f5f7fa', contentWidth: '760px' }
      }
    };
  }

  private buildHtml(design: EditorDesign): string {
    const pageBg = design.body.values.backgroundColor || '#f5f7fa';
    const width = design.body.values.contentWidth || '760px';
    const sections = design.body.rows.map(block => this.renderBlock(block)).join('');
    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BRAIN TECHNO</title><style>html,body{margin:0;padding:0;background:${pageBg};font-family:Inter,Arial,sans-serif;color:#0f172a}*{box-sizing:border-box}.bt-page{width:100%;padding:24px 12px}.bt-container{max-width:${width};margin:0 auto}.bt-img{max-width:100%;display:block;margin:auto}.bt-btn{display:inline-block;text-decoration:none}.bt-grid{display:grid}.bt-form input,.bt-form textarea{width:100%;padding:12px;border:1px solid #dbe2ea;border-radius:10px;margin:5px 0 10px;font:inherit}.bt-card{border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}.bt-muted{color:#64748b}</style></head><body><main class="bt-page"><div class="bt-container">${sections}</div></main></body></html>`;
  }

  private renderBlock(block: EditorBlock): string {
    const c = block.content || {};
    const s = block.style || {};
    const common = `background:${this.css(s.background, '#fff')};padding:${this.cssPx(s.padding, 24)};text-align:${this.css(s.align, 'left')};border-radius:${this.cssPx(s.radius, 0)};color:${this.css(s.color, '#0f172a')};`;
    switch (block.type) {
      case 'section': return `<section style="${common}"><h2 style="margin:0 0 10px;font-size:28px">${this.escape(c.title)}</h2><p style="margin:0;line-height:1.7">${this.nl2br(this.escape(c.text))}</p></section>`;
      case 'heading': return `<section style="${common}"><${c.level || 'h2'} style="margin:0;font-size:${this.cssPx(s.fontSize, 30)};font-weight:${s.fontWeight || 700};color:${this.css(s.color, '#0f172a')}">${this.escape(c.text)}</${c.level || 'h2'}></section>`;
      case 'text': return `<section style="${common}"><p style="margin:0;font-size:${this.cssPx(s.fontSize, 16)};font-weight:${s.fontWeight || 400};line-height:1.75;color:${this.css(s.color, '#475569')}">${this.nl2br(this.escape(c.text))}</p></section>`;
      case 'image': return `<section style="${common}"><img class="bt-img" src="${this.attr(c.url)}" alt="${this.attr(c.alt || '')}" style="max-width:100%;height:auto;border-radius:${this.cssPx(s.radius, 10)}"></section>`;
      case 'button': return `<section style="${common}"><a class="bt-btn" href="${this.attr(c.url || '#')}" target="${this.attr(c.target || '_self')}" style="background:${this.css(s.buttonBg, '#FF4D6D')};color:${this.css(s.buttonText, '#fff')};padding:13px 22px;border-radius:${this.cssPx(s.radius, 10)};font-weight:700;font-size:${this.cssPx(s.fontSize, 15)}">${this.escape(c.label)}</a></section>`;
      case 'product': return `<section style="${common}"><div class="bt-card"><img class="bt-img" src="${this.attr(c.image)}" alt="${this.attr(c.name)}" style="width:100%;max-height:420px;object-fit:cover"><div style="padding:18px"><h3 style="margin:0 0 6px;font-size:22px">${this.escape(c.name)}</h3><strong style="display:block;font-size:20px;margin-bottom:8px">${this.escape(c.price)}</strong><p class="bt-muted" style="line-height:1.6">${this.nl2br(this.escape(c.description))}</p><a class="bt-btn" href="${this.attr(c.url || '#')}" style="background:${this.css(s.buttonBg, '#FF4D6D')};color:#fff;padding:11px 18px;border-radius:10px;font-weight:700">${this.escape(c.cta || 'Buy Now')}</a></div></div></section>`;
      case 'offer': return `<section style="${common}"><div style="border:1px solid #ffd1d9;border-radius:${this.cssPx(s.radius, 18)};padding:24px;background:${this.css(s.background, '#fff7f8')}"><small style="font-weight:800;color:${this.css(s.accent, '#FF4D6D')}">${this.escape(c.badge)}</small><h2 style="margin:8px 0;font-size:30px">${this.escape(c.title)}</h2><div style="font-size:36px;font-weight:900;color:${this.css(s.accent, '#FF4D6D')}">${this.escape(c.discount)}</div><p style="color:#475569">${this.escape(c.description)}</p><a class="bt-btn" href="${this.attr(c.url || '#')}" style="background:${this.css(s.accent, '#FF4D6D')};color:#fff;padding:12px 20px;border-radius:10px;font-weight:800">${this.escape(c.cta || 'Unlock Offer')}</a></div></section>`;
      case 'gallery': { const images = Array.isArray(c.images) ? c.images : []; return `<section style="${common}"><div class="bt-grid" style="grid-template-columns:repeat(${Math.max(1, Math.min(4, Number(s.columns) || 3))},1fr);gap:${this.cssPx(s.gap, 10)}">${images.map((url: string) => `<img src="${this.attr(url)}" alt="Gallery image" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px">`).join('')}</div></section>`; }
      case 'whatsapp': { const phone = String(c.phone || '').replace(/\D/g, ''); const href = `https://wa.me/${phone}?text=${encodeURIComponent(c.message || '')}`; return `<section style="${common}"><a class="bt-btn" href="${this.attr(href)}" target="_blank" style="background:${this.css(s.buttonBg, '#25D366')};color:${this.css(s.buttonText, '#fff')};padding:13px 22px;border-radius:${this.cssPx(s.radius, 999)};font-weight:800">${this.escape(c.label || 'Chat on WhatsApp')}</a></section>`; }
      case 'contact': return `<section style="${common}"><div><h3 style="margin:0 0 12px">Contact</h3><p style="margin:6px 0">☎ ${this.escape(c.phone)}</p><p style="margin:6px 0">✉ ${this.escape(c.email)}</p><p style="margin:6px 0">⌖ ${this.escape(c.address)}</p><p style="margin:6px 0">◷ ${this.escape(c.hours)}</p></div></section>`;
      case 'form': return `<section style="${common}"><form class="bt-form" action="#" method="post"><h3 style="margin:0 0 6px">${this.escape(c.title || 'Get in touch')}</h3><p class="bt-muted" style="margin-top:0">${this.escape(c.subtitle || '')}</p><label>Name</label><input name="name" placeholder="Your name"><label>Mobile / WhatsApp</label><input name="phone" placeholder="Your mobile number"><label>Message</label><textarea name="message" rows="4" placeholder="Your message"></textarea><button type="button" style="border:0;background:#FF4D6D;color:#fff;padding:12px 20px;border-radius:10px;font-weight:800">Send Enquiry</button></form></section>`;
      case 'map': return `<section style="${common}"><iframe title="Business location" src="${this.attr(c.url)}" style="width:100%;height:${this.cssPx(c.height, 300)};border:0;border-radius:10px" loading="lazy"></iframe></section>`;
      case 'divider': return `<section style="${common}"><hr style="border:0;border-top:1px solid ${this.css(s.borderColor, '#e2e8f0')};margin:0"></section>`;
      case 'spacer': return `<div style="height:${this.cssPx(s.height, 48)}"></div>`;
      default: return '';
    }
  }

  private commitChange(): void {
    if (this.designTimer) clearTimeout(this.designTimer);
    this.designTimer = setTimeout(() => this.changed.emit(), 0);
  }

  private uid(type: string): string {
    return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
  }

  private stripHtml(value: string): string {
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || div.innerText || '';
  }

  private css(value: any, fallback: string): string {
    return String(value ?? fallback);
  }

  private cssPx(value: any, fallback: number): string {
    const n = Number(value);
    return Number.isFinite(n) ? `${n}px` : `${fallback}px`;
  }

  private escape(value: any): string {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  private attr(value: any): string {
    return this.escape(value);
  }

  private nl2br(value: string): string {
    return value.replace(/\r?\n/g, '<br>');
  }
}
