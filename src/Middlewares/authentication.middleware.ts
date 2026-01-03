import { NextFunction, Request, Response } from "express";
import { HUserDocument,RoleEnum } from " ../DB/models/user.model";
import { decodedToken, TokenTypeEnum } from "../Utils/security/token"
import {BadRequestException,ForbiddenException} from "../Utils/response/error.response";
import {JwtPayload } from "jsonwebtoken";



export const authentication = (
   tokenType: TokenTypeEnum = TokenTypeEnum.ACCESS,
   accessRoles: RoleEnum[] = []
) => {
return async (req: Request, res: Response, next: NextFunction) =>{
    if (!req.headers.authorization)
       throw new BadRequestException("Missing Authorization Header");

  const { decoded, user } = await decodedToken ({
  authorization: req.headers.authorization,
     tokenType,
});
    if (!accessRoles.includes(user.role))
   throw new ForbiddenException(
"You are not authorized to access this route")
   
     req.user = user;
     req.decoded = decoded;
     return next();

   };
};