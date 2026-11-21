import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/signup', authController.signupPage);
router.post('/signup', asyncHandler(authController.signup));

router.get('/login', authController.loginPage);
router.post('/login', asyncHandler(authController.login));

router.post('/logout', authController.logout);
router.get('/me', authController.me);

export default router;
