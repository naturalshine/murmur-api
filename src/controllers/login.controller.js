import jwt from 'jsonwebtoken';

import { 
    jwtUser,
    jwtPw,
    jwtSecret,
    jwtAlgo, 
    jwtExpireTime,
} from '../settings';

export const loginPage = async (req, res) => {

  try{
    const { username, password } = req.body

    if (!username || !password || jwtUser != username || jwtPw !== password) {
      return res.status(401).end()
    }
  
    const token = jwt.sign({ username }, jwtSecret, {
      algorithm: jwtAlgo,
      expiresIn: jwtExpireTime,
    })
  
    res.status(200)
        .json({ 
              message: "Logged in successfully!",
              jwt: token 
            });
  } catch (error){
    res.status(403).json({ message: err.stack });
  }
};