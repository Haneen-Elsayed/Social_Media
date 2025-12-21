import * as z from "zod";
import { signUpschema } from "./auth.validation";
export type ISignUpDTO = z.infer<typeof signUpschema.body>;
export type ILoginDTO = z.infer<typeof signUpschema.body>;