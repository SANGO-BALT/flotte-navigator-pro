
import { FleetDatabase } from './fleetDatabase';
import { Vehicle, User, FuelRecord, MaintenanceRecord, Violation } from '@/types/fleet';

export interface ReportData {
  vehicles: Vehicle[];
  users: User[];
  fuelRecords: FuelRecord[];
  maintenanceRecords: MaintenanceRecord[];
  violations: Violation[];
  period: {
    start: string;
    end: string;
  };
}

export class ReportsService {
  static generateVehicleReport(startDate: string, endDate: string): ReportData {
    return {
      vehicles: FleetDatabase.getVehicles(),
      users: FleetDatabase.getUsers(),
      fuelRecords: FleetDatabase.getFuelRecords().filter(
        record => record.date >= startDate && record.date <= endDate
      ),
      maintenanceRecords: FleetDatabase.getMaintenanceRecords().filter(
        record => record.date >= startDate && record.date <= endDate
      ),
      violations: FleetDatabase.getViolations().filter(
        violation => violation.date >= startDate && violation.date <= endDate
      ),
      period: { start: startDate, end: endDate }
    };
  }

  static generateFuelReport(startDate: string, endDate: string) {
    const fuelRecords = FleetDatabase.getFuelRecords().filter(
      record => record.date >= startDate && record.date <= endDate
    );
    
    const totalCost = fuelRecords.reduce((sum, record) => sum + record.totalCost, 0);
    const totalQuantity = fuelRecords.reduce((sum, record) => sum + record.quantity, 0);
    const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

    return {
      records: fuelRecords,
      summary: {
        totalCost,
        totalQuantity,
        averagePrice,
        recordCount: fuelRecords.length
      },
      period: { start: startDate, end: endDate }
    };
  }

  static generateMaintenanceReport(startDate: string, endDate: string) {
    const maintenanceRecords = FleetDatabase.getMaintenanceRecords().filter(
      record => record.date >= startDate && record.date <= endDate
    );
    
    const totalCost = maintenanceRecords.reduce((sum, record) => sum + (record.cout || 0), 0);
    const preventiveCount = maintenanceRecords.filter(r => r.type === 'preventive').length;
    const correctiveCount = maintenanceRecords.filter(r => r.type === 'corrective').length;

    return {
      records: maintenanceRecords,
      summary: {
        totalCost,
        preventiveCount,
        correctiveCount,
        totalRecords: maintenanceRecords.length
      },
      period: { start: startDate, end: endDate }
    };
  }

  static exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header] || '';
        // Échapper les guillemets et virgules dans les valeurs
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(','))
    ].join('\n');

    // Ajouter BOM pour l'UTF-8
    const BOM = '\ufeff';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static exportToExcel(data: any[], filename: string) {
    if (data.length === 0) return;

    // Créer un tableau HTML pour Excel
    const headers = Object.keys(data[0]);
    let htmlTable = '<table border="1"><thead><tr>';
    
    // En-têtes
    headers.forEach(header => {
      htmlTable += `<th style="background-color: #4CAF50; color: white; padding: 8px;">${header}</th>`;
    });
    htmlTable += '</tr></thead><tbody>';
    
    // Données
    data.forEach(row => {
      htmlTable += '<tr>';
      headers.forEach(header => {
        const value = row[header] || '';
        htmlTable += `<td style="padding: 8px; border: 1px solid #ddd;">${value}</td>`;
      });
      htmlTable += '</tr>';
    });
    htmlTable += '</tbody></table>';

    // Créer le fichier Excel
    const blob = new Blob([htmlTable], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static exportToPDF(reportData: any, reportType: string) {
    // Créer un contenu HTML formaté pour le PDF
    const currentDate = new Date().toLocaleDateString('fr-FR');
    const reportTitle = `Rapport ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`;
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { color: #2196F3; font-size: 24px; font-weight: bold; }
          .date { color: #666; margin-top: 10px; }
          .section { margin: 20px 0; }
          .section-title { color: #333; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${reportTitle}</div>
          <div class="date">Généré le ${currentDate}</div>
        </div>
    `;

    // Ajouter le contenu selon le type de rapport
    if (reportType === 'carburant' && reportData.records) {
      htmlContent += `
        <div class="section">
          <div class="section-title">Résumé Carburant</div>
          <div class="summary">
            <p><strong>Coût total:</strong> ${reportData.summary.totalCost.toLocaleString('fr-FR')} FCFA</p>
            <p><strong>Quantité totale:</strong> ${reportData.summary.totalQuantity} L</p>
            <p><strong>Prix moyen:</strong> ${reportData.summary.averagePrice.toFixed(2)} FCFA/L</p>
            <p><strong>Nombre d'enregistrements:</strong> ${reportData.summary.recordCount}</p>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Détails des Enregistrements</div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Véhicule</th>
                <th>Quantité (L)</th>
                <th>Prix Unitaire</th>
                <th>Coût Total</th>
              </tr>
            </thead>
            <tbody>
      `;
      
      reportData.records.forEach((record: any) => {
        htmlContent += `
          <tr>
            <td>${record.date}</td>
            <td>${record.vehicleId}</td>
            <td>${record.quantity}</td>
            <td>${record.pricePerLiter}</td>
            <td>${record.totalCost}</td>
          </tr>
        `;
      });
      
      htmlContent += '</tbody></table></div>';
    }

    htmlContent += '</body></html>';

    // Créer le blob et télécharger
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_${reportType}_${new Date().toISOString().split('T')[0]}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
