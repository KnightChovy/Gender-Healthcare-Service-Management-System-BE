import express from "express";
import { adminController } from "~/controllers/adminController";
import isAdmin from "~/middlewares/isAdminMiddleware";
import isAuth from "~/middlewares/isAuthMiddleware";
import { validateCreateStaff } from "~/validations/userValidation";
const Router = express.Router();

//admin route
Router.route("/createStaff").post(
  isAuth,
  isAdmin,
  validateCreateStaff,
  adminController.createStaff
);

// Router.route("/removeStaff").post(isAuth, isAdmin, adminController.removeStaff);

export const adminRoute = Router;
