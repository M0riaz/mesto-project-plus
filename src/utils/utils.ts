import { Request } from 'express';

export const STATUS_CODE_BAD_REQUEST = 400;
export const STATUS_CODE_NOT_FOUND = 404;
export const STATUS_CODE_INTERNAL_SERVER_ERROR = 500;
export const STATUS_CODE_UNAUTHORIZED = 401;
export const STATUS_CODE_FORBIDDEN = 403;

export interface CustomRequest extends Request {
  user: {
    _id: string;
  };
}
