
import React, { useState } from 'react';
import { BarChart, PieChart, FileText, Download, Calendar, TrendingUp, Fuel, Car, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '2024-06-01',
    endDate: '2024-07-01',
  });

  const reportTypes = [
    {
      id: 'vehicles',
      title: 'Rapport Véhicules',
      description: 'État de la flotte, utilisation, statuts',
      icon: Car,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'fuel',
      title: 'Rapport Carburant',
      description: 'Consommation, coûts, tendances',
      icon: Fuel,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'maintenance',
      title: 'Rapport Maintenance',
      description: 'Interventions, coûts, planification',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'violations',
      title: 'Rapport Contraventions',
      description: 'Infractions, amendes, statistiques',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'financial',
      title: 'Rapport Financier',
      description: 'Coûts globaux, budget, ROI',
      icon: BarChart,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'gps',
      title: 'Rapport GPS',
      description: 'Trajets, distances, utilisation',
      icon: PieChart,
      color: 'bg-indigo-100 text-indigo-600',
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

  const handleGenerateReport = (reportType: string) => {
    console.log(`Génération du rapport ${reportType} pour la période ${dateRange.startDate} - ${dateRange.endDate}`);
    alert(`Rapport ${reportType} généré avec succès!\nPériode: ${dateRange.startDate} - ${dateRange.endDate}`);
  };

  const handleExportAll = () => {
    alert('Export de tous les rapports en cours...');
  };

  return (
    <div className="p-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-foreground mb-2">Rapports et Analyses</h2>
          <p className="text-muted-foreground">Générez des rapports détaillés sur votre flotte</p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-auto"
            />
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-auto"
            />
          </div>
          <Button onClick={handleExportAll} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter tout
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="fleet-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} ce mois
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Types de rapports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="fleet-card">
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleGenerateReport(report.id)}
                    size="sm" 
                    className="fleet-button-primary"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Rapports récents */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Rapports récents</h3>
          <Button variant="outline" size="sm">
            Voir tout
          </Button>
        </div>
        
        <div className="space-y-3">
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
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.type} • {report.size} • {new Date(report.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  Voir
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
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
