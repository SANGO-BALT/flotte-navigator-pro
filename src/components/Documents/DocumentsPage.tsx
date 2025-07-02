
import React, { useState } from 'react';
import { Search, Plus, FileText, Download, Eye, Edit, Trash, Upload, Folder, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DocumentModal from './DocumentModal';

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null);

  const [documents, setDocuments] = useState([
    {
      id: '1',
      name: 'Carte grise AB-123-CD.pdf',
      category: 'carte-grise',
      vehiclePlate: 'AB-123-CD', 
      uploadDate: '2024-06-15',
      expiryDate: '2025-06-15',
      size: '2.3 MB',
      type: 'PDF',
      status: 'valide',
      description: 'Carte grise du véhicule Peugeot 308',
    },
    {
      id: '2',
      name: 'Assurance EF-456-GH.pdf',
      category: 'assurance',
      vehiclePlate: 'EF-456-GH',
      uploadDate: '2024-06-10',
      expiryDate: '2024-12-31',
      size: '1.8 MB',
      type: 'PDF',
      status: 'bientot-expire',
      description: 'Police d\'assurance véhicule',
    },
    {
      id: '3',
      name: 'Permis Jean Dupont.pdf',
      category: 'permis',
      vehiclePlate: '',
      uploadDate: '2024-06-05',
      expiryDate: '2026-03-20',
      size: '1.2 MB',
      type: 'PDF',
      status: 'valide',
      description: 'Permis de conduire Jean Dupont',
    },
    {
      id: '4',
      name: 'Visite technique AB-123-CD.pdf',
      category: 'visite-technique',
      vehiclePlate: 'AB-123-CD',
      uploadDate: '2024-05-20',
      expiryDate: '2024-11-20',
      size: '0.9 MB',
      type: 'PDF',
      status: 'bientot-expire',
      description: 'Certificat de visite technique',
    },
  ]);

  const categories = [
    { value: 'all', label: 'Tous les documents' },
    { value: 'carte-grise', label: 'Cartes grises' },
    { value: 'assurance', label: 'Assurances' },
    { value: 'permis', label: 'Permis de conduire' },
    { value: 'visite-technique', label: 'Visites techniques' },
    { value: 'facture', label: 'Factures' },
    { value: 'contrat', label: 'Contrats' },
    { value: 'autre', label: 'Autres' },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const statusColors = {
    'valide': 'bg-green-100 text-green-800',
    'expire': 'bg-red-100 text-red-800',
    'bientot-expire': 'bg-orange-100 text-orange-800',
  };

  const statusLabels = {
    'valide': 'Valide',
    'expire': 'Expiré',
    'bientot-expire': 'Bientôt expiré',
  };

  const categoryIcons = {
    'carte-grise': FileText,
    'assurance': FileText,
    'permis': FileText,
    'visite-technique': FileText,
    'facture': FileText,
    'contrat': FileText,
    'autre': FileText,
  };

  const handleView = (document) => {
    alert(`Ouverture du document: ${document.name}`);
  };

  const handleDownload = (document) => {
    alert(`Téléchargement de: ${document.name}`);
  };

  const handleEdit = (document) => {
    setEditingDocument(document);
    setShowModal(true);
  };

  const handleDelete = (documentId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
    }
  };

  const handleSave = (documentData) => {
    if (editingDocument) {
      setDocuments(documents.map(doc => 
        doc.id === editingDocument.id 
          ? { ...documentData, id: editingDocument.id }
          : doc
      ));
    } else {
      const newDocument = {
        ...documentData,
        id: Date.now().toString(),
        uploadDate: new Date().toISOString().split('T')[0],
      };
      setDocuments([...documents, newDocument]);
    }
    setEditingDocument(null);
  };

  const getStatusFromDate = (expiryDate) => {
    if (!expiryDate) return 'valide';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expire';
    if (diffDays <= 30) return 'bientot-expire';
    return 'valide';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        
        <Button onClick={() => setShowModal(true)} className="fleet-button-primary">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter document
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="fleet-card text-center">
          <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-foreground">{documents.length}</p>
          <p className="text-sm text-muted-foreground">Total documents</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {documents.filter(d => getStatusFromDate(d.expiryDate) === 'valide').length}
          </p>
          <p className="text-sm text-muted-foreground">Valides</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {documents.filter(d => getStatusFromDate(d.expiryDate) === 'bientot-expire').length}
          </p>
          <p className="text-sm text-muted-foreground">Bientôt expirés</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {documents.filter(d => getStatusFromDate(d.expiryDate) === 'expire').length}
          </p>
          <p className="text-sm text-muted-foreground">Expirés</p>
        </div>
      </div>

      {/* Liste des documents */}
      <div className="fleet-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Gestion Électronique des Documents ({filteredDocuments.length})
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Import en lot
            </Button>
            <Button variant="outline" size="sm">
              Sauvegarder
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => {
            const IconComponent = categoryIcons[document.category] || FileText;
            const currentStatus = getStatusFromDate(document.expiryDate);
            
            return (
              <div key={document.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{document.name}</h4>
                      <p className="text-xs text-muted-foreground">{document.type} • {document.size}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>
                    {statusLabels[currentStatus]}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {document.vehiclePlate && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Véhicule:</span>
                      <span className="text-xs font-mono font-medium text-foreground">{document.vehiclePlate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Expire: {document.expiryDate ? new Date(document.expiryDate).toLocaleDateString('fr-FR') : 'N/A'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{document.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleView(document)} title="Voir">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(document)} title="Télécharger">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(document)} title="Modifier">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)} title="Supprimer">
                      <Trash className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchTerm ? `Aucun document trouvé pour "${searchTerm}"` : 'Aucun document enregistré'}
            </p>
          </div>
        )}
      </div>

      {/* Modal d'ajout/modification de document */}
      {showModal && (
        <DocumentModal
          document={editingDocument}
          onClose={() => {
            setShowModal(false);
            setEditingDocument(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
