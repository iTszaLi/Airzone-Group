import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enquiriesRouter from "./enquiries";
import trackingRouter from "./tracking";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import portalRouter from "./portal";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enquiriesRouter);
router.use(trackingRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(portalRouter);

export default router;
