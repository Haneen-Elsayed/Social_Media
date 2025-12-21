import { Request, Response } from "express";
import {ILoginDTO,ISignUpDTO} from "./auth.dto";

class AuthenticationController {
  private name: string = "Ahmed";

  constructor() {}

signup = (req: Request, res:Response): Response => {
const {username ,email,password,confirmPassword}: ISignUpDTO = req.body;
 console. log({ username, email, password,confirmPassword });

return res.status (201).json({ message: "Hello From Signup" });
};

  login = (req: Request, res: Response): Response => {
    const {email, password}: ILoginDTO = req. body;
  console.log({email, password});
    return res.status(200).json({
      message: "Hello From Login",
    });
  };
}

export default new AuthenticationController();
