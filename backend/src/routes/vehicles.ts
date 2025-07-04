import express from 'express';
import { body, validationResult, query } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AppError, catchAsync } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation pour création/mise à jour véhicule
const vehicleValidation = [
  body('marque')
    .trim()
    .isLength({ min: 2 })
    .withMessage('La marque doit contenir au moins 2 caractères'),
  body('modele')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Le modèle est requis'),
  body('immatriculation')
    .trim()
    .isLength({ min: 5 })
    .withMessage('L\'immatriculation doit contenir au moins 5 caractères'),
  body('annee')
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage('Année invalide'),
  body('type')
    .isIn(['VOITURE', 'MOTO', 'CAMION', 'BUS'])
    .withMessage('Type de véhicule invalide'),
  body('carburant')
    .isIn(['ESSENCE', 'DIESEL', 'ELECTRIQUE', 'HYBRIDE'])
    .withMessage('Type de carburant invalide'),
  body('kilometrage')
    .isInt({ min: 0 })
    .withMessage('Le kilométrage doit être positif'),
  body('prixAchat')
    .isFloat({ min: 0 })
    .withMessage('Le prix d\'achat doit être positif')
];

// @desc    Obtenir tous les véhicules
// @route   GET /api/vehicles
// @access  Private
export const getVehicles = catchAsync(async (req: express.Request, res: express.Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Filtres optionnels
  const where: any = {};
  
  if (req.query.status) {
    where.statut = req.query.status;
  }
  
  if (req.query.type) {
    where.type = req.query.type;
  }
  
  if (req.query.search) {
    where.OR = [
      { marque: { contains: req.query.search as string, mode: 'insensitive' } },
      { modele: { contains: req.query.search as string, mode: 'insensitive' } },
      { immatriculation: { contains: req.query.search as string, mode: 'insensitive' } }
    ];
  }

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: limit,
      include: {
        responsable: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        _count: {
          select: {
            fuelRecords: true,
            maintenanceRecords: true,
            violations: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.vehicle.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: {
      vehicles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    }
  });
});

// @desc    Obtenir un véhicule par ID
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicle = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      responsable: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true
        }
      },
      fuelRecords: {
        take: 5,
        orderBy: { date: 'desc' }
      },
      maintenanceRecords: {
        take: 5,
        orderBy: { date: 'desc' }
      },
      violations: {
        take: 5,
        orderBy: { date: 'desc' }
      },
      documents: {
        where: {
          statut: 'VALIDE'
        }
      }
    }
  });

  if (!vehicle) {
    return next(new AppError('Véhicule non trouvé', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      vehicle
    }
  });
});

// @desc    Créer un nouveau véhicule
// @route   POST /api/vehicles
// @access  Private (Admin/Gestionnaire)
export const createVehicle = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`Erreurs de validation: ${errors.array().map(e => e.msg).join(', ')}`, 400));
  }

  const {
    marque,
    modele,
    immatriculation,
    annee,
    type,
    kilometrage,
    dateAchat,
    prixAchat,
    couleur,
    carburant,
    numeroSerie,
    dateAssurance,
    dateVisite,
    responsableId,
    notes
  } = req.body;

  // Vérifier si l'immatriculation existe déjà
  const existingVehicle = await prisma.vehicle.findFirst({
    where: {
      OR: [
        { immatriculation },
        { numeroSerie }
      ]
    }
  });

  if (existingVehicle) {
    return next(new AppError('Un véhicule avec cette immatriculation ou numéro de série existe déjà', 409));
  }

  // Vérifier si le responsable existe (si fourni)
  if (responsableId) {
    const responsable = await prisma.user.findUnique({
      where: { id: responsableId }
    });

    if (!responsable) {
      return next(new AppError('Responsable non trouvé', 404));
    }
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      marque,
      modele,
      immatriculation,
      annee,
      type,
      kilometrage,
      dateAchat: new Date(dateAchat),
      prixAchat,
      couleur,
      carburant,
      numeroSerie,
      dateAssurance: new Date(dateAssurance),
      dateVisite: new Date(dateVisite),
      responsableId,
      notes
    },
    include: {
      responsable: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });

  res.status(201).json({
    success: true,
    data: {
      vehicle
    }
  });
});

// @desc    Mettre à jour un véhicule
// @route   PUT /api/vehicles/:id
// @access  Private (Admin/Gestionnaire)
export const updateVehicle = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;

  // Vérifier si le véhicule existe
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!existingVehicle) {
    return next(new AppError('Véhicule non trouvé', 404));
  }

  // Vérifier les erreurs de validation (pour les champs modifiés uniquement)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`Erreurs de validation: ${errors.array().map(e => e.msg).join(', ')}`, 400));
  }

  const updateData = { ...req.body };

  // Convertir les dates si elles sont fournies
  if (updateData.dateAchat) {
    updateData.dateAchat = new Date(updateData.dateAchat);
  }
  if (updateData.dateAssurance) {
    updateData.dateAssurance = new Date(updateData.dateAssurance);
  }
  if (updateData.dateVisite) {
    updateData.dateVisite = new Date(updateData.dateVisite);
  }

  // Vérifier si le responsable existe (si fourni)
  if (updateData.responsableId) {
    const responsable = await prisma.user.findUnique({
      where: { id: updateData.responsableId }
    });

    if (!responsable) {
      return next(new AppError('Responsable non trouvé', 404));
    }
  }

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: updateData,
    include: {
      responsable: {
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true
        }
      }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      vehicle
    }
  });
});

// @desc    Supprimer un véhicule
// @route   DELETE /api/vehicles/:id
// @access  Private (Admin)
export const deleteVehicle = catchAsync(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findUnique({
    where: { id }
  });

  if (!vehicle) {
    return next(new AppError('Véhicule non trouvé', 404));
  }

  await prisma.vehicle.delete({
    where: { id }
  });

  res.status(200).json({
    success: true,
    message: 'Véhicule supprimé avec succès'
  });
});

// Routes avec authentification et autorisation
router.use(authenticate); // Toutes les routes nécessitent une authentification

router
  .route('/')
  .get(getVehicles)
  .post(authorize('ADMIN', 'GESTIONNAIRE'), vehicleValidation, createVehicle);

router
  .route('/:id')
  .get(getVehicle)
  .put(authorize('ADMIN', 'GESTIONNAIRE'), updateVehicle)
  .delete(authorize('ADMIN'), deleteVehicle);

export default router;