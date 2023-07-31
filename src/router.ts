import {Router} from "express";
import {authMiddleware} from "./middlewares/auth.middleware";
import {authController} from "./controllers/auth.controller";
import {check} from "express-validator";

export const router = Router();

router.post("/signup", [
    check("username", "Username field can not be empty").notEmpty(),
    check("username", "Username must contain not less than 4 characters").isLength({min: 4}),
    check("username", "Username must contain up to 15 characters").isLength({max: 15}),
    check("email", "Email field can not be empty").notEmpty(),
    check("email", "Email field value is not valid email").isEmail(),
    check("password", "Password field can not be empty").notEmpty(),
    check("password", "Password must contain not less than 8 characters").isLength({min: 8}),
    check("password", "Password must contain up to 25 characters").isLength({max: 25})
], authController.signup);
router.post("/signin", authController.signin);
router.get("/user", authMiddleware, authController.getUser)
router.get("/todos", authMiddleware, authController.getTodos);
router.post("/todos", authMiddleware, [
    check("body", "Task text can not be empty").notEmpty(),
    check("body", "Task text must contains less than 75 characters").isLength({max: 75}),
    check("color", "Task color must be type hex color.").isHexColor()
], authController.addTodo);
router.put("/todos/:id", [
    check("body", "Task text can not be empty").notEmpty(),
    check("body", "Task text must contains less than 75 characters").isLength({max: 75}),
    check("color", "Task color must be type hex color.").isHexColor(),
    check("finished", "Task finished value should be type boolean").isBoolean()
], authMiddleware, authController.changeTodo);
router.delete("/todos/:id", authMiddleware, authController.deleteTodo);