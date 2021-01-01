import mongoose, {Schema, Document} from 'mongoose';
import {UserDto} from "../serializers/user.dto";

const userSchema = new Schema(
    {
        userId: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        salt: {type: String, required: true},
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model<UserDto & Document>('user', userSchema);

export {User, userSchema};
