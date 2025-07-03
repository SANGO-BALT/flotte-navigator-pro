
import React, { useState } from 'react';
import { Database, Download, Upload, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { FleetDatabase } from '@/services/fleetDatabase';
import { exportAllData, importAllData } from '@/utils/exportImport';

const DataManagementPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExportAll = () => {
    exportAllData();
  };

  const handleImportAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      importAllData(file, () => {
        setIsLoading(false);
        // Rafraîchir la page pour recharger toutes les données
        window.location.reload();
      });
    }
  };

  const handleResetDatabase = () => {
    if (confirm('ATTENTION: Cette action va supprimer TOUTES les données et restaurer les données par défaut. Cette action est irréversible. Êtes-vous sûr ?')) {
      if (confirm('Dernière confirmation: Toutes vos données seront perdues. Continuez ?')) {
        // Vider le localStorage
        localStorage.clear();
        // Réinitialiser la base de données
        FleetDatabase.initializeDatabase();
        toast({
          title: "Base de données réinitialisée",
          description: "Toutes les données ont été supprimées et les données par défaut ont été restaurées.",
        });
        // Rafraîchir la page
        setTimeout(() => window.location.reload(), 1000);
      }
    }
  };

  const getDataStats = () => {
    return {
      vehicles: FleetDatabase.getVehicles().length,
      users: FleetDatabase.getUsers().length,
      fuelRecords: FleetDatabase.getFuelRecords().length,
      maintenanceRecords: FleetDatabase.getMaintenanceRecords().length,
      violations: FleetDatabase.getViolations().length,
      documents: FleetDatabase.getDocuments().length,
      gpsRecords: FleetDatabase.getGPSRecords().length,
    };
  };

  const stats = getDataStats();
  const totalRecords = Object.values(stats).reduce((sum, count) => sum + count, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Gestion des Données</h1>
        <p className="text-muted-foreground">
          Administration et sauvegarde de toutes les données de la flotte
        </p>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{totalRecords}</p>
                <p className="text-sm text-muted-foreground">Total enregistrements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{stats.vehicles}</p>
              <p className="text-sm text-muted-foreground">Véhicules</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{stats.users}</p>
              <p className="text-sm text-muted-foreground">Utilisateurs</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">{stats.fuelRecords}</p>
              <p className="text-sm text-muted-foreground">Pleins carburant</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export des données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export des données</span>
            </CardTitle>
            <CardDescription>
              Téléchargez une sauvegarde complète de toutes vos données
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Données incluses dans l'export:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {stats.vehicles} Véhicules</li>
                <li>• {stats.users} Utilisateurs</li>
                <li>• {stats.fuelRecords} Enregistrements carburant</li>
                <li>• {stats.maintenanceRecords} Enregistrements maintenance</li>
                <li>• {stats.violations} Contraventions</li>
                <li>• {stats.documents} Documents</li>
                <li>• {stats.gpsRecords} Enregistrements GPS</li>
              </ul>
            </div>
            <Button onClick={handleExportAll} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Exporter toutes les données
            </Button>
          </CardContent>
        </Card>

        {/* Import des données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Import des données</span>
            </CardTitle>
            <CardDescription>
              Importez des données depuis un fichier de sauvegarde
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Attention</p>
                  <p className="text-yellow-700">
                    L'import ajoutera les données au contenu existant. 
                    Effectuez une sauvegarde avant d'importer.
                  </p>
                </div>
              </div>
            </div>
            
            <label className="cursor-pointer">
              <Button className="w-full" variant="outline" asChild disabled={isLoading}>
                <span>
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Sélectionner un fichier d'import
                    </>
                  )}
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportAll}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </CardContent>
        </Card>

        {/* Réinitialisation */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              <span>Zone dangereuse</span>
            </CardTitle>
            <CardDescription>
              Actions irréversibles - Utilisez avec précaution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Réinitialisation complète</p>
                  <p className="text-red-700">
                    Cette action supprimera TOUTES vos données et restaurera les données par défaut. 
                    Cette action est définitive et ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleResetDatabase} 
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Réinitialiser toute la base de données
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagementPage;
