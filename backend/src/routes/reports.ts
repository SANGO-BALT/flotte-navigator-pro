import express from 'express';
import { PrismaClient } from '@prisma/client';
import { catchAsync } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir les statistiques du dashboard
// @route   GET /api/reports/dashboard
// @access  Private
export const getDashboardStats = catchAsync(async (req: express.Request, res: express.Response) => {
  const [
    totalVehicles,
    activeVehicles,
    totalUsers,
    totalFuelCost,
    totalMaintenanceCost,
    pendingViolations,
    recentFuelRecords,
    upcomingMaintenances
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { statut: 'ACTIF' } }),
    prisma.user.count({ where: { statut: 'ACTIF' } }),
    prisma.fuelRecord.aggregate({
      _sum: { totalCost: true }
    }),
    prisma.maintenanceRecord.aggregate({
      _sum: { cout: true }
    }),
    prisma.violation.count({ where: { statut: 'EN_ATTENTE' } }),
    prisma.fuelRecord.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        vehicle: { select: { marque: true, modele: true, immatriculation: true } }
      }
    }),
    prisma.maintenanceRecord.findMany({
      where: { statut: 'PROGRAMME' },
      take: 5,
      orderBy: { datePrevu: 'asc' },
      include: {
        vehicle: { select: { marque: true, modele: true, immatriculation: true } }
      }
    })
  ]);

  res.status(200).json({
    success: true,
    data: {
      statistics: {
        totalVehicles,
        activeVehicles,
        totalUsers,
        totalFuelCost: totalFuelCost._sum.totalCost || 0,
        totalMaintenanceCost: totalMaintenanceCost._sum.cout || 0,
        pendingViolations
      },
      recentActivities: {
        fuelRecords: recentFuelRecords,
        upcomingMaintenances
      }
    }
  });
});

router.use(authenticate);
router.get('/dashboard', getDashboardStats);

export default router;