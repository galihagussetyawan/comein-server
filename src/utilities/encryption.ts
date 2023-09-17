import { createCipheriv, createDecipheriv, scryptSync } from 'crypto';

export function encryption(value: string): string {
  try {
    const algorithm = 'aes-192-cbc';
    const password = process.env.JWT_SECRET_TOKEN;
    const key = scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const cipher = createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  } catch (error) {}
}

export function decryption(value: string): string {
  try {
    const algorithm = 'aes-192-cbc';
    const password = process.env.JWT_SECRET_TOKEN;
    const key = scryptSync(password, 'salt', 24);
    const iv = Buffer.alloc(16, 0);
    const decipher = createDecipheriv(algorithm, key, iv);

    const encryptText = Buffer.from(value, 'hex');
    let decycrpted = decipher.update(encryptText);
    decycrpted = Buffer.concat([decycrpted, decipher.final()]);
    return decycrpted.toString();
  } catch (error) {}
}
