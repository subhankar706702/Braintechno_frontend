import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
 selector:'bt-htmlviewer',standalone:true,
 template:`<div class="overlay"><div class="viewer"><header><strong>BRAIN TECHNO Preview</strong><div><button class="mode" [class.active]="mobile" (click)="mobile=true">Mobile</button><button class="mode" [class.active]="!mobile" (click)="mobile=false">Desktop</button><button class="close" (click)="closed.emit()">×</button></div></header><div class="canvas" [class.mobile]="mobile"><iframe title="Template preview" [srcdoc]="safeHtml"></iframe></div></div></div>`,
 styles:[`.overlay{position:fixed;inset:0;background:rgba(16,24,40,.65);z-index:1000;padding:18px;display:grid;place-items:center}.viewer{width:min(1450px,100%);height:calc(100vh - 36px);background:#fff;border-radius:18px;overflow:hidden;display:grid;grid-template-rows:58px 1fr}header{display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid #e5e7eb}header>div{display:flex;gap:7px}.mode,.close{border:1px solid #d0d5dd;background:#fff;border-radius:9px;min-height:34px;padding:0 11px}.mode.active{background:#111827;color:#fff;border-color:#111827}.close{font-size:24px}.canvas{background:#eaecf0;padding:16px;overflow:auto}.canvas iframe{width:100%;height:100%;border:0;background:#fff;border-radius:8px}.canvas.mobile iframe{width:390px;display:block;margin:auto}`]
})
export class HtmlviewerComponent{
 @Output() closed=new EventEmitter<void>(); mobile=true; safeHtml:SafeHtml='';
 constructor(private sanitizer:DomSanitizer){}
 @Input() set html(value:string){this.safeHtml=this.sanitizer.bypassSecurityTrustHtml(value || '<p>No preview available.</p>');}
}
