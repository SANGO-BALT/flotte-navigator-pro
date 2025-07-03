
import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Download, Eye, Edit, Trash, Upload, Folder, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { FleetDatabase } from '@/services/fleetDatabase';
import { Document } from '@/types/fleet';
import DocumentModal from './DocumentModal';

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = () => {
    const docs = FleetDatabase.getDocuments();
    setDocuments(docs);
  };

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
    const matchesSearch = doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.vehiculeId && doc.vehiculeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || doc.type === categoryFilter;
    
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

  const handleView = (document: Document) => {
    alert(`Ouverture du document: ${document.nom}`);
  };

  const handleDownload = (document: Document) => {
    alert(`Téléchargement de: ${document.nom}`);
  };

  const handleEdit = (document: Document) => {
    setEditingDocument(document);
    setShowModal(true);
  };

  const handleDelete = (documentId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      FleetDatabase.deleteDocument(documentId);
      loadDocuments();
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
    }
  };

  const handleSave = (documentData: Omit<Document, 'id'>) => {
    if (editingDocument) {
      FleetDatabase.updateDocument(editingDocument.id, documentData);
      toast({
        title: "Document modifié",
        description: "Le document a été modifié avec succès.",
      });
    } else {
      FleetDatabase.addDocument({
        ...documentData,
        id: Date.now().toString(),
        dateCreation: new Date().toISOString().split('T')[0],
      });
      toast({
        title: "Document ajouté",
        description: "Le nouveau document a été enregistré avec succès.",
      });
    }
    loadDocuments();
    setEditingDocument(null);
  };

  const getStatusFromDate = (expiryDate?: string) => {
    if (!expiryDate) return 'valide';
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'expire';
    if (diffDays <= 30) return 'bientot-expire';
    return 'valide';
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(documents, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `documents_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({
      title: "Export réussi",
      description: "Les documents ont été exportés avec succès.",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedData)) {
            importedData.forEach(doc => {
              FleetDatabase.addDocument({
                ...doc,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              });
            });
            loadDocuments();
            toast({
              title: "Import réussi",
              description: `${importedData.length} documents importés avec succès.`,
            });
          }
        } catch (error) {
          toast({
            title: "Erreur d'import",
            description: "Le fichier n'est pas au bon format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
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
            {documents.filter(d => getStatusFromDate(d.dateExpiration) === 'valide').length}
          </p>
          <p className="text-sm text-muted-foreground">Valides</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {documents.filter(d => getStatusFromDate(d.dateExpiration) === 'bientot-expire').length}
          </p>
          <p className="text-sm text-muted-foreground">Bientôt expirés</p>
        </div>
        <div className="fleet-card text-center">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {documents.filter(d => getStatusFromDate(d.dateExpiration) === 'expire').length}
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
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importer
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => {
            const IconComponent = categoryIcons[document.type] || FileText;
            const currentStatus = getStatusFromDate(document.dateExpiration);
            
            return (
              <div key={document.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground text-sm">{document.nom}</h4>
                      <p className="text-xs text-muted-foreground">{document.type} • {document.taille}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[currentStatus]}`}>
                    {statusLabels[currentStatus]}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {document.vehiculeId && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Véhicule:</span>
                      <span className="text-xs font-mono font-medium text-foreground">{document.vehiculeId}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Expire: {document.dateExpiration ? new Date(document.dateExpiration).toLocaleDateString('fr-FR') : 'N/A'}
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
                    {document.dateCreation ? new Date(document.dateCreation).toLocaleDateString('fr-FR') : ''}
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
