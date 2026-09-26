import {
  Injectable,
} from '@angular/core';

import {
  HttpClient,
} from '@angular/common/http';

import {
  Observable,
} from 'rxjs';

import {
  environment,
} from '../../environments/environment';

export interface UploadImageResponse {
  message: string;
  key: string;
  fileUrl: string;
  mimeType: string;
  size: number;
}

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  private readonly uploadUrl =
    `${environment.apiBaseUrl}/upload`;

  constructor(
    private readonly http:
      HttpClient,
  ) {}

  uploadImage(
    file: File,
  ): Observable<UploadImageResponse> {

    const formData =
      new FormData();

    formData.append(
      'image',
      file,
      file.name,
    );

    return this.http.post<UploadImageResponse>(
      this.uploadUrl,
      formData,
    );
  }
}
