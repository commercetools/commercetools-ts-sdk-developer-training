interface SDKError {
  name: string;
  code: number;
  statusCode: number;
  message: string;
  body: {
    statusCode: number;
    message: string;
    errors: { code: string; message: string }[];
  };
}
export function isSDKError(error: unknown): error is SDKError {
  return typeof error === 'object' && error !== null && 'name' in error;
}
