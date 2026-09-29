import { EditorBlock } from '../models/editor-block.model';

/** Preserves the existing renderBlock branch for form; only ownership changed. */
export function renderFormBlock(parent: any, block: EditorBlock, common: string): string {
  const c = block.content || {};
  const s = block.style || {};
const fields = Array.isArray(c.fields) ? c.fields : [];
        const fieldHtml = fields.map((field:any) => renderFormField(parent, field)).join('');
        return `<section style="${common}"><form class="bt-form bt-campaign-form" data-bt-campaign-form action="${parent.attr(c.submitUrl || '/campaignForm/accountId')}" method="post" data-success="${parent.attr(c.successMessage || 'Thank You For your Response')}" data-error="${parent.attr(c.errorMessage || 'Something went wrong. Please try again.')}"><h3 style="margin:0 0 6px">${parent.escape(c.title || 'Get in touch')}</h3><p class="bt-muted" style="margin-top:0">${parent.escape(c.subtitle || '')}</p><div class="bt-form-grid">${fieldHtml}</div><button type="submit" style="background:#FF4D6D;color:#FFFFFF;padding:12px 20px;border-radius:10px;font-weight:800">${parent.escape(c.submitLabel || 'Send Enquiry')}</button><p data-form-message style="display:none;margin:12px 0 0;font-weight:700"></p></form></section>`;
}

/** Existing form-field HTML moved with the Form renderer. */
function renderFormField(parent: any, field: Record<string, any>): string {

    const type = String(field['type'] || 'text');
    const name = parent.attr(field['name'] || field['id'] || 'field');
    const label = parent.escape(field['label'] || 'Field');
    const placeholder = parent.attr(field['placeholder'] || '');
    const required = field['required'] ? ' required' : '';
    const width = field['width'] === 'half' ? 'half' : field['width'] === 'third' ? 'third' : 'full';
    const options = String(field['options'] || '').split('\n').map((x:string)=>x.trim()).filter(Boolean);
    let control = '';
    if (type === 'textarea') control = `<textarea name="${name}" rows="4" placeholder="${placeholder}"${required}></textarea>`;
    else if (type === 'select') control = `<select name="${name}"${required}><option value="">Select...</option>${options.map((x:string)=>`<option value="${parent.attr(x)}">${parent.escape(x)}</option>`).join('')}</select>`;
    else if (type === 'radio') control = `<div class="bt-choice-list">${options.map((x:string,i:number)=>`<label><input type="radio" name="${name}" value="${parent.attr(x)}"${required && i===0 ? ' required' : ''}> <span>${parent.escape(x)}</span></label>`).join('')}</div>`;
    else if (type === 'checkbox') control = `<label class="bt-choice"><input type="checkbox" name="${name}" value="yes"${required}> <span>${label}</span></label>`;
    else { const htmlType = type === 'phone' ? 'tel' : type === 'datetime' ? 'datetime-local' : ['email','number','date','time'].includes(type) ? type : 'text'; control = `<input type="${htmlType}" name="${name}" placeholder="${placeholder}"${required}>`; }
    return `<div class="bt-form-field bt-form-field--${width}">${type === 'checkbox' ? '' : `<label>${label}${required ? ' *' : ''}</label>`}${control}</div>`;
  
}
