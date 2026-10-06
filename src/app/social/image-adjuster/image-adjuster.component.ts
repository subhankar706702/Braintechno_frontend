import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface ImageAdjustSettings {
  cropX: number;
  cropY: number;
  zoom: number;
  aspectRatio: string;
  fit: 'fit' | 'fill';
}

@Component({
  selector: 'app-image-adjuster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-adjuster.component.html',
  styleUrls: ['./image-adjuster.component.scss']
})
export class ImageAdjusterComponent implements OnChanges {
  @Input() imageUrl = '';
  @Input() platformName = 'Social Media';
  @Input() settings: ImageAdjustSettings = this.defaultSettings();

  @Output() settingsChange = new EventEmitter<ImageAdjustSettings>();

  localSettings: ImageAdjustSettings = this.defaultSettings();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings']?.currentValue) {
      this.localSettings = {
        ...this.defaultSettings(),
        ...changes['settings'].currentValue
      };
    }
  }

  updateSetting(): void {
    this.settingsChange.emit({ ...this.localSettings });
  }

  setFitMode(mode: 'fit' | 'fill'): void {
    this.localSettings.fit = mode;
    this.updateSetting();
  }

  reset(): void {
    this.localSettings = this.defaultSettings();
    this.updateSetting();
  }

  onZoomChange(value: number | string): void {
    const zoom = Number(value);
    if (!Number.isFinite(zoom)) return;
    this.localSettings.zoom = Math.min(200, Math.max(100, zoom));
    this.updateSetting();
  }

  onPositionChange(axis: 'cropX' | 'cropY', value: number | string): void {
    const position = Number(value);
    if (!Number.isFinite(position)) return;
    this.localSettings[axis] = Math.min(100, Math.max(0, position));
    this.updateSetting();
  }

  getImageStyle(): Record<string, string> {
    const zoom = this.localSettings.zoom / 100;
    return {
      transform: `translate(-${this.localSettings.cropX}%, -${this.localSettings.cropY}%) scale(${zoom})`,
      'object-fit': this.localSettings.fit
    };
  }

  private defaultSettings(): ImageAdjustSettings {
    return {
      cropX: 50,
      cropY: 50,
      zoom: 100,
      aspectRatio: '1:1',
      fit: 'fit'
    };
  }
}
