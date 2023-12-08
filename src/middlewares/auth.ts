import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { STATUS_CODE_UNAUTHORIZED } from '../utils/utils';

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}

const handleAuthError = (res: Response, message: string) => {
  res
    .status(STATUS_CODE_UNAUTHORIZED)
    .send({ message });
};

const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res, 'авторизуйся');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    return handleAuthError(res, ' проблема с токеном');
  }

  req.user = payload;

  next(); // пропускаем запрос дальше
};
