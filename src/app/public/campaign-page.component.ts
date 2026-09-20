import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { Campaign } from '../core/models';
import { TemplateApiService } from '../core/template-api.service';

@Component({
 standalone:true,
 template:`
 @if(loading){<div class="state"><strong>BRAIN TECHNO</strong><span>Loading campaign…</span></div>}
 @else if(error){<div class="state error"><strong>Campaign unavailable</strong><span>{{error}}</span></div>}
 @else if(campaign){
  <div class="public-page">
   @if(campaign.interactive?.type==='invitation' && !opened){<section class="invitation-cover" (click)="openInvitation()"><div class="ornament">✦</div><p class="eyebrow">BRAIN TECHNO DIGITAL INVITATION</p><h1>{{campaign.interactive.coverTitle || campaign.name}}</h1><p>{{campaign.interactive.coverSubtitle || 'Tap below to open the invitation'}}</p><button>{{campaign.interactive.openButtonLabel || 'View Details'}}</button><div class="ornament bottom">✦</div></section>}
   <div class="campaign-stage" [class.opened]="opened || campaign.interactive?.type!=='invitation'"><iframe title="BRAIN TECHNO campaign" [srcdoc]="safeHtml"></iframe></div>
  </div>
 }
 `,
 styles:[`:host{display:block;min-height:100vh;background:#fff}.state{min-height:100vh;display:grid;place-content:center;gap:9px;text-align:center;padding:24px}.state strong{font-size:24px}.state span{color:#667085}.state.error strong{color:#b42318}.public-page{position:relative;min-height:100vh;overflow:hidden}.campaign-stage{position:absolute;inset:0;opacity:0;transform:scale(1.03) translateY(20px);transition:opacity .75s ease,transform .9s cubic-bezier(.2,.8,.2,1);pointer-events:none}.campaign-stage.opened{opacity:1;transform:none;pointer-events:auto}.campaign-stage iframe{width:100%;height:100vh;border:0;background:#fff}.invitation-cover{position:absolute;inset:0;z-index:3;display:grid;place-content:center;text-align:center;padding:32px;background:radial-gradient(circle at top,#fff9ed,#f8ead1 46%,#e8d4b4);color:#523b24;animation:coverIn .7s ease}.invitation-cover h1{font-family:Georgia,serif;font-size:clamp(42px,8vw,88px);font-weight:500;line-height:1.05;margin:14px auto;max-width:900px}.invitation-cover p{margin:0 auto 18px;max-width:620px;line-height:1.6}.invitation-cover .eyebrow{font:700 11px/1.4 system-ui;letter-spacing:.22em}.invitation-cover button{margin:auto;border:1px solid #7b5b38;background:#5d452d;color:#fff;border-radius:999px;padding:14px 24px;font-weight:800}.ornament{font-size:28px}.bottom{margin-top:26px}@keyframes coverIn{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}`]
})
export class CampaignPageComponent{
 campaign?:Campaign;safeHtml:SafeHtml='';loading=true;error='';opened=false;
 constructor(route:ActivatedRoute,api:TemplateApiService,sanitizer:DomSanitizer){const slug=route.snapshot.paramMap.get('slug')||'';api.getPublicCampaign(slug).pipe(finalize(()=>this.loading=false)).subscribe({next:(c)=>{this.campaign=c;this.safeHtml=sanitizer.bypassSecurityTrustHtml(c.html||'<p>No campaign HTML.</p>');this.opened=c.interactive?.type!=='invitation';},error:(e)=>this.error=e?.error?.message||'Check the campaign URL or backend connection.'});}
 openInvitation(){this.opened=true;}
}
