import User from "../../../DB/models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import axios from "axios"
import sendEmailService from "../services/send-email.service.js"
import cloudinaryConnection from "../../utils/cloudinary.js"

//============================================== register api =======================================//
export const signUp = async (req, res, next) => {
    //destructing enteries from req
    const { fullName, email, phone, password } = req.body

    //checking if email duplicated
    const checkEmail = await User.findOne({ email })
    if (checkEmail) { return next(new Error('duplicated email', { cause: 400 })) }

    //check if phone duplicated
    const checkPhone = await User.findOne({ phone })
    if (checkPhone) { return next(new Error('duplicated phone number', { cause: 400 })) }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 10)

    //checking if the image is provided
    if (!req.file) { return next(new Error('you must provide ID doc', { cause: 400 })) }

    console.log('1')

    // uploading the image to cloudinary
    const { public_id, secure_url } = await cloudinaryConnection().uploader.upload(req.file.path,
        {
            folder: `users/${phone}`,
            resource_type: 'image'
        })
    console.log('2')


    //creating document with all required data
    const addUser = new User({ fullName, email, phone, password: hashedPassword ,ID_document:{secure_url,public_id} })
    await addUser.save()

    //send verification mail
    const usertoken = jwt.sign({ email }, process.env.USERTOKEN_SECRET_KEY, { expiresIn: "1 h" })

    const message = `<h1>hello</h1>
    <a href="${req.protocol}://${req.headers.host}/user/verify-email/?usertoken=${usertoken}">verify your email</a>`
    const confirmMail = sendEmailService({ to: email, message })

    return res.status(201).json({ message: 'user registered successfully' ,addUser })



}

//================================================ verify-email =====================================//

export const verifyEmail = async (req, res, next) => {
    const { usertoken } = req.query

    const decodedData = jwt.verify(usertoken, process.env.USERTOKEN_SECRET_KEY)
    if (!decodedData) { return next(new Error('usertoken expired', { cause: 400 })) }

    const isEmailExist = await User.findOneAndUpdate({ email: decodedData.email, isVerified: false }, { isVerified: true }, { new: true })
    if (!isEmailExist) { return next(new Error('email you trying to verify not found', { cause: 400 })) }

    return res.status(200).json({ message: 'email verified successfully' })
}


//============================================= login api ==========================================//
export const signIn = async (req, res, next) => {
    const { email, password } = req.body

    //checking email accuaracy and changing status too
    const isExist = await User.findOne({ email, isVerified: true })
    if (!isExist) { return next(new Error('invalid credentials', { cause: 400 })) }

    console.log('1')

    //checking password accuaracy
    const checkPass = bcrypt.compareSync(password, isExist.password)
    if (!checkPass) { return next(new Error('invalid credentials', { cause: 400 })) }

    //creating token to send back in the response
    const {  _id } = isExist
    const token = jwt.sign({ email,  _id }, process.env.ACCESSTOKEN_SECRET_KEY, { expiresIn: "1 d" })


    return res.status(200).json({ message: "you signed in successfully", token })
}













