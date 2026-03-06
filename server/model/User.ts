import {Document, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import {IUser, IUserMethods} from "../interfaces/user.interface";

export type UserDocument = IUser & IUserMethods & Document;
const emailValidator = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema<UserDocument>({
    username: {
        type: String,
        required: [true, 'A user must have a username'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        lowercase: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (val: string): boolean {
                return emailValidator.test(val);
            },
            message: 'Please provide a valid email address',
        }
    },
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'A user must provide a password'],
        minlength: [8, 'Minimum length is 8'],
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [function (this: UserDocument) {
            return this.isNew || this.isModified('password');
        }, 'Please confirm the password'],
        minlength: [8, 'Minimum length is 8'],
        select: false,
        validate: {
            validator: function (val: string): boolean {
                const doc = (this as UserDocument);
                if (!(doc.isNew || doc.isModified('password'))) return true;
                return val === doc.password;
            },
            message: "Passwords do not match!",
        },
    },

}, {timestamps: true})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined;
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.toJSON = function (): Omit<UserDocument, 'password'> {
    const {password: _password, ...userObject} = this.toObject();

    return userObject;
}

const User = model<UserDocument>('users', userSchema);

export default User;
