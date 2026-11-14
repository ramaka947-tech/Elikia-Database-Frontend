import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

export default function CompanyHeader({ company, onArchive, onDelete }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                    <Badge variant={company.status === 'actif' ? 'success' : 'warning'}>
                        {company.status || 'actif'}
                    </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">{company.legal_name} • {company.sector_name || 'Secteur non défini'}</p>
            </div>

            {/* Actions Administrateur */}
            <div className="flex items-center gap-2 flex-wrap">
                <Button 
                    variant="outline" 
                    onClick={() => navigate(`/companies/${company.id}/edit`)}
                >
                    Modifier
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={onArchive}
                >
                    {company.status === 'inactif' ? 'Désarchiver' : 'Archiver'}
                </Button>
                <Button 
                    variant="danger" 
                    onClick={onDelete}
                >
                    Supprimer
                </Button>
            </div>
        </div>
    );
}