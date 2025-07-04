import express from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// @desc    Obtenir tous les enregistrements de carburant
// @route   GET /api/fuel
// @access  Private
export const getFuelRecords = catchAsync(async (req: express.Request, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};
  
  if (req.query.vehiculeId) {
    where.vehiculeId = req.query.vehiculeId;
  }
  
  if (req.query.fuelType) {
    where.fuelType = req.query.fuelType;
  }

  const [fuelRecords, total] = await Promise.all([
    prisma.fuelRecord.findMany({
      where,
      skip,
      take: limit,
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
      orderBy: {
        date: 'desc'
      }
    }),
    prisma.fuelRecord.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: {
      fuelRecords,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }
  });
});

// @desc    Créer un enregistrement de carburant
// @route   POST /api/fuel
// @access  Private (Admin/Gestionnaire/Conducteur)
export const createFuelRecord = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const {
    vehiculeId,
    date,
    fuelType,
    quantity,
    unitPrice,
    station,
    mileage,
    conducteur,
    facture,
    notes
  } = req.body;

  // Vérifier si le véhicule existe
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehiculeId }
  });

  if (!vehicle) {
    return next(new AppError('Véhicule non trouvé', 404));
  }

  const totalCost = quantity * unitPrice;

  const fuelRecord = await prisma.fuelRecord.create({
    data: {
      vehiculeId,
      vehiclePlate: vehicle.immatriculation,
      vehicleBrand: `${vehicle.marque} ${vehicle.modele}`,
      date: new Date(date),
      fuelType,
      quantity,
      unitPrice,
      totalCost,
      station,
      mileage,
      conducteur,
      facture,
      notes
    },
    include: {
      vehicle: {
        select: {
          id: true,
          marque: true,
          modele: true,
          immatriculation: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    data: {
      fuelRecord
    }
  });
});

// Routes
router.use(authenticate);
router.get('/', getFuelRecords);
router.post('/', authorize('ADMIN', 'GESTIONNAIRE', 'CONDUCTEUR'), createFuelRecord);

export default router;