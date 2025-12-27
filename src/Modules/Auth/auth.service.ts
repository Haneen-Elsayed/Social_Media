import { Request, Response } from "express";
import {ILoginDTO,ISignUpDTO} from "./auth.dto";
import {UserModel } from "../../DB/models/user.model";
import {ConflictException,} from "../../utils/response/error.response";
import { DatabaseRepository } from "../../DB/repository/database.respository";


class AuthenticationController {
 private _UserModel = new UserRepository(UserModel);

  constructor() {}

signup = async (req: Request, res:Response): Promise<Response> => {
const {username ,email,password}: ISignUpDTO = req.body;
    
 const checkUser = await this._UserModel.findOne({
      filter: { email },
      select:"email",
});
  if (checkUser) throw new ConflictException("User Already Exists");
     const otp = generateOtp();|
     const user = await this._UserModel.createUser({
       data: [
        {
        username,
        email,
        password: await generateHash(password),
        confirmEmailOTP: await generateHash(otp),
       },
      ],
       options: { validateBeforesave: true },
   });
   await emailEvent.emit("confirmEmail",{
     to:email,
     username,
     otp,
   });
    

    return res.status(201).json({ message: "Hello From Signup" });
};

  login =  async (req: Request, res: Response): Response => {
    const {email, password}: ILoginDTO = req.body;  
  const user = await this._userModel.findOne({
  filter: {email },
  });
if (!user) throw new NotFoundException("User Not Found");

if (!user.confirmedAt) throw new BadRequestException ("Verify Your Account");
if (!(await compareHash(password, user.password) ))

throw new BadRequestException("Invalid Password");

  const refreshToken = await generateToken ({
      payload: {_id: user._id },
      secret: "zxghghghh", 
      options: {
      expiresIn: 3600,
      },
    });

     const accessToken = await generateToken ({
      payload: {_id: user._id },
      secret: "zgnghgosx", 
      options: {
      expiresIn: 3600,
      },
    });

    const credentials = await createloginCredentials(user);


  res.status(200).json({
      message: "User Login",
      credentials,
    });
  };

  confirmEmail = async (req: Request, res: Response): Promise<Response> => {
  const {email, otp }:IConfirmEmailDTO= req.body;

  const user = await this._userModel.findOne({
       filter:{
           email,
           confirmEmailoTp: {Sexists: true },
           confirmedat: { $exists: false },
       },
  });
 if (!user) throw new NotFoundException("User Not Found");

 if(!compareHash(otp,user?.confirmEmailoTP as string)){
throw new BadRequestException("Invalid oTp");
}

 // update user updateOne
await this._userModel.updateOne({
     filter: { email },
     update: { confirmedat: new Date(), $unset: {confirmEmailOTP: true } },
  });|
return res. status(200).json({ message: "User Confirmed Successfully" });

  };
}

export default new AuthenticationController();
