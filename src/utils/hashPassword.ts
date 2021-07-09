import bcrypt from 'bcrypt';

export const hashPassword = async (pass: string): Promise<string | null> => {
    try {
        const hashedPassword = await bcrypt.hash(pass, 12);
        return hashedPassword;
    } catch (error) {
        return null;
    }
}