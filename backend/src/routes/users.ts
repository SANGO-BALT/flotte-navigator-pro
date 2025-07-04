import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir tous les utilisateurs
// @route   GET /api/users
// @access  Private (Admin/Gestionnaire)
export const getUsers = catchAsync(async (req: express.Request, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (req.query.role) {
    where.role = req.query.role;
  }
  
  if (req.query.statut) {
    where.statut = req.query.statut;
  }
  
  if (req.query.search) {
    where.OR = [
      { nom: { contains: req.query.search as string, mode: 'insensitive' } },
      { prenom: { contains: req.query.search as string, mode: 'insensitive' } },
      { email: { contains: req.query.search as string, mode: 'insensitive' } },
      { numeroEmploye: { contains: req.query.search as string, mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
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
        numeroEmploye: true,
        photo: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            responsableVehicules: true,
            violations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.user.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }
  });
});

// @desc    Créer un nouvel utilisateur
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    numeroEmploye,
    salaire
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
      numeroEmploye,
      salaire
    },
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
      salaire: true,
      photo: true,
      createdAt: true,
      updatedAt: true
    }
  });

  res.status(201).json({
    success: true,
    data: {
      user
    }
  });
});

// Routes
router.use(authenticate);
router.get('/', authorize('ADMIN', 'GESTIONNAIRE'), getUsers);
router.post('/', authorize('ADMIN'), createUser);

export default router;