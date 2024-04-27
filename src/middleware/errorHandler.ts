import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);

  res.status(err.status || 404).json({
    error: err,
    message: err.message,
    details: err.errors,
  });
};

export default errorHandler;
