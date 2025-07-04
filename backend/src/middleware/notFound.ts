import { Request, Response } from 'express';

// Middleware pour les routes non trouvées
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} non trouvée`,
      method: req.method
    }
  });
};