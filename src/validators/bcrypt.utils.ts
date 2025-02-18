import * as bcrypt from "bcrypt";
import { PasswordException } from "../exceptions/password.exception";

export class BCryptUtil {
  private readonly cycles: number = 10;
  private readonly minimalCharacters: number = 8;

  /**
   * Hashes the given password with bcrypt after validating the password.
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to the hashed password.
   * @throws PasswordException if the password does not meet the requirements.
   */
  async hash(password: string): Promise<string> {
    this.validatePassword(password);
    return await bcrypt.hash(password, this.cycles);
  }

  /**
   * Validates the given password against the requirements:
   * at least one uppercase letter, one number, and one special character.
   * @param password - The plain text password to validate.
   * @throws PasswordException if the password does not meet the requirements.
   */
  private validatePassword(password: string): void {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinimalChars = password.length >= this.minimalCharacters;
    const isEmptyOrNull = password.length == 0 || password == "" || password == null

    if (isEmptyOrNull) {
      throw new PasswordException("Password does not be empty or null")
    }

    if (!hasMinimalChars) {
      throw new PasswordException(
        `Password must contain ${this.minimalCharacters} caracters`,
      );
    }

    if (!hasUpperCase) {
      throw new PasswordException(
        "Password must contain at least one uppercase letter.",
      );
    }

    if (!hasNumber) {
      throw new PasswordException("Password must contain at least one number.");
    }

    if (!hasSpecialChar) {
      throw new PasswordException(
        "Password must contain at least one special character.",
      );
    }
  }

  /**
   * Compares a plain text password with a hashed password.
   * @param plainPassword - The plain text password.
   * @param hashedPassword - The hashed password.
   * @returns A promise that resolves to a boolean indicating if the passwords match.
   */
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
