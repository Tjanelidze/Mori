import {Document, model, Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import {IUser, IUserMethods} from "../interfaces/user.interface";

type UserDocument = IUser & IUserMethods & Document;

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
    },
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'A user must provide a password'],
        minlength: [8, 'Minimum length is 8'],
        trim: true,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm the password'],
        minlength: [8, 'Minimum length is 8'],
        trim: true,
        select: false,
        validate: {
            validator: function (val: string): boolean {
                return val === (this as UserDocument).password;
            },
            message: "Passwords doesn't match!",
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

const User = model<UserDocument>('users', userSchema);

export default User;
