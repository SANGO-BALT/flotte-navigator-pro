
import React, { useState } from 'react';
import { BarChart, PieChart, FileText, Download, Calendar, TrendingUp, Fuel, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReportsService } from '@/services/reportsService';
import { toast } from 'sonner';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-06-01',
    endDate: '2024-07-01',
  });
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'vehicles',
      title: 'Rapport Véhicules',
      description: 'État de la flotte, utilisation, statuts',
      icon: Car,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    },
    {
      id: 'fuel',
      title: 'Rapport Carburant',
      description: 'Consommation, coûts, tendances',
      icon: Fuel,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    },
    {
      id: 'maintenance',
      title: 'Rapport Maintenance',
      description: 'Interventions, coûts, planification',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    },
    {
      id: 'violations',
      title: 'Rapport Contraventions',
      description: 'Infractions, amendes, statistiques',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    },
    {
      id: 'financial',
      title: 'Rapport Financier',
      description: 'Coûts globaux, budget, ROI',
      icon: BarChart,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    },
    {
      id: 'gps',
      title: 'Rapport GPS',
      description: 'Trajets, distances, utilisation',
      icon: PieChart,
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    },
  ];

  const quickStats = [
    {
      title: 'Total Véhicules',
      value: '24',
      change: '+2',
      icon: Car,
      color: 'text-blue-600',
    },
    {
      title: 'Coût Carburant (FCFA)',
      value: '2,450,000',
      change: '-5%',
      icon: Fuel,
      color: 'text-green-600',
    },
    {
      title: 'Maintenance (FCFA)',
      value: '850,000',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
    {
      title: 'Contraventions (FCFA)',
      value: '125,000',
      change: '+3',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ];

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(reportType);
    
    try {
      let reportData;
      
      switch (reportType) {
        case 'vehicles':
          reportData = ReportsService.generateVehicleReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'fuel':
          reportData = ReportsService.generateFuelReport(dateRange.startDate, dateRange.endDate);
          break;
        case 'maintenance':
          reportData = ReportsService.generateMaintenanceReport(dateRange.startDate, dateRange.endDate);
          break;
        default:
          reportData = ReportsService.generateVehicleReport(dateRange.startDate, dateRange.endDate);
      }
      
      // Simulation d'un délai de génération
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Rapport ${reportType} généré avec succès!`);
      console.log(`Rapport ${reportType} généré:`, reportData);
      
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(null);
    }
  };

  const handleDownloadReport = async (reportType: string, format: 'csv' | 'pdf' | 'excel') => {
    try {
      let reportData;
      
      switch (reportType) {
        case 'fuel':
          reportData = ReportsService.generateFuelReport(dateRange.startDate, dateRange.endDate);
          if (format === 'csv') {
            ReportsService.exportToCSV(reportData.records, `rapport_carburant_${dateRange.startDate}_${dateRange.endDate}`);
          } else if (format === 'excel') {
            ReportsService.exportToExcel(reportData.records, `rapport_carburant_${dateRange.startDate}_${dateRange.endDate}`);
          } else {
            ReportsService.exportToPDF(reportData, 'carburant');
          }
          break;
        case 'maintenance':
          reportData = ReportsService.generateMaintenanceReport(dateRange.startDate, dateRange.endDate);
          if (format === 'csv') {
            ReportsService.exportToCSV(reportData.records, `rapport_maintenance_${dateRange.startDate}_${dateRange.endDate}`);
          } else if (format === 'excel') {
            ReportsService.exportToExcel(reportData.records, `rapport_maintenance_${dateRange.startDate}_${dateRange.endDate}`);
          } else {
            ReportsService.exportToPDF(reportData, 'maintenance');
          }
          break;
        default:
          reportData = ReportsService.generateVehicleReport(dateRange.startDate, dateRange.endDate);
          if (format === 'csv') {
            ReportsService.exportToCSV(reportData.vehicles, `rapport_vehicules_${dateRange.startDate}_${dateRange.endDate}`);
          } else if (format === 'excel') {
            ReportsService.exportToExcel(reportData.vehicles, `rapport_vehicules_${dateRange.startDate}_${dateRange.endDate}`);
          } else {
            ReportsService.exportToPDF(reportData, 'vehicules');
          }
      }
      
      toast.success(`Rapport téléchargé en ${format.toUpperCase()}`);
      
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
      console.error('Erreur:', error);
    }
  };

  const handleExportAll = async () => {
    try {
      const allData = ReportsService.generateVehicleReport(dateRange.startDate, dateRange.endDate);
      ReportsService.exportToPDF(allData, 'complet');
      toast.success('Export de tous les rapports terminé');
    } catch (error) {
      toast.error('Erreur lors de l\'export global');
    }
  };

  return (
    <div className="p-12 max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header avec contrôles - Interface élargie */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="flex-1">
          <h2 className="text-5xl font-bold text-foreground mb-6">Rapports et Analyses</h2>
          <p className="text-2xl text-muted-foreground">Générez des rapports détaillés sur votre flotte</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <label className="text-lg font-medium text-foreground mb-3">Date début</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-auto h-14 text-lg"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-medium text-foreground mb-3">Date fin</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-auto h-14 text-lg"
              />
            </div>
          </div>
          <Button onClick={handleExportAll} variant="outline" className="self-end h-14 px-8 text-lg">
            <Download className="w-6 h-6 mr-3" />
            Exporter tout
          </Button>
        </div>
      </div>

      {/* Statistiques rapides - Interface élargie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {quickStats.map((stat, index) => (
          <div key={index} className="fleet-card p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg text-muted-foreground mb-3">{stat.title}</p>
                <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-lg mt-3 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} ce mois
                </p>
              </div>
              <stat.icon className={`w-16 h-16 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Types de rapports - Interface élargie */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
        {reportTypes.map((report) => (
          <div key={report.id} className="fleet-card p-8">
            <div className="flex items-start space-x-6">
              <div className={`p-6 rounded-lg ${report.color}`}>
                <report.icon className="w-10 h-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-foreground mb-4">{report.title}</h3>
                <p className="text-lg text-muted-foreground mb-6">{report.description}</p>
                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={() => handleGenerateReport(report.id)}
                    size="lg"
                    className="fleet-button-primary h-14 text-lg"
                    disabled={isGenerating === report.id}
                  >
                    <FileText className="w-6 h-6 mr-3" />
                    {isGenerating === report.id ? 'Génération...' : 'Générer'}
                  </Button>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id, 'csv')}
                      title="Télécharger CSV"
                      className="flex-1 h-12 text-base"
                    >
                      CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id, 'excel')}
                      title="Télécharger Excel"
                      className="flex-1 h-12 text-base"
                    >
                      Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id, 'pdf')}
                      title="Télécharger PDF"
                      className="flex-1 h-12 text-base"
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rapports récents - Interface élargie */}
      <div className="fleet-card p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-3xl font-semibold text-foreground">Rapports récents</h3>
          <Button variant="outline" size="lg" className="h-12 px-6 text-lg">
            Voir tout
          </Button>
        </div>
        
        <div className="space-y-6">
          {[
            {
              name: 'Rapport Carburant - Juin 2024',
              date: '2024-07-01',
              type: 'PDF',
              size: '2.1 MB',
            },
            {
              name: 'Analyse Maintenance - Q2 2024',
              date: '2024-06-30',
              type: 'Excel',
              size: '1.8 MB',
            },
            {
              name: 'Statistiques Flotte - Mai 2024',
              date: '2024-06-01',
              type: 'PDF',
              size: '3.2 MB',
            },
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-6">
                <FileText className="w-8 h-8 text-muted-foreground" />
                <div>
                  <p className="text-xl font-medium text-foreground">{report.name}</p>
                  <p className="text-lg text-muted-foreground mt-2">
                    {report.type} • {report.size} • {new Date(report.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="ghost" size="lg" className="h-12 px-6 text-lg">
                  Voir
                </Button>
                <Button variant="ghost" size="lg" className="h-12 px-4">
                  <Download className="w-6 h-6" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
