import { HttpErrorType } from '@commercetools/ts-client';

export function isSDKError(error: unknown): error is HttpErrorType {
  return typeof error === 'object' && error !== null && 'name' in error;
}
