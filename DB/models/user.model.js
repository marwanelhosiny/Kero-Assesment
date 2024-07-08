import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    ID_document: {
        secure_url:{type: String,required: true},
        public_id:{type: String,required: true}
    }
}, { timestamps: true ,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



const User = model('user', userSchema)
export default User