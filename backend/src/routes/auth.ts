import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('nom')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le nom doit contenir au moins 2 caractères'),
  body('prenom')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('telephone')
    .isMobilePhone('any')
    .withMessage('Numéro de téléphone invalide'),
  body('numeroEmploye')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Le numéro d\'employé doit contenir au moins 3 caractères')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Fonction pour générer un token JWT
const generateToken = (userId: string, email: string) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Fonction pour envoyer la réponse avec token
const sendTokenResponse = (user: any, statusCode: number, res: express.Response) => {
  const token = generateToken(user.id, user.email);

  const { password, ...userWithoutPassword } = user;

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      user: userWithoutPassword
    }
  });
};

// @desc    Inscription d'un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
export const register = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`Erreurs de validation: ${errors.array().map((e: any) => e.msg).join(', ')}`, 400));
  }

  const {
    email,
    password,
    nom,
    prenom,
    telephone,
    poste,
    departement,
    role = 'UTILISATEUR',
    dateEmbauche,
    permis = [],
    adresse,
    dateNaissance,
    numeroEmploye
  } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { numeroEmploye }
      ]
    }
  });

  if (existingUser) {
    return next(new AppError('Un utilisateur avec cet email ou numéro d\'employé existe déjà', 409));
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 12);

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      nom,
      prenom,
      telephone,
      poste,
      departement,
      role,
      dateEmbauche: new Date(dateEmbauche),
      permis,
      adresse,
      dateNaissance: new Date(dateNaissance),
      numeroEmploye
    }
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
export const login = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`Erreurs de validation: ${errors.array().map((e: any) => e.msg).join(', ')}`, 400));
  }

  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }

  // Vérifier le mot de passe
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Email ou mot de passe incorrect', 401));
  }

  // Vérifier si l'utilisateur est actif
  if (user.statut !== 'ACTIF') {
    return next(new AppError('Votre compte a été désactivé', 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
export const getMe = catchAsync(async (req: any, res: express.Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      poste: true,
      departement: true,
      role: true,
      statut: true,
      dateEmbauche: true,
      permis: true,
      adresse: true,
      dateNaissance: true,
      numeroEmploye: true,
      photo: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = catchAsync(async (req: any, res: express.Response) => {
  const fieldsToUpdate = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    telephone: req.body.telephone,
    adresse: req.body.adresse,
    photo: req.body.photo
  };

  // Supprimer les champs undefined
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key as keyof typeof fieldsToUpdate] === undefined) {
      delete fieldsToUpdate[key as keyof typeof fieldsToUpdate];
    }
  });

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: fieldsToUpdate,
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      poste: true,
      departement: true,
      role: true,
      statut: true,
      dateEmbauche: true,
      permis: true,
      adresse: true,
      dateNaissance: true,
      numeroEmploye: true,
      photo: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = catchAsync(async (req: any, res: express.Response, next: express.NextFunction) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Mot de passe actuel et nouveau mot de passe requis', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('Le nouveau mot de passe doit contenir au moins 6 caractères', 400));
  }

  // Obtenir l'utilisateur avec le mot de passe
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  // Vérifier le mot de passe actuel
  const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user!.password);

  if (!isCurrentPasswordCorrect) {
    return next(new AppError('Mot de passe actuel incorrect', 400));
  }

  // Hasher le nouveau mot de passe
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  // Mettre à jour le mot de passe
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedNewPassword }
  });

  res.status(200).json({
    success: true,
    message: 'Mot de passe mis à jour avec succès'
  });
});

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, updateProfile);
router.put('/password', authenticate, changePassword);

export default router;