import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

function createKey(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        scrypt(password, salt, KEY_LENGTH, (error, derivedKey) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(derivedKey);
        });
    });
}

export async function hashPassword(password: string): Promise<{
    passwordHash: string;
    passwordSalt: string;
}> {
    const passwordSalt = randomBytes(16).toString("hex");
    const key = await createKey(password, passwordSalt);

    return {
        passwordHash: key.toString("hex"),
        passwordSalt
    };
}

export async function verifyPassword(
    password: string,
    passwordHash: string,
    passwordSalt: string
): Promise<boolean> {
    const storedKey = Buffer.from(passwordHash, "hex");
    const suppliedKey = await createKey(password, passwordSalt);

    return storedKey.length === suppliedKey.length && timingSafeEqual(storedKey, suppliedKey);
}

