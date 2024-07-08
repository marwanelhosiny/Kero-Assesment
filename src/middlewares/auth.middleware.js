//==================================================authentication middlleware========================================//
export const auth = () => {
    return async (req, res, next) => {
        try {
            const { accesstoken } = req.headers
            if (!accesstoken) { return next(new Error('missing access token', { cause: 400 })) }

            const token = accesstoken
            const verifiedToken = jwt.verify(token, process.env.ACCESSTOKEN_SECRETKEY)
            if (!verifiedToken || !verifiedToken._id) { return next(new Error('invalid token payload', { cause: 400 })) }

            //checking if user is deleted or role updated while using an old valid token
            const stillExist = await User.findById({ _id: verifiedToken._id })
            if (!stillExist) { return next(new Error('please signUp first', { cause: 400 })) }

            req.authUser = stillExist
            next()
        } catch (error) { next(new Error(`authentication error :${error.message}`, { casue: 400 })) }
    }
}