export interface AuthUser { id:string; accountId:string|number; name:string; email:string; businessId?:string; role:'owner'|'admin'; }
export interface AuthResponse { token:string; user:AuthUser; }
export interface TemplateDraft { id:string; _id?:string; accountId?:string|number; name:string; description:string; design:unknown; html:string; previewImage?:string; previewImageName?:string; updatedAt:string; createdAt:string; status:'draft'|'published'|'locked'; businessId?:string; }
export interface Campaign { id?:string; _id?:string; name:string; slug:string; templateId?:string; html:string; design?:unknown; status:'draft'|'published'; createdAt?:string; updatedAt?:string; interactive?:{type?:'standard'|'invitation';coverTitle?:string;coverSubtitle?:string;openButtonLabel?:string;}; }
export interface AdminSummary { businesses:number; users:number; templates:number; pages:number; campaigns:number; interactions:number; }
