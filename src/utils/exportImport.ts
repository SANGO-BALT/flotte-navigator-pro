
import { FleetDatabase } from '@/services/fleetDatabase';
import { toast } from '@/hooks/use-toast';

export const exportAllData = () => {
  try {
    const allData = {
      vehicles: FleetDatabase.getVehicles(),
      users: FleetDatabase.getUsers(),
      fuelRecords: FleetDatabase.getFuelRecords(),
      maintenanceRecords: FleetDatabase.getMaintenanceRecords(),
      violations: FleetDatabase.getViolations(),
      gpsRecords: FleetDatabase.getGPSRecords(),
      documents: FleetDatabase.getDocuments(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const dataStr = JSON.stringify(allData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `fleet_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Export complet réussi",
      description: "Toutes les données de la flotte ont été exportées avec succès.",
    });
  } catch (error) {
    toast({
      title: "Erreur d'export",
      description: "Une erreur s'est produite lors de l'export des données.",
      variant: "destructive",
    });
  }
};

export const importAllData = (file: File, callback?: () => void) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target?.result as string);
      
      if (importedData.vehicles && Array.isArray(importedData.vehicles)) {
        importedData.vehicles.forEach((vehicle: any) => {
          FleetDatabase.addVehicle({
            ...vehicle,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      if (importedData.users && Array.isArray(importedData.users)) {
        importedData.users.forEach((user: any) => {
          FleetDatabase.addUser({
            ...user,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      if (importedData.fuelRecords && Array.isArray(importedData.fuelRecords)) {
        importedData.fuelRecords.forEach((record: any) => {
          FleetDatabase.addFuelRecord({
            ...record,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      if (importedData.maintenanceRecords && Array.isArray(importedData.maintenanceRecords)) {
        importedData.maintenanceRecords.forEach((record: any) => {
          FleetDatabase.addMaintenanceRecord({
            ...record,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      if (importedData.violations && Array.isArray(importedData.violations)) {
        importedData.violations.forEach((violation: any) => {
          FleetDatabase.addViolation({
            ...violation,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      if (importedData.documents && Array.isArray(importedData.documents)) {
        importedData.documents.forEach((document: any) => {
          FleetDatabase.addDocument({
            ...document,
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          });
        });
      }
      
      toast({
        title: "Import complet réussi",
        description: "Toutes les données ont été importées avec succès.",
      });
      
      if (callback) callback();
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Le fichier n'est pas au bon format ou est corrompu.",
        variant: "destructive",
      });
    }
  };
  reader.readAsText(file);
};
