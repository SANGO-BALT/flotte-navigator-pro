
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Server, Database, Globe, Shield } from 'lucide-react';

const ProductionTutorial = () => {
  const generateTutorialHTML = () => {
    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tutoriel de Mise en Production - Fleet Management System</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #2563eb;
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        h2 {
            color: #1e40af;
            margin-top: 30px;
            margin-bottom: 15px;
            padding: 10px;
            background: linear-gradient(135deg, #e0f2fe, #f0f9ff);
            border-left: 4px solid #2563eb;
        }
        h3 {
            color: #1f2937;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .step {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .code-block {
            background: #1f2937;
            color: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .success {
            background: #d1fae5;
            border: 1px solid #10b981;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .info {
            background: #dbeafe;
            border: 1px solid #3b82f6;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        ul, ol {
            margin: 15px 0;
            padding-left: 30px;
        }
        li {
            margin: 8px 0;
        }
        .toc {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .toc h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Tutoriel de Mise en Production<br>Fleet Management System</h1>
        
        <div class="toc">
            <h3>📋 Table des Matières</h3>
            <ol>
                <li><a href="#supabase">Configuration Supabase</a></li>
                <li><a href="#vercel">Déploiement sur Vercel</a></li>
                <li><a href="#local">Configuration PC Local</a></li>
                <li><a href="#apis">Configuration des APIs</a></li>
                <li><a href="#security">Sécurité et Performance</a></li>
                <li><a href="#monitoring">Monitoring et Maintenance</a></li>
                <li><a href="#workflow">Workflow de Déploiement</a></li>
                <li><a href="#local-production">Utilisation sur PC Local</a></li>
            </ol>
        </div>

        <div id="supabase">
            <h2>🗄️ Étape 1: Configuration Supabase</h2>
            
            <div class="step">
                <h3>1.1 Créer un compte Supabase</h3>
                <ul>
                    <li>Allez sur <strong>supabase.com</strong></li>
                    <li>Créez un compte gratuit avec votre email</li>
                    <li>Cliquez sur "New Project"</li>
                    <li>Choisissez votre organisation</li>
                </ul>
            </div>

            <div class="step">
                <h3>1.2 Configuration de la base de données</h3>
                <ul>
                    <li><strong>Nom du projet:</strong> fleet-management-system</li>
                    <li><strong>Mot de passe:</strong> Choisissez un mot de passe fort (minimum 12 caractères)</li>
                    <li><strong>Région:</strong> Europe (pour de meilleures performances)</li>
                    <li>Attendez 2-3 minutes pour la création</li>
                </ul>
            </div>

            <div class="step">
                <h3>1.3 Importer la structure de base de données</h3>
                <ol>
                    <li>Allez dans l'onglet "SQL Editor"</li>
                    <li>Cliquez sur "New Query"</li>
                    <li>Copiez le contenu du fichier <code>scripts/setup-postgresql.sql</code></li>
                    <li>Collez le script et cliquez "Run"</li>
                    <li>Vérifiez que toutes les tables sont créées dans l'onglet "Database"</li>
                </ol>
            </div>

            <div class="step">
                <h3>1.4 Récupérer les clés API</h3>
                <ol>
                    <li>Allez dans "Settings" > "API"</li>
                    <li>Copiez l'<strong>URL du projet</strong></li>
                    <li>Copiez la <strong>clé publique (anon key)</strong></li>
                    <li>Gardez ces informations pour plus tard</li>
                </ol>
            </div>
        </div>

        <div id="vercel">
            <h2>🌐 Étape 2: Déploiement sur Vercel</h2>
            
            <div class="step">
                <h3>2.1 Prérequis</h3>
                <ul>
                    <li>Code sur GitHub (repository public ou privé)</li>
                    <li>Compte Vercel gratuit</li>
                </ul>
            </div>

            <div class="step">
                <h3>2.2 Connexion GitHub → Vercel</h3>
                <ol>
                    <li>Allez sur <strong>vercel.com</strong></li>
                    <li>Connectez-vous avec GitHub</li>
                    <li>Cliquez "New Project"</li>
                    <li>Sélectionnez votre repository fleet-management</li>
                    <li>Cliquez "Import"</li>
                </ol>
            </div>

            <div class="step">
                <h3>2.3 Configuration des variables d'environnement</h3>
                <p>Dans Vercel → Settings → Environment Variables, ajoutez:</p>
                <div class="code-block">
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_publique_supabase
VITE_GOOGLE_MAPS_API_KEY=votre_clé_google_maps
VITE_APP_NAME=Fleet Management System
                </div>
            </div>

            <div class="step">
                <h3>2.4 Déploiement</h3>
                <ol>
                    <li>Cliquez "Deploy"</li>
                    <li>Attendez la compilation (2-5 minutes)</li>
                    <li>Votre app sera disponible sur <code>https://votre-app.vercel.app</code></li>
                </ol>
            </div>
        </div>

        <div id="local">
            <h2>💻 Étape 3: Configuration PC Local (Production)</h2>
            
            <div class="step">
                <h3>3.1 Installation PostgreSQL (Windows)</h3>
                <div class="code-block">
# Méthode 1: Téléchargement direct
# Allez sur postgresql.org/download/windows/
# Téléchargez la version 15 ou plus récente

# Méthode 2: Via Chocolatey
choco install postgresql

# Méthode 3: Via Scoop
scoop install postgresql
                </div>
            </div>

            <div class="step">
                <h3>3.2 Configuration de la base de données</h3>
                <div class="code-block">
# Ouvrir Command Prompt en tant qu'administrateur
# Créer la base de données
createdb -U postgres fleet_management

# Importer la structure
psql -U postgres -d fleet_management -f scripts/setup-postgresql.sql

# Vérifier l'installation
psql -U postgres -d fleet_management -c "\\dt"
                </div>
            </div>

            <div class="step">
                <h3>3.3 Configuration environnement local</h3>
                <p>Créez un fichier <code>.env.local</code> à la racine du projet:</p>
                <div class="code-block">
VITE_DATABASE_URL=postgresql://postgres:motdepasse@localhost:5432/fleet_management
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
VITE_GOOGLE_MAPS_API_KEY=votre_clé_google_maps
VITE_APP_NAME=Fleet Management System
                </div>
            </div>

            <div class="step">
                <h3>3.4 Build et serveur local</h3>
                <div class="code-block">
# Installation des dépendances
npm install

# Build de production
npm run build

# Serveur local avec preview
npm run preview

# Alternative: serveur global
npm install -g serve
serve -s dist -l 3000
                </div>
            </div>
        </div>

        <div id="apis">
            <h2>🔧 Étape 4: Configuration des APIs</h2>
            
            <div class="step">
                <h3>4.1 Google Maps API</h3>
                <ol>
                    <li>Allez sur <strong>console.cloud.google.com</strong></li>
                    <li>Créez un nouveau projet ou sélectionnez un existant</li>
                    <li>Activez les APIs suivantes:
                        <ul>
                            <li>Maps JavaScript API</li>
                            <li>Places API</li>
                            <li>Routes API</li>
                            <li>Distance Matrix API</li>
                            <li>Snap to Roads API</li>
                        </ul>
                    </li>
                    <li>Créez une clé API dans "Credentials"</li>
                </ol>
            </div>

            <div class="step">
                <h3>4.2 Restrictions de sécurité</h3>
                <p>Configurez les restrictions de domaine pour votre clé API:</p>
                <ul>
                    <li><strong>Production:</strong> <code>https://votre-app.vercel.app/*</code></li>
                    <li><strong>Local:</strong> <code>http://localhost:3000/*</code></li>
                </ul>
            </div>
        </div>

        <div id="security">
            <h2>🛡️ Étape 5: Sécurité et Performance</h2>
            
            <div class="step">
                <h3>5.1 Supabase RLS (Row Level Security)</h3>
                <p>Activez la sécurité au niveau des lignes:</p>
                <div class="code-block">
-- Exemple pour la table vehicles
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vehicles" ON vehicles
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert vehicles" ON vehicles
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
                </div>
            </div>

            <div class="step">
                <h3>5.2 Configuration HTTPS</h3>
                <ul>
                    <li>Vercel configure automatiquement HTTPS</li>
                    <li>Pour local: utilisez <code>mkcert</code> pour SSL local</li>
                    <li>Configurez des en-têtes de sécurité</li>
                </ul>
            </div>
        </div>

        <div id="monitoring">
            <h2>📊 Étape 6: Monitoring et Maintenance</h2>
            
            <div class="step">
                <h3>6.1 Vercel Analytics</h3>
                <ul>
                    <li>Activez Analytics dans Vercel Dashboard</li>
                    <li>Surveillez les performances et erreurs</li>
                    <li>Configurez des alertes</li>
                </ul>
            </div>

            <div class="step">
                <h3>6.2 Supabase Monitoring</h3>
                <ul>
                    <li>Dashboard Supabase pour usage API</li>
                    <li>Logs des requêtes et erreurs</li>
                    <li>Métriques de performance</li>
                </ul>
            </div>

            <div class="step">
                <h3>6.3 Sauvegarde automatique</h3>
                <div class="code-block">
# Script de sauvegarde quotidienne (Windows)
@echo off
set backup_dir=C:\\backups\\fleet_management
set date_stamp=%date:~-4,4%%date:~-10,2%%date:~-7,2%
mkdir %backup_dir% 2>nul
pg_dump -U postgres fleet_management > %backup_dir%\\backup_%date_stamp%.sql
                </div>
            </div>
        </div>

        <div id="workflow">
            <h2>🔄 Workflow de Déploiement</h2>
            
            <div class="step">
                <h3>Processus recommandé</h3>
                <ol>
                    <li><strong>Développement local</strong> → Tests unitaires</li>
                    <li><strong>Push GitHub</strong> → Auto-deploy Vercel</li>
                    <li><strong>Tests production</strong> → Validation fonctionnelle</li>
                    <li><strong>Monitoring</strong> → Surveillance continue</li>
                </ol>
            </div>
        </div>

        <div id="local-production">
            <h2>✅ Utilisation sur PC Local (Production)</h2>
            
            <div class="success">
                <h3>🎉 Oui, vous pouvez absolument utiliser le système en production sur votre PC !</h3>
            </div>

            <div class="step">
                <h3>Avantages de l'installation locale</h3>
                <ul>
                    <li>✅ Contrôle total des données</li>
                    <li>✅ Pas de coûts cloud mensuels</li>
                    <li>✅ Performance locale optimale</li>
                    <li>✅ Sécurité renforcée (réseau local)</li>
                    <li>✅ Pas de dépendance internet</li>
                </ul>
            </div>

            <div class="step">
                <h3>Configuration recommandée</h3>
                <ul>
                    <li>PostgreSQL en service Windows</li>
                    <li>Nginx ou Apache comme reverse proxy</li>
                    <li>Certificats SSL locaux (mkcert)</li>
                    <li>Sauvegarde automatique quotidienne</li>
                    <li>Accès réseau local pour équipe</li>
                </ul>
            </div>

            <div class="step">
                <h3>Script de démarrage automatique</h3>
                <p>Créez un fichier <code>start-fleet.bat</code>:</p>
                <div class="code-block">
@echo off
echo Démarrage du Fleet Management System...
cd /d "C:\\path\\to\\your\\fleet-app"

REM Démarrer PostgreSQL
net start postgresql-x64-15

REM Démarrer l'application
start "Fleet App" cmd /k "serve -s dist -l 3000"

echo.
echo ===================================
echo Fleet Management System démarré !
echo URL: http://localhost:3000
echo ===================================
echo.
pause
                </div>
            </div>

            <div class="step">
                <h3>Service Windows (Optionnel)</h3>
                <p>Pour démarrer automatiquement au boot:</p>
                <ol>
                    <li>Installez <code>node-windows</code></li>
                    <li>Créez un service Windows</li>
                    <li>L'application démarrera automatiquement</li>
                </ol>
            </div>
        </div>

        <div class="warning">
            <h3>⚠️ Points importants à retenir</h3>
            <ul>
                <li>Sauvegardez régulièrement votre base de données</li>
                <li>Mettez à jour PostgreSQL et Node.js régulièrement</li>
                <li>Surveillez les logs d'erreur</li>
                <li>Testez les sauvegardes périodiquement</li>
                <li>Documentez vos modifications personnalisées</li>
            </ul>
        </div>

        <div class="info">
            <h3>💡 Conseils supplémentaires</h3>
            <ul>
                <li>Utilisez un UPS pour éviter les coupures de courant</li>
                <li>Configurez un firewall pour sécuriser l'accès</li>
                <li>Créez plusieurs comptes utilisateur avec des rôles différents</li>
                <li>Implémentez un système de logs détaillé</li>
                <li>Prévoyez un plan de reprise d'activité</li>
            </ul>
        </div>

        <div class="footer">
            <p><strong>Fleet Management System - Tutoriel de Mise en Production</strong></p>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')} - Version 1.0</p>
            <p>Pour toute question, consultez la documentation ou contactez l'équipe de développement</p>
        </div>
    </div>
</body>
</html>`;
  };

  const downloadTutorial = () => {
    const htmlContent = generateTutorialHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tutoriel-Mise-en-Production-Fleet-Management-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadPDFVersion = () => {
    // Créer une version simplifiée pour PDF
    const pdfContent = `
# TUTORIEL DE MISE EN PRODUCTION
## Fleet Management System

Date: ${new Date().toLocaleDateString('fr-FR')}

## 1. CONFIGURATION SUPABASE
- Créer compte sur supabase.com
- Nouveau projet: fleet-management-system
- Importer scripts/setup-postgresql.sql
- Récupérer URL et clé API

## 2. DÉPLOIEMENT VERCEL
- Connecter GitHub à Vercel
- Configurer variables d'environnement:
  * VITE_SUPABASE_URL
  * VITE_SUPABASE_ANON_KEY
  * VITE_GOOGLE_MAPS_API_KEY
- Déployer automatiquement

## 3. CONFIGURATION PC LOCAL
### Installation PostgreSQL:
- Télécharger depuis postgresql.org
- Créer base: createdb fleet_management
- Importer: psql -f setup-postgresql.sql

### Fichier .env.local:
VITE_DATABASE_URL=postgresql://postgres:password@localhost:5432/fleet_management
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
VITE_GOOGLE_MAPS_API_KEY=votre_clé_google

### Commandes:
npm install
npm run build
npm run preview

## 4. GOOGLE MAPS API
- Console Google Cloud Platform
- Activer: Maps JavaScript API, Places API, Routes API, Distance Matrix API
- Créer clé API avec restrictions de domaine

## 5. SÉCURITÉ
- Activer RLS sur Supabase
- Configurer HTTPS
- Restrictions API par domaine

## 6. MONITORING
- Vercel Analytics
- Supabase Dashboard
- Logs et métriques

## 7. UTILISATION LOCALE PRODUCTION
✅ Parfaitement possible sur PC !

Avantages:
- Contrôle total des données
- Pas de coûts cloud
- Performance optimale
- Sécurité renforcée

Script démarrage (start-fleet.bat):
@echo off
cd C:\\path\\to\\fleet-app
net start postgresql-x64-15
serve -s dist -l 3000

## 8. MAINTENANCE
- Sauvegardes automatiques
- Mises à jour régulières
- Monitoring des performances
- Plan de reprise d'activité

---
Fleet Management System - Tutoriel complet
Généré le ${new Date().toLocaleDateString('fr-FR')}
`;

    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tutoriel-Production-Fleet-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Tutoriel de Mise en Production
        </CardTitle>
        <CardDescription>
          Guide complet pour déployer le système en production avec Supabase, Vercel et installation locale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Server className="h-5 w-5" />
              Déploiement Cloud
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Configuration Supabase</li>
              <li>• Déploiement Vercel</li>
              <li>• APIs Google Maps</li>
              <li>• Sécurité et monitoring</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Installation Locale
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• PostgreSQL local</li>
              <li>• Configuration PC</li>
              <li>• Scripts automatiques</li>
              <li>• Production hors ligne</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="h-5 w-5" />
              APIs et Intégrations
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Routes API</li>
              <li>• Distance Matrix API</li>
              <li>• Snap to Roads API</li>
              <li>• Géolocalisation avancée</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité et Maintenance
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Row Level Security</li>
              <li>• Sauvegardes automatiques</li>
              <li>• Monitoring en temps réel</li>
              <li>• Plan de reprise</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            onClick={downloadTutorial}
            className="flex items-center gap-2"
            size="lg"
          >
            <Download className="h-5 w-5" />
            Télécharger Tutoriel Complet HTML
          </Button>
          
          <Button 
            onClick={downloadPDFVersion}
            variant="outline"
            className="flex items-center gap-2"
            size="lg"
          >
            <FileText className="h-5 w-5" />
            Télécharger Version Texte
          </Button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Contenu du tutoriel :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✅ Guide étape par étape pour Supabase et Vercel</li>
            <li>✅ Instructions complètes pour installation locale</li>
            <li>✅ Configuration des APIs Google Maps</li>
            <li>✅ Scripts de démarrage automatique</li>
            <li>✅ Sécurisation et bonnes pratiques</li>
            <li>✅ Monitoring et maintenance</li>
            <li>✅ Utilisation hors ligne sur PC</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionTutorial;
