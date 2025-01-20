import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { JwtProvider, ACCESS_TOKEN_SECRET_SIGNATURE, REFRESH_TOKEN_SECRET_SIGNATURE } from '~/providers/JwtProvider'
const MOCK_DATABASE = {
  USER: {
    ID: 'Ahihi',
    EMAIL: 'ahihi.@gmail.com',
    PASSWORD: '123'
  }
}

const login = async (req, res) => {
  try {
    if (req.body.email !== MOCK_DATABASE.USER.EMAIL || req.body.password !== MOCK_DATABASE.USER.PASSWORD) {
      res.status(StatusCodes.FORBIDDEN).json({ message: 'Your email or password is incorrect!' })
      return
    }

// create payload information to attach in JWT token: includes id, email of user
const userInfo = {
  id: MOCK_DATABASE.USER.ID,
  email: MOCK_DATABASE.USER.EMAIL
}
//Create two types token: accessToken and refreshToken
const accessToken = await JwtProvider.generateToken(
   userInfo,
   ACCESS_TOKEN_SECRET_SIGNATURE,
   '1h'
)

const refreshToken = await JwtProvider.generateToken(
  userInfo,
  REFRESH_TOKEN_SECRET_SIGNATURE,
  '7 days'
)
//handle http only
res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: ms('7 days')
})

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  maxAge: ms('7 days')
})
// return information user and token for front-end save to localStorage
res.status(StatusCodes.OK).json({
  ...userInfo,
  accessToken,
  refreshToken
})
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error'});
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // cookie
    const refreshTokenFromCookie = req.cookies?.refreshToken
    //localstorage
    const refreshTokenFromBody = req.body?.refreshToken

    const refreshTokenDecoded = await JwtProvider.verifyToken(
      //refreshTokenFromCookie,//cookie
      refreshTokenFromBody,//localstorage
      REFRESH_TOKEN_SECRET_SIGNATURE
  )
//tao accessToken
const userInfo = {
  id: refreshTokenDecoded.id,
  email: refreshTokenDecoded.email
}
  const accessToken = await JwtProvider.generateToken(
    userInfo,
    ACCESS_TOKEN_SECRET_SIGNATURE,
    '1h'
 )
 //res lai access cho truong hop su dung cookie
 res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: ms('7 days')
})

    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: 'error refresh token'})
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
