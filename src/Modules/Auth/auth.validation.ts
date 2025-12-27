import * as z from "zod";
import { generalfields } from "../../Middlewares/validation.middleware";


export const loginschema ={
body: z.strictObject ({
  email:generalfields.email,
password: generalfields.password,
})
};


export const confirmEmailSchema ={
body: z.strictObject ({
  email:generalfields.email,
  otp: generalfields.otp,
})
};

export const signUpschema = {
body: z.strictObject ({
  username: generalfields.username,
  email: generalfields.email,
  password: generalfields.password,
  confirmPassword : generalfields.confirmPassword
})
.refine((data) => data.password === data.confirmPassword,{
message: "Password Missmatch",
}),
};


