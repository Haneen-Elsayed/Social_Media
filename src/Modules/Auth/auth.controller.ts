import { Router} from "express";
import authservice from "./auth.service";
import { confirmEmailSchema ,signUpschema } from "./auth.validation";
import { validation } from "../../Middlewares/validation.middleware";
const router: Router = Router();

router.post("/signup",validation(signUpschema),authservice.signup);
router.post("/login",authservice.login);
router.patch(
    "/confirm-email",
    validation (confirmEmailSchema),
    authservice.confirmEmail
);


export default router;