import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../types';

export class AuthService {
  static async register(userData: CreateUserRequest): Promise<User> {
    const { password, ...userInfo } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Generate unique employee number if not provided
    const numeroEmploye = userInfo.numero_employe || `EMP${Date.now()}`;
    
    const query = `
      INSERT INTO users (
        id, nom, prenom, email, telephone, poste, departement, role, 
        date_embauche, permis, adresse, date_naissance, numero_employe, mot_de_passe_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id, nom, prenom, email, telephone, poste, departement, role, 
                statut, date_embauche, permis, adresse, date_naissance, 
                numero_employe, created_at, updated_at
    `;
    
    const values = [
      uuidv4(),
      userInfo.nom,
      userInfo.prenom,
      userInfo.email,
      userInfo.telephone,
      userInfo.poste,
      userInfo.departement,
      userInfo.role,
      userInfo.date_embauche ? new Date(userInfo.date_embauche) : null,
      userInfo.permis,
      userInfo.adresse,
      userInfo.date_naissance ? new Date(userInfo.date_naissance) : null,
      numeroEmploye,
      hashedPassword
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;
    
    const query = `
      SELECT id, nom, prenom, email, telephone, poste, departement, role, 
             statut, date_embauche, permis, adresse, date_naissance, 
             numero_employe, mot_de_passe_hash, created_at, updated_at
      FROM users WHERE email = $1 AND statut = 'actif'
    `;
    
    const result = await pool.query(query, [email]);
    const user = result.rows[0];
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    const isValidPassword = await bcrypt.compare(password, user.mot_de_passe_hash);
    if (!isValidPassword) {
      throw new Error('Email ou mot de passe incorrect');
    }
    
    // Remove password from user object
    const { mot_de_passe_hash, ...userWithoutPassword } = user;
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  static async getUserById(id: string): Promise<User | null> {
    const query = `
      SELECT id, nom, prenom, email, telephone, poste, departement, role, 
             statut, date_embauche, permis, adresse, date_naissance, 
             numero_employe, created_at, updated_at
      FROM users WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async checkEmailExists(email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }
}