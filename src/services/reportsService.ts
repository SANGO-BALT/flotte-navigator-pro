
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
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  static exportToPDF(reportData: any, reportType: string) {
    // Simulation d'export PDF - En production, utiliser une vraie librairie PDF
    const content = JSON.stringify(reportData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rapport_${reportType}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
