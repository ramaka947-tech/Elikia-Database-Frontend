import React from 'react';

export default function CompanyPeopleList({ people }) {
    if (!people || people.length === 0) {
        return <p className="text-sm text-gray-500">Aucun dirigeant ou contact enregistré pour cette entreprise.</p>;
    }

    return (
        <div className="space-y-3">
            {people.map((person) => (
                <div key={person.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                    <div>
                        <p className="font-semibold text-gray-900">{person.full_name}</p>
                        <p className="text-xs text-gray-500">{person.role || person.title || 'Contact'}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600 space-y-1">
                        {person.phone && <div>{person.phone}</div>}
                        {person.email && <div>{person.email}</div>}
                    </div>
                </div>
            ))}
        </div>
    );
}