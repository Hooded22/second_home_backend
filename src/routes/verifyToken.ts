import { NextFunction, Response, Request } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config/appConfig'

function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');
  try {
    const tokenSecret: Secret = config.TOKEN_SECRET
    const verified = jwt.verify(token, tokenSecret);
    if (!verified) {
      res.status(403).send("Inactive token");
    }
    res.locals.user = verified;
    next();
  } catch (error) {

  }
}


export default auth;