import { EditorBlock } from '../../models/editor-block.model';

/** Preserves the existing createBlock branch for form; only ownership changed. */
export function createFormBlock(parent: any, base: EditorBlock, variant: string): EditorBlock {
return {
          ...base,
          content: {
            variant,
            title: variant === 'newsletter' ? 'Join our newsletter' : variant === 'appointment' ? 'Book an appointment' : variant === 'quote' ? 'Get a free quote' : 'Get in touch',
            subtitle: 'Send your details and we will contact you.',
            fields: [parent.formFieldTemplate('text', 0), parent.formFieldTemplate('email', 1), parent.formFieldTemplate('phone', 2), parent.formFieldTemplate('textarea', 3)],
            submitLabel: variant === 'newsletter' ? 'Subscribe' : variant === 'appointment' ? 'Request Appointment' : 'Send Enquiry',
            submitUrl: '/campaignForm/accountId',
            successMessage: 'Thank You For your Response',
            errorMessage: 'Something went wrong. Please try again.'
          },
          style: { ...base.style, background: variant === 'dark' ? '#0F172A' : variant === 'soft' ? '#F8FAFC' : '#FFFFFF', color: variant === 'dark' ? '#FFFFFF' : '#0F172A', align: variant === 'center' ? 'center' : 'left', radius: 16 }
        };
}
