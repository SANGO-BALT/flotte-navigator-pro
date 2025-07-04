import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir tous les enregistrements de maintenance
// @route   GET /api/maintenance
// @access  Private
export const getMaintenanceRecords = catchAsync(async (req: express.Request, res: express.Response) => {
  const [maintenanceRecords, total] = await Promise.all([
    prisma.maintenanceRecord.findMany({
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
    }),
    prisma.maintenanceRecord.count()
  ]);

  res.status(200).json({
    success: true,
    data: { maintenanceRecords, total }
  });
});

router.use(authenticate);
router.get('/', getMaintenanceRecords);

export default router;