// import mongoose, {Schema} from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt"

// const userSchema = new Schema(
//     {
//         username: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true,
//             index: true
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             lowercase: true,
//             trim: true
//         },
//         fullName: {
//             type: String,
//             required: true.valueOf,
//             trim: true,
//             index: true
//         },
//         avatar: {
//             type: String, // cloudinary url,
//             reuired: true,
//         },
//         coverImage: {
//             type: String, // cloudinary url
//         },
//         watchHistory: [
//             {
//                 type: Schema.Types.ObjectId,
//                 ref: "Video"
//             }
//         ],
//         password: {
//             type: String,
//             required: [true, 'Password is required']
//         },
//         refreshToken: {
//             type: String
//         }
//     },
//     {
//         timestamps: true
//     }
// )

// userSchema.pre("save", async function (next) {
//     if(this.isModified("password")) return next();
//     this.password = bcrypt.hash(this.password, 10)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function 
// (password) {
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             username: this.username,
//             fullName: this.fullName
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }
// userSchema.methods.generateRefreshToken = function(){
//     return jwt.sign(
//         {
//             _id: this._id,
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }

// export const User = mongoose.model("User", userSchema)





import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true, // ✅ Fixed: Changed from true.valueOf to true
            trim: true,
            index: true
        },
        avatar: {
            type: String, // cloudinary url,
            required: false, // ✅ Fixed: Changed from reuired to required, made optional for JSON testing
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// ✅ Fixed: Corrected the pre-save middleware
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); // ✅ Fixed: Only hash when password IS modified
    this.password = await bcrypt.hash(this.password, 10) // ✅ Fixed: Added await
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)