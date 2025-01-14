import { Router } from 'express';
import UserRouter from './userRoute';
import ProductRouter from './productRoute';
import rolerouter from './role';
import authRouter from './authRoute';
import categoryRouter from './categoryRoute';
import wishlistRouter from './wishlistRoute';

const router = Router();
const routers: Router[] = [
  UserRouter,
  ProductRouter,
  authRouter,
  categoryRouter,
  wishlistRouter,
];

router.use('/api', routers);
router.use('/api', rolerouter);

export default router;
