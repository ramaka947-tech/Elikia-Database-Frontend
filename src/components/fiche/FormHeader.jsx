import React from 'react';

export default function FormHeader({ isEditMode }) {
    return (
        <div className="mb-6 pb-4 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Modifier l’entreprise' : 'Ajouter une nouvelle entreprise'}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
                Remplissez les informations clés de l'entreprise pour la base Elikia.
            </p>
        </div>
    );
}