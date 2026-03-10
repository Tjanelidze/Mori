export interface IUser {
    username: string;
    email: string;
    photo?: string;
    password: string;
    confirmPassword?: string;
    passwordResetToken?: string;
    passwordResetExpires?: number;

}

export interface IUserMethods {
    correctPassword(candidatePassword: string, userPassword: string): Promise<boolean>;
}
