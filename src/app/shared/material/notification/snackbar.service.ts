import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  SnackbarComponent,
  SnackbarType
} from './snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
    private snackBar: MatSnackBar
  ) {}

  success(message: string): void {
    this.open(
      message,
      'success'
    );
  }

  warning(message: string): void {
    this.open(
      message,
      'warning'
    );
  }

  error(message: string): void {
    this.open(
      message,
      'error'
    );
  }

  info(message: string): void {
    this.open(
      message,
      'info'
    );
  }

  fromApiError(
    error: any,
    fallback = 'Something went wrong.'
  ): void {

    const message =
      this.resolveApiMessage(
        error,
        fallback
      );

    const type =
      this.resolveApiType(error);

    this.open(
      message,
      type
    );
  }


  resolveApiMessage(
    error: any,
    fallback: string
  ): string {

    const body = error?.error;

    if (
      typeof body === 'string' &&
      body.trim()
    ) {
      return body.trim();
    }

    if (
      Array.isArray(body?.errors) &&
      body.errors.length
    ) {

      const message = body.errors
        .map(
          (item: any) =>
            item?.message ||
            item
        )
        .filter(Boolean)
        .join(', ');

      if (message) {
        return message;
      }
    }

    return String(
      body?.message ||
      body?.error ||
      error?.message ||
      fallback
    ).trim();
  }


  private resolveApiType(
    error: any
  ): SnackbarType {

    const backendType = String(
      error?.error?.type ||
      error?.error?.severity ||
      error?.error?.level ||
      ''
    )
      .trim()
      .toLowerCase();

    if (
      backendType === 'warning' ||
      backendType === 'warn'
    ) {
      return 'warning';
    }

    if (backendType === 'info') {
      return 'info';
    }

    if (backendType === 'success') {
      return 'success';
    }

    if (
      backendType === 'error' ||
      backendType === 'danger'
    ) {
      return 'error';
    }


    const status =
      Number(
        error?.status || 0
      );


    if (
      status === 400 ||
      status === 409 ||
      status === 422
    ) {
      return 'warning';
    }


    return 'error';
  }


  private open(
    message: string,
    type: SnackbarType
  ): void {

    const text =
      String(message || '')
        .trim();

    if (!text) {
      return;
    }


    this.snackBar.openFromComponent(
      SnackbarComponent,
      {
        data: {
          message: text,
          type
        },

        duration:
          type === 'error'
            ? 6000
            : 4000,

        horizontalPosition: 'right',

        verticalPosition: 'top',

        panelClass: [
          'bt-custom-snackbar'
        ]
      }
    );
  }
}