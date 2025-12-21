import { Router} from "express";
import authservice from "./auth.service";
import { signUpschema } from "./auth.validation";
import { validation } from "../../Middlewares/validation.middleware";
const router: Router = Router();
router.get("/signup",validation(signUpschema),authservice.signup);
router.get("/login",authservice.login);
export default router;