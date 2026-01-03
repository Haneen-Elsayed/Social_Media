import z from "zod";
import {LogoutEnum } from "../../Utils/security/token";


export const LogoutSchema = {
body: z.strictObject({
flag: z.enum(LogoutEnum).default (LogoutEnum.ONLY),
})
}