import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "../type/api";
import { isSessionValid } from "./sessions";

export function getBearerToken(request: Request): string | null {
    const authorization = request.header("Authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    const token = authorization.slice("Bearer ".length).trim();
    return token.length > 0 ? token : null;
}

export function requireAdmin(
    request: Request,
    response: Response<ApiResponse<never>>,
    next: NextFunction
): void {
    const token = getBearerToken(request);

    if (token === null || !isSessionValid(token)) {
        response.status(401).json({
            success: false,
            error: "Authentication is required"
        });
        return;
    }

    next();
}

