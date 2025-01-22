import JWT from 'jsonwebtoken';

//Function create new a token - need three parameters
// userInfo: Infomation you want to attach to the token
//secretSignature: secret signature as a string
//tokenLife: time life of token
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    //
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};
const verifyToken = async (token, secretSignature) => {
  try {
    //
    return JWT.verify(token, secretSignature)
  } catch (error) {
  console.error('Error verify token:', error);
    throw error;
  }
}
export const ACCESS_TOKEN_SECRET_SIGNATURE = 'Ts2ECobefZBwATM5jNGQvjWA3kvznNOq'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'zWwmRNYsrskORm2lrTUKZHWKWxS9nq10'
export const JwtProvider = {
  generateToken,
  verifyToken
}
