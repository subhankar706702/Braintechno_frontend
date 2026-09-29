import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EditorBlock } from '../../models/editor-block.model';
import { ElementEditorContext } from '../../models/element-editor-context.model';
import {
  createFooterLinkGroup,
  createFooterSocial,
  FOOTER_SOCIAL_PLATFORMS,
  normalizeFooterSocial
} from './footer.repeat';

@Component({
  selector: 'bt-footer-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './footer-editor.component.html',
  styleUrls: ['./footer-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FooterEditorComponent {
  @Input() block!: EditorBlock;
  @Input() context!: ElementEditorContext;

  readonly socialPlatforms = Object.entries(FOOTER_SOCIAL_PLATFORMS).map(([key, value]) => ({ key, ...value }));
  private normalizedBlock?: EditorBlock;

  update(): void {
    this.context.updateSelected();
  }

  get columns(): any[] {
    if (!Array.isArray(this.block.content['columns'])) this.block.content['columns'] = [];
    return this.block.content['columns'];
  }

  get socials(): any[] {
    if (!Array.isArray(this.block.content['socials'])) this.block.content['socials'] = [];
    if (this.normalizedBlock !== this.block) {
      this.block.content['socials'] = this.block.content['socials'].map((item: any) => normalizeFooterSocial(item));
      this.normalizedBlock = this.block;
    }
    return this.block.content['socials'];
  }

  addColumn(): void {
    this.columns.push(createFooterLinkGroup(this.columns.length));
    this.update();
  }

  removeColumn(index: number): void {
    this.columns.splice(index, 1);
    this.update();
  }

  moveColumn(index: number, delta: number): void {
    const next = index + delta;
    if (next < 0 || next >= this.columns.length) return;
    [this.columns[index], this.columns[next]] = [this.columns[next], this.columns[index]];
    this.update();
  }

  addLink(group: any): void {
    if (!Array.isArray(group.links)) group.links = [];
    group.links.push({ label: 'New Link', url: '#', target: '_self' });
    this.update();
  }

  removeLink(group: any, index: number): void {
    if (!Array.isArray(group.links)) return;
    group.links.splice(index, 1);
    this.update();
  }

  moveLink(group: any, index: number, delta: number): void {
    const links = Array.isArray(group.links) ? group.links : [];
    const next = index + delta;
    if (next < 0 || next >= links.length) return;
    [links[index], links[next]] = [links[next], links[index]];
    this.update();
  }

  addSocial(): void {
    this.socials.push(createFooterSocial(this.socials.length));
    this.update();
  }

  removeSocial(index: number): void {
    this.socials.splice(index, 1);
    this.update();
  }

  moveSocial(index: number, delta: number): void {
    const next = index + delta;
    if (next < 0 || next >= this.socials.length) return;
    [this.socials[index], this.socials[next]] = [this.socials[next], this.socials[index]];
    this.update();
  }

  changeSocialPlatform(item: any, platform: string): void {
    const meta = FOOTER_SOCIAL_PLATFORMS[platform] || FOOTER_SOCIAL_PLATFORMS.website;
    item.platform = platform;
    item.name = meta.name;
    item.label = meta.name;
    item.icon = meta.icon;
    // Keep a user-entered custom URL if it is no longer the old platform default.
    const oldDefaults = Object.values(FOOTER_SOCIAL_PLATFORMS).map(x => x.defaultUrl);
    if (!item.url || oldDefaults.includes(item.url)) item.url = meta.defaultUrl;
    this.update();
  }

  socialMeta(item: any): any {
    return FOOTER_SOCIAL_PLATFORMS[String(item?.platform || '').toLowerCase()] || FOOTER_SOCIAL_PLATFORMS.website;
  }

  isImageIcon(item: any): boolean {
    const icon = String(this.socialMeta(item).icon || '');
    return /^https?:\/\//i.test(icon) || /^data:image\//i.test(icon);
  }

  chooseLogo(): void {
    this.context.openMediaPicker(this.block.content, 'logo', 'logoMediaId', 'Choose footer logo');
    this.update();
  }

  removeLogo(): void {
    this.context.clearMedia(this.block.content, 'logo', 'logoMediaId');
    this.update();
  }

  chooseQr(): void {
    this.context.openMediaPicker(this.block.content, 'qrImage', 'qrMediaId', 'Choose footer QR code');
    this.update();
  }

  removeQr(): void {
    this.context.clearMedia(this.block.content, 'qrImage', 'qrMediaId');
    this.update();
  }

  chooseBackgroundImage(): void {
    this.context.openMediaPicker(this.block.style, 'backgroundImage', 'backgroundMediaId', 'Choose footer background image');
    this.block.style['backgroundType'] = 'image';
    this.update();
  }

  removeBackgroundImage(): void {
    this.context.clearMedia(this.block.style, 'backgroundImage', 'backgroundMediaId');
    this.block.style['backgroundType'] = 'color';
    this.update();
  }
}
