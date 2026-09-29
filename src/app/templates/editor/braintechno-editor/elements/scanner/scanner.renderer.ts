import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing renderBlock branch for scanner; only ownership changed. */
export function renderScannerBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const id = `scan-${parent.safeDomId(block.id)}`;
        return `<section style="${common}" id="${id}" data-bt-scanner data-formats="${parent.attr(c.formats || 'qr_code')}"><span class="material-symbols-rounded" style="font-size:52px;color:#FF4D6D">qr_code_scanner</span><h3>${parent.escape(c.title || 'Scan code')}</h3><video data-scan-video playsinline muted style="width:100%;max-width:420px;margin:14px auto;border-radius:12px;background:#0F172A"></video><p data-scan-result style="margin:12px 0 0">Point the camera at a QR or barcode.</p></section>`;
}
