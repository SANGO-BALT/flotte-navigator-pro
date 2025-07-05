import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

// Middleware de gestion d'erreurs global
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log l'erreur pour le développement
  if (process.env.NODE_ENV === 'development') {
    console.error('💥 Erreur:', err);
  }

  // Erreur de validation Prisma
  if (err.name === 'PrismaClientValidationError') {
    const message = 'Données invalides fournies';
    error = createError(message, 400);
  }

  // Erreur de contrainte unique Prisma
  if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2002') {
    const message = 'Cette ressource existe déjà';
    error = createError(message, 409);
  }

  // Erreur de ressource non trouvée Prisma
  if (err.name === 'PrismaClientKnownRequestError' && (err as any).code === 'P2025') {
    const message = 'Ressource non trouvée';
    error = createError(message, 404);
  }

  // Erreur JWT invalide
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token invalide';
    error = createError(message, 401);
  }

  // Erreur JWT expiré
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expiré';
    error = createError(message, 401);
  }

  // Erreur de validation multer (upload)
  if (err.name === 'MulterError') {
    const message = err.message || 'Erreur lors de l\'upload du fichier';
    error = createError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Erreur interne du serveur',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

// Fonction utilitaire pour créer des erreurs personnalisées
const createError = (message: string, statusCode: number): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Classe d'erreur personnalisée
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Wrapper pour les fonctions async
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};