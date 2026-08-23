import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "fraise-secret-key-change-in-production";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    name: string;
    email: string;
    password: string;
};

export type AuthUser = {
    id: string;
    email: string;
    name: string;
    role: "USER" | "SUPER_ADMIN";
    planId?: string | null;
    avatarId?: string | null;
};

export async function loginUser(payload: LoginPayload): Promise<{ token: string; user: AuthUser }> {
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) throw new Error("Invalid email or password");

    if (!user.isVerified) throw new Error("Please activate your account first");

    const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid email or password");

    const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        planId: user.planId ?? null,
        avatarId: user.avatarId,
    };

    const token = jwt.sign(authUser, JWT_SECRET, { expiresIn: "7d" });
    return { token, user: authUser };
}

export async function registerUser(payload: RegisterPayload): Promise<{ user: AuthUser; activationToken: string }> {
    const existing = await prisma.user.findUnique({ where: { email: payload.email } });
    if (existing) throw new Error("Email already registered");

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const activationToken = crypto.randomBytes(32).toString("hex");
    const activationTokenHash = crypto.createHash("sha256").update(activationToken).digest("hex");

    const user = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            passwordHash,
            role: "USER",
            isVerified: false,
            activationTokenHash,
        },
    });

    const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    return { user: authUser, activationToken };
}

export async function requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return { resetToken: "" };

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
        where: { id: user.id },
        data: { resetTokenHash, resetTokenExpiry },
    });

    return { resetToken };
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
    const resetTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            resetTokenHash,
            resetTokenExpiry: { gt: new Date() },
        },
    });

    if (!user) throw new Error("Reset token is invalid or has expired");

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash, resetTokenHash: null, resetTokenExpiry: null },
    });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) throw new Error("Current password is incorrect");

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
    });
}

export function verifyToken(token: string): AuthUser | null {
    try {
        return jwt.verify(token, JWT_SECRET) as AuthUser;
    } catch {
        return null;
    }
}
