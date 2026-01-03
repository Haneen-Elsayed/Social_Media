import { Request, Response, NextFunction } from "express";


export class ApplicationException extends Error {

  constructor(
    message: string,
    public statusCode: number = 400,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
  }
}

export class BadRequestException extends ApplicationException {
constructor (message: string, options?: ErrorOptions) {
super (message, 480, options);
}}

export class NotFoundException extends ApplicationException {
constructor (message: string, options?: ErrorOptions) {
super (message, 404, options);
}}
export class ConflictException extends ApplicationException {
constructor (message: string, options?: ErrorOptions) {
super (message, 409, options);
}}

export class UnAuthorizedException extends ApplicationException{
constructor (message: string, options?: ErrorOptions) {
super (message, 401, options);
}}

export class ForbiddenException extends ApplicationException{
constructor (message: string, options?: ErrorOptions) {
super (message, 401, options);
}}

export interface IError extends Error {
  statusCode: number;
}

export const globalErrorHandler = (
  err: IError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong",
    stack: process.env.NODE_ENV === "DEV" ? err.stack : undefined,
    cause: err.cause,
  });
};
