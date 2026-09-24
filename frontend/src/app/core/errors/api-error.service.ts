import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { ApiError } from './api-error.models';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorService {

  normalize(error: HttpErrorResponse): ApiError {
    const status = error.status;

    if (this.isValidationError(error)) {
      return this.normalizeValidationError(error);
    }

    if (status === 401) {
      return {
        status,
        message: 'Authentication is required.',
        fieldErrors: {},
      };
    }

    if (status === 403) {
      return {
        status,
        message: 'You do not have permission to perform this action.',
        fieldErrors: {},
      };
    }

    if (status === 404) {
      return {
        status,
        message: 'The requested resource could not be found.',
        fieldErrors: {},
      };
    }

    if (status === 429) {
      return {
        status,
        message: 'Too many requests. Please try again later.',
        fieldErrors: {},
      };
    }

    if (status >= 500) {
      return {
        status,
        message: 'Something went wrong. Please try again.',
        fieldErrors: {},
      };
    }

    if (status === 0) {
      return {
        status,
        message: 'Unable to connect to the server. Please try again.',
        fieldErrors: {},
      };
    }

    return {
      status,
      message: 'Something went wrong. Please try again.',
      fieldErrors: {},
    };
  }

  private isValidationError(error: HttpErrorResponse): boolean {
    return error.status === 400 && this.isObject(error.error);
  }

  private normalizeValidationError(
    error: HttpErrorResponse,
  ): ApiError {
    const response = error.error as Record<string, unknown>;

    const fieldErrors: Record<string, string[]> = {};
    let message: string | null = null;

    for (const [key, value] of Object.entries(response)) {
      const messages = this.toStringArray(value);

      if (key === 'non_field_errors' || key === 'detail') {
        if (messages.length > 0) {
          message = messages.join(' ');
        }

        continue;
      }

      if (messages.length > 0) {
        fieldErrors[key] = messages;
      }
    }

    return {
      status: error.status,
      message,
      fieldErrors,
    };
  }

  private toStringArray(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string => typeof item === 'string',
      );
    }

    if (typeof value === 'string') {
      return [value];
    }

    return [];
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}