import { StatusCodes } from 'http-status-codes'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'
const isAuthorized = async (req, res, next) => {

const accessTokenFromHeader = req.headers.authorization
console.log('accessTokenFromHeader: ', accessTokenFromHeader)
if(!accessTokenFromHeader) {
    res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized! (Token not found)'})
    return
}

try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
        accessTokenFromHeader.substring('Bearer '.length),
        ACCESS_TOKEN_SECRET_SIGNATURE
    )
    req.jwtDecoded = accessTokenDecoded
    next()
} catch (error) {
console.log('error: ', error)
    console.log('error.message: ', error.message)
    console.log('Full error object: ', error)
    

    if(error.message?.includes('jwt expired')) {
        res.status(StatusCodes.GONE).json({ message: 'Need to refresh token' })
        return
    }
    res.status(StatusCodes.UNAUTHORIZED).json({message: 'Unauthorized! Please login.'})
}
}
export const authMiddleware = { isAuthorized }
