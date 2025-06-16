import { Request, Response, NextFunction } from "express";
import { HttpError, ResponseObject } from "./errorHandler";
import jwt from 'jsonwebtoken'
import { KEYS } from "src/constants/keys";
import { generarteAdminJwt } from "src/controllers/admin";

interface RequestWithUser extends Request {
    user: number;
}

interface JwtPayload {
    id: number;
    iat: number;
    exp: number;
}

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.admin;
    if (!token) {
        res.redirect("/api/admin/login")
        return
    }
    try {
        const decoded = jwt.verify(token, KEYS.JWT_SECRET) as JwtPayload;
        (req as RequestWithUser).user = Number(decoded.id);

        const newToken = generarteAdminJwt({ id: decoded.id })
        res.cookie("admin", newToken, { httpOnly: true })

        next();
    } catch (error) {
        res.redirect("/api/admin/login")
        return
    }
}