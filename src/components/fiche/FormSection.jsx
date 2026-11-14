import React from 'react';

export default function FormSection({ title, children }) {
    return (
        <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 space-y-4">
            <h3 className="text-md font-semibold text-gray-800">{title}</h3>
            {children}
        </div>
    );
}