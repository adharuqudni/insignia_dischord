import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../src/middlewares/auth.middleware';

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    
    // Set API key for testing
    process.env.API_KEY = 'test-api-key';
  });

  it('should return 401 if no authorization header', () => {
    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Authorization header required',
        code: 'UNAUTHORIZED',
      },
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat test-api-key',
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if API key is invalid', () => {
    mockRequest.headers = {
      authorization: 'Bearer wrong-api-key',
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      error: {
        message: 'Invalid API key',
        code: 'INVALID_TOKEN',
      },
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if API key is valid', () => {
    mockRequest.headers = {
      authorization: 'Bearer test-api-key',
    };

    authMiddleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
});

