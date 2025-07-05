import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AppError, catchAsync } from './errorHandler';

const prisma = new PrismaClient();

// Interface pour l'utilisateur dans la requête
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    nom: string;
    prenom: string;
  };
}

// Middleware d'authentification
export const authenticate = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // 1) Vérifier si le token existe
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Vous devez être connecté pour accéder à cette ressource', 401));
  }

  // 2) Vérifier le token
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new AppError('Configuration JWT manquante', 500));
  }

  const decoded = jwt.verify(token, secret) as {
    id: string;
    email: string;
    iat: number;
    exp: number;
  };

  // 3) Vérifier si l'utilisateur existe toujours
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      role: true,
      nom: true,
      prenom: true,
      statut: true
    }
  });

  if (!currentUser) {
    return next(new AppError('L\'utilisateur possédant ce token n\'existe plus', 401));
  }

  // 4) Vérifier si l'utilisateur est actif
  if (currentUser.statut !== 'ACTIF') {
    return next(new AppError('Votre compte a été désactivé', 401));
  }

  // 5) Attacher l'utilisateur à la requête
  req.user = currentUser;
  next();
});

// Middleware d'autorisation basé sur les rôles
export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Utilisateur non authentifié', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Vous n\'avez pas les permissions pour accéder à cette ressource', 403));
    }

    next();
  };
};

// Middleware optionnel d'authentification (pour les routes publiques avec données conditionnelles)
export const optionalAuth = catchAsync(async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (secret) {
        const decoded = jwt.verify(token, secret) as {
          id: string;
          email: string;
        };

        const currentUser = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            role: true,
            nom: true,
            prenom: true,
            statut: true
          }
        });

        if (currentUser && currentUser.statut === 'ACTIF') {
          req.user = currentUser;
        }
      }
    } catch (error) {
      // Token invalide, mais on continue sans utilisateur
    }
  }

  next();
});