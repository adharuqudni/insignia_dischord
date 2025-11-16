import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const apiKey = process.env.API_KEY;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authorization header required',
        code: 'UNAUTHORIZED',
      },
    });
  }

  const token = authHeader.substring(7);

  if (token !== apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid API key',
        code: 'INVALID_TOKEN',
      },
    });
  }

  next();
};

