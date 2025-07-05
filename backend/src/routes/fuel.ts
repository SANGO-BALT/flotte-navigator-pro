import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir tous les enregistrements de carburant
// @route   GET /api/fuel
// @access  Private
export const getFuelRecords = catchAsync(async (req: express.Request, res: express.Response) => {
  const fuelRecords = await prisma.fuelRecord.findMany({
    include: {
      vehicle: {
        select: {
          id: true,
          marque: true,
          modele: true,
          immatriculation: true
        }
      }
    },
    orderBy: { date: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: { fuelRecords }
  });
});

router.use(authenticate);
router.get('/', getFuelRecords);

export default router;