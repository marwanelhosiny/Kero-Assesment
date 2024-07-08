import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as ac from "./user.controller.js"
import { validationFunction } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import {  signinSchema, signupSchema } from "./user.schemas.js";
import { multermiddleware } from "../../middlewares/multerMiddleware.js";

const router = Router()

router.post('/',multermiddleware().single('ID') ,validationFunction(signupSchema), expressAsyncHandler(ac.signUp))
router.get('/verify-email', expressAsyncHandler(ac.verifyEmail))
router.post('/login', validationFunction(signinSchema), expressAsyncHandler(ac.signIn))










export default router