import { sign, verify, Secret, SignOptions, JwtPayload } from "jsonwebtoken";
import {RoleEnum}from"../../DB/models/user.model";
import  {v4 as uuid}  from "uuid";
import { HUserDocument } from "../../DB/models/user.model";
import { TokenModel } from "../../DB/models/token.model";

export enum SignatureLevelEnum {
   USER = "USER",
   ADMIN = "ADMIN" ,
}
 export enum TokenTypeEnum{
   USER ="USER",
   ADMIN = "ADMIN",
 }
  export enum LogoutEnum{
   ONLY ="ONLY",
   ALL = "ALL",
 }

export const generateToken = async ({
    payload,
    secret,
    options,
}:{
  payload: object;
  secret: Secret;
  options: SignOptions;
} ): Promise<string> => {
  return await sign(payload, secret, options);
};
export const verifytoken = async ({
    token,
    secret,
}:{
  token: string;
  secret: Secret;
}): Promise<JwtPayload> =>{
    return (await verify(token,secret)) as JwtPayload;
};


// getsignatureLevel(role)
 export const getSignatureLevel = async (role: RoleEnum = RoleEnum.USER) => {
let signatureLevel: SignatureLevelEnum = SignatureLevelEnum.USER;
   switch (role){
case RoleEnum.ADMIN:
     signatureLevel = SignatureLevelEnum.ADMIN;
     break;
case RoleEnum.USER:
signatureLevel = SignatureLevelEnum.USER;
       break;
     default:
      break;
   }
return signatureLevel;
}

// getSignatures
export const getSingature = async (
 signatureLevel: SignatureLevelEnum = SignatureLevelEnum.USER
) :Promise<{ access_token: string; refresh_token: string }> =>{
let signatures:{access_token: string; refresh_token: string }={
  access_token:"",
  refresh_token: "",
};

  switch (signatureLevel){
   case SignatureLevelEnum.ADMIN:
  signatures.access_token = process.env.ACCESS_ADMIN_TOKEN_SECRET as string;
  signatures.refresh_token = process.env
  .REFRESH_ADMIN_TOKEN_SECRET as string;
  case SignatureLevelEnum.USER:
 signatures.access_token= process.env.ACCESS_ADMIN_TOKEN_SECRET as string;
 signatures.refresh_token = process.env
    .REFRESH_ADMIN_TOKEN_SECRET as string;
    default:
      break;
  }
  return signatures;
};

// create credentials
export const createLoginCredentials = async (user: HUserDocument):Promise<{ access_token: string; refersh_Token: string }> =>{
   const signatureLevel = await getSignatureLevel(user.role);
   const signatures = await getSingature(signatureLevel);
   const jwtid = uuid();

   const access_Token = await generateToken({
     payload: {_id: user._id} ,
     secret: signatures.access_token,
    options: {
    expiresIn: Number (process.env.ACCESS_EXPIRES_IN),
      jwtid,
    },
});



  const refersh_Token = await generateToken({
       payload:{_id: user._id },
       secret: signatures.refresh_token,
       options: {
     expiresIn: Number(process.env.REFRESH_EXPIRES_IN),
      jwtid,
       },
    });
return {access_Token, refersh_Token};

}

  // decoded Token
export const decodedToken = async({
  authorization,
  tokenType = TokenTypeEnum.ACCESS,
}:{
   authorization: string;
   tokenType?: TokenTypeEnum;
})=> {
 const userModel = new UserRepository(userModel);
 const tokenModel = new TokenRepository(tokenModel);


 const [bearer, token] = authorization.split(" ");
if (!bearer || !token) throw new UnAuthorizedException("Missing Token Parts");
const signatures = await getSignature(bearer as SignatureLevelEnum);
 
const decoded = await verifyToken({ 
  token,
  secret:
     tokenType === TokenTypeEnum.REFRESH
   ? signatures.refresh_token 
   : signatures.access_token,

});

if (!decoded?._id || !decoded.iat)
 throw new UnAuthorizedException("Invalid Token Payload");

if (await TokenModel.findById({ id:{jti: decoded.jti}}))
  throw new NotFoundException("Invalid or old login credentials");

 const user = await userModel.findOne({ filter: {_id: decoded._id} });
if (!user) throw new NotFoundException("User Not Found");
  
 if (user.changeCredientialsTime?.getTime() || 0 > decoded.iat * 1000)
     throw new UnAuthorizedException("Loggedout From All Devices");
   return {user, decoded };
}


  export const createRevokeToken =async (decoded: JwtPayload) =>{

  const tokenModel = new TokenRepository (TokenModel);
   
   const [results] =
      (await tokenModel.create({
         data:[
       {
         jti: decoded.jti as string,
        expiresIn: decoded.iat as number,
        userId: decoded._id,
       },
      ],
      })) || [];
  
  if (!results) throw new BadRequestException("Fail to revoke token");
      return results;
    };