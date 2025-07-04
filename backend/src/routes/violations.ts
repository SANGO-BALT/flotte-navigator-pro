import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir toutes les violations
// @route   GET /api/violations
// @access  Private
export const getViolations = catchAsync(async (req: express.Request, res: express.Response) => {
  const violations = await prisma.violation.findMany({
    include: {
      vehicle: {
        select: {
          id: true,
          marque: true,
          modele: true,
          immatriculation: true
        }
      },
      conducteur: {
        select: {
          id: true,
          nom: true,
          prenom: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: { violations }
  });
});

router.use(authenticate);
router.get('/', getViolations);

export default router;