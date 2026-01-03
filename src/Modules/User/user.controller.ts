import { Router } from "express";
import userService from "./user.service";
import { authentication} from "../../Middlewares/authentication.middleware";
import {TokenTypeEnum } from "../../Utils/security/token";
import {RoleEnum} from "../../DB/models/user.model";
import { cloudFileUpload, fileValidation, StorageEnum } from "../../Utils/multer/cloud.multer";


const router: Router = Router();

router.get(
    "/profile", 
    authentication({  
       tokenType: TokenTypeEnum.ACCESS,
      accessRoles:[RoleEnum.USER],   
    }),
  userService.getProfile
);

router.post(
    "/logout", 
    authentication({  
       tokenType: TokenTypeEnum.ACCESS,
      accessRoles:[RoleEnum.USER],   
    }),
    validation(logoutSchema),
  userService.logout
);


   router.patch(
     "/profile-image",
     authentication({
        tokenType: TokentypeEnum.ACCESS,
        accessRoles: [RoleEnum.USER],
     }),

    cloudFileUpload({
       validation: fileValidation.images,
       storageApproch: StorageEnum.MEMORY,
       maxSizeMB:6,
     }).single("attachments"),
      userService.profileImage
    );


export default router;