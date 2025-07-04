import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir tous les documents
// @route   GET /api/documents
// @access  Private
export const getDocuments = catchAsync(async (req: express.Request, res: express.Response) => {
  const documents = await prisma.document.findMany({
    include: {
      vehicle: {
        select: {
          id: true,
          marque: true,
          modele: true,
          immatriculation: true
        }
      },
      utilisateur: {
        select: {
          id: true,
          nom: true,
          prenom: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: { documents }
  });
});

router.use(authenticate);
router.get('/', getDocuments);

export default router;