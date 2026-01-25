import express from 'express';
import * as authController from '../controllers/authController.js';
import * as contentController from '../controllers/contentController.js';
import * as versionController from '../controllers/versionController.js';
import * as uploadController from '../controllers/uploadController.js';
import { verifyToken } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/limiters.js';
import { upload } from '../services/uploadService.js';

const router = express.Router();

// Auth
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/auth-check', authController.authCheck);

// Content
router.get('/content', contentController.getContent);
router.get('/content/staged', verifyToken, contentController.getStagedContent);
router.post('/content', verifyToken, contentController.updateContent);
router.post('/publish', verifyToken, contentController.publish);
router.post('/discard', verifyToken, contentController.discard);

// Version
router.get('/versions', verifyToken, versionController.getVersions);
router.post('/revert', verifyToken, versionController.revertVersion);

// Upload
router.post('/upload', verifyToken, upload.single('file'), uploadController.uploadFile);
router.delete('/upload/:filename', verifyToken, uploadController.deleteFile);

export default router;
