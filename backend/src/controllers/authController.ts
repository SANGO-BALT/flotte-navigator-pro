import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { CreateUserRequest, LoginRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserRequest = req.body;
      
      // Check if email already exists
      const emailExists = await AuthService.checkEmailExists(userData.email);
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
        return;
      }
      
      const user = await AuthService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginRequest = req.body;
      const authResponse = await AuthService.login(credentials);
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: authResponse
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur de connexion'
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non authentifié'
        });
        return;
      }
      
      const user = await AuthService.getUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Profil récupéré avec succès',
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
}