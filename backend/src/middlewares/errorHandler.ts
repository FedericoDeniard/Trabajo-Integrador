import { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class ResponseObject<T> {
    constructor(
        public sucess: boolean,
        public data: T,
        public message: string
    ) { }
}

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json(new ResponseObject(false, null, err.message))
}
