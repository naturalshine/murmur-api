import jwt from 'jsonwebtoken';

import { 
  nodeEnv, 
  jwtSecret } from '../settings';

// auth handler
export const authenticateToken = (req, res, next)=> {
    // dev catch
    if (nodeEnv == "development" || nodeEnv == "test"){
      next()
    } else {
      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]

      if (!token) {
        return res.status(401).end()
      }

      jwt.verify(token, jwtSecret, err => {       
        if (err) return res.sendStatus(403)
        next()
      })
    }

}

