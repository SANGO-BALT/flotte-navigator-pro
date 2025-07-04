import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers/authController';
import { handleValidationErrors } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Validation rules
const registerValidation = [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('prenom').notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role').isIn(['administrateur', 'gestionnaire', 'conducteur', 'mecanicien']).withMessage('Rôle invalide'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
];

// Routes
router.post('/register', registerValidation, handleValidationErrors, AuthController.register);
router.post('/login', loginValidation, handleValidationErrors, AuthController.login);
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;