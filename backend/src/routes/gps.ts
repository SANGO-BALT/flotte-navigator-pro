import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir les données GPS
// @route   GET /api/gps
// @access  Private
export const getGPSRecords = catchAsync(async (req: express.Request, res: express.Response) => {
  const gpsRecords = await prisma.gPSRecord.findMany({
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
    orderBy: { timestamp: 'desc' },
    take: 100
  });

  res.status(200).json({
    success: true,
    data: { gpsRecords }
  });
});

router.use(authenticate);
router.get('/', getGPSRecords);

export default router;