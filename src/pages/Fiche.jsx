import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Bookmark, CircleCheck, Database, Download, Globe, Linkedin, Lock,
    Mail, MapPin, Pencil, Phone, Sparkles, Trash2, UserRoundCheck,
} from 'lucide-react';
import api from '../api/client';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const STATUS = {
    actif: { label: 'Actif', cls: 'text-emerald-600' },
    inactif: { label: 'Inactif', cls: 'text-amber-600' },
    a_verifier: { label: 'À vérifier', cls: 'text-amber-600' },
};

const fmtDate = (d) => (d ? String(d).slice(0, 10) : 'N/C');

const scoreLevel = (s) =>
    s >= 80 ? { label: 'Élevé', bar: 'bg-emerald-600' }
        : s >= 50 ? { label: 'Moyen', bar: 'bg-amber-500' }
            : { label: 'Faible', bar: 'bg-red-500' };

// Export CSV d'une seule fiche (champs simples uniquement)
function downloadCsv(company) {
    const entries = Object.entries(company).filter(([, v]) => v === null || typeof v !== 'object');
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = `${entries.map(([k]) => esc(k)).join(',')}\n${entries.map(([, v]) => esc(v)).join(',')}`;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = `${company.name || 'entreprise'}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
}

/* ------------------------------------------------------------------ */
/* Petits composants réutilisables                                     */
/* ------------------------------------------------------------------ */

const BUTTON_TONES = {
    amber: 'border-amber-300 bg-amber-50/50 text-amber-700 hover:bg-amber-50',
    slate: 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50',
    green: 'border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700',
    red: 'border-red-200 bg-white text-red-600 hover:bg-red-50',
};

function ActionButton({ icon: Icon, tone, children, ...props }) {
    return (
        <button
            type="button"
            className={`flex h-8 items-center gap-1.5 rounded-md border px-3 text-[11px] font-medium ${BUTTON_TONES[tone]}`}
            {...props}
        >
            <Icon className="h-3.5 w-3.5" /> {children}
        </button>
    );
}

function Card({ title, aside, tone = 'white', divider = false, children }) {
    const tones = { white: 'border-gray-200 bg-white', amber: 'border-amber-200 bg-amber-50/60' };
    return (
        <section className={`rounded-xl border p-5 ${tones[tone]}`}>
            <div className={`flex items-center justify-between ${divider ? 'mb-3 border-b border-gray-200 pb-3' : 'mb-4'}`}>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900">{title}</h3>
                {aside}
            </div>
            {children}
        </section>
    );
}

function Tag({ icon: Icon, className = 'text-emerald-600', children }) {
    return (
        <span className={`flex items-center gap-1 text-[11px] ${className}`}>
            <Icon className="h-3 w-3" /> {children}
        </span>
    );
}

function Info({ label, value, mono, italic, upper }) {
    return (
        <div>
            <p className="text-[11px] text-gray-500">{label}</p>
            <p className={`mt-0.5 text-xs font-semibold text-slate-900 ${mono ? 'font-mono tracking-wide' : ''} ${italic ? 'italic' : ''} ${upper ? 'uppercase' : ''}`}>
                {value || 'N/C'}
            </p>
        </div>
    );
}

function Stat({ icon: Icon, label, children }) {
    return (
        <div>
            <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                {Icon && <Icon className="h-3 w-3" />} {label}
            </p>
            <div className="mt-1 text-xs font-semibold text-slate-900">{children}</div>
        </div>
    );
}

function ContactRow({ icon: Icon, label, value, href, text, mono, accent }) {
    let content = <span className="text-gray-400">N/C</span>;
    if (value) {
        const cls = `text-xs ${mono ? 'font-mono' : ''} ${accent ? 'text-emerald-600 hover:underline' : 'font-medium text-slate-900'}`;
        content = href
            ? <a href={href} target="_blank" rel="noreferrer" className={`block truncate ${cls}`}>{text || value}</a>
            : <span className={cls}>{value}</span>;
    }
    return (
        <li className="flex gap-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0">
                <p className="text-[11px] text-gray-500">{label}</p>
                {content}
            </div>
        </li>
    );
}

function ScoreBar({ score }) {
    const { label, bar } = scoreLevel(score);
    return (
        <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                <div className={`h-full ${bar}`} style={{ width: `${Math.min(score, 100)}%` }} />
            </div>
            <span className="font-mono text-[11px] text-emerald-700">{score}%</span>
            <span className="text-[11px] font-normal text-gray-500">({label})</span>
        </div>
    );
}

function PersonRow({ person }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <UserRoundCheck className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-slate-900">
                        {person.full_name}
                        {person.is_primary && <span className="ml-1.5 text-[10px] font-normal text-emerald-600">· Contact principal</span>}
                    </p>
                    <p className="text-[11px] text-gray-500">{person.role || person.title || 'Contact'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-600">
                {person.email && <a href={`mailto:${person.email}`} className="underline">{person.email}</a>}
                {person.linkedin_url && (
                    <a href={person.linkedin_url} target="_blank" rel="noreferrer"><Linkedin className="h-3.5 w-3.5 text-gray-400" /></a>
                )}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const LEGAL_FIELDS = [
    { label: 'Nom commercial', key: 'name' },
    { label: 'Raison sociale', key: 'legal_name', upper: true },
    { label: 'Forme juridique', key: 'legal_form' },
    { label: 'Année de création', key: 'creation_year', mono: true },
    { label: 'NINEA', key: 'ninea', mono: true },
    { label: 'RCCM', key: 'rccm', mono: true },
];

const SIZE_FIELDS = [
    { label: 'Catégorie estimée', key: 'size_category' },
    { label: 'Tranche d’effectif', key: 'employee_range' },
    { label: 'Tranche de CA estimée', key: 'revenue_range' },
];

export default function Fiche() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompany = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/companies/${id}`);
            setCompany(data);
            setError(null);
        } catch (err) {
            console.error('Erreur chargement fiche:', err);
            setError('Impossible de charger les détails de cette entreprise.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCompany(); }, [id]);

    const handleArchive = async () => {
        if (!window.confirm('Voulez-vous vraiment archiver cette entreprise ?')) return;
        try {
            await api.patch(`/companies/${id}/archive`);
            fetchCompany();
        } catch {
            alert('Erreur lors de l’archivage.');
        }
    };

    if (loading) return <div className="p-12 text-center text-gray-500">Chargement de la fiche...</div>;
    if (error) return <div className="p-12 text-center text-red-500">{error}</div>;
    if (!company) return <div className="p-12 text-center text-gray-500">Entreprise introuvable.</div>;

    const status = STATUS[company.status] || STATUS.actif;
    const score = Number(company.confidence_score) || 0;
    const edit = () => navigate(`/companies/${company.id}/edit`);

    // Dirigeants liés, sinon le dirigeant principal saisi dans le formulaire (si la colonne existe)
    const people = company.people?.length
        ? company.people
        : company.primary_contact_name
            ? [{
                id: 'primary', full_name: company.primary_contact_name, role: company.primary_contact_role,
                email: company.primary_contact_email, is_primary: true,
            }]
            : [];

    return (
        <div className="mx-auto max-w-6xl space-y-5 px-4 py-6">
            {/* En-tête */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                            <span className={`flex items-center gap-1 font-medium ${status.cls}`}>
                                <CircleCheck className="h-3.5 w-3.5" /> {status.label}
                            </span>
                            <span>·</span>
                            <span className="font-medium text-slate-800">{company.sector_name || 'Secteur non défini'}</span>
                            {company.sub_sector && (
                                <Fragment><span>/</span><span className="text-emerald-700/70">{company.sub_sector}</span></Fragment>
                            )}
                            {company.business_type && (
                                <Fragment><span>·</span><span>{company.business_type}</span></Fragment>
                            )}
                        </div>
                        <h1 className="mt-3 text-2xl font-bold text-slate-900">{company.name}</h1>
                        {company.legal_name && (
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-gray-500">{company.legal_name}</p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {/* Pas d'API "listes" connue : bouton prêt à être branché */}
                        <ActionButton icon={Bookmark} tone="amber">Dans mes listes</ActionButton>
                        <ActionButton icon={Download} tone="slate" onClick={() => downloadCsv(company)}>Export CSV</ActionButton>
                        <ActionButton icon={Pencil} tone="green" onClick={edit}>Modifier</ActionButton>
                        <ActionButton icon={Trash2} tone="red" onClick={handleArchive}>
                            {company.status === 'inactif' ? 'Désarchiver' : 'Archiver'}
                        </ActionButton>
                    </div>
                </div>

                {company.description && (
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700">{company.description}</p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 md:grid-cols-4">
                    <Stat icon={Database} label="Source principale">{company.source || 'N/C'}</Stat>
                    <Stat label="Score de confiance"><ScoreBar score={score} /></Stat>
                    <Stat label="Dernière vérification"><span className="font-mono">{fmtDate(company.verified_at)}</span></Stat>
                    <Stat label="Dernière mise à jour">
                        <span className="font-mono">{fmtDate(company.updated_at)}</span>
                        {company.updated_by_name && <span className="ml-1 text-[11px] font-normal text-gray-500">par {company.updated_by_name}</span>}
                    </Stat>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Colonne principale */}
                <div className="space-y-5 lg:col-span-2">
                    <Card
                        title="Identité juridique & immatriculation"
                        aside={company.is_legal_verified && <Tag icon={CircleCheck}>Vérifié</Tag>}
                    >
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            {LEGAL_FIELDS.map(({ key, ...f }) => <Info key={key} value={company[key]} {...f} />)}
                        </div>
                    </Card>

                    <Card
                        title="Taille & envergure économique"
                        aside={company.is_size_verified
                            ? <Tag icon={CircleCheck}>Vérifié</Tag>
                            : <Tag icon={Sparkles} className="italic text-gray-400">Estimé</Tag>}
                    >
                        <div className="grid grid-cols-3 gap-x-6">
                            {SIZE_FIELDS.map(({ key, ...f }) => <Info key={key} value={company[key]} mono italic {...f} />)}
                        </div>
                    </Card>

                    <Card
                        title="Dirigeants & personnes clés"
                        divider
                        aside={<span className="text-[11px] text-gray-500">{people.length} profil{people.length > 1 ? 's' : ''}</span>}
                    >
                        {people.length > 0
                            ? <div className="space-y-3">{people.map((p) => <PersonRow key={p.id} person={p} />)}</div>
                            : <p className="text-xs text-gray-500">Aucun dirigeant enregistré pour cette entreprise.</p>}
                    </Card>
                </div>

                {/* Colonne secondaire */}
                <div className="space-y-5">
                    <Card
                        title="Contacts"
                        aside={company.is_contacts_verified && <Tag icon={CircleCheck}>Vérifié</Tag>}
                    >
                        <ul className="space-y-4">
                            <ContactRow icon={Phone} label="Téléphone" value={company.phone} href={`tel:${company.phone}`} mono />
                            <ContactRow icon={Mail} label="Email" value={company.email} href={`mailto:${company.email}`} />
                            <ContactRow icon={Globe} label="Site web" value={company.website} href={company.website} accent />
                            <ContactRow icon={Linkedin} label="LinkedIn" value={company.linkedin_url} href={company.linkedin_url} text="Page LinkedIn entreprise" accent />
                        </ul>
                    </Card>

                    <Card title="Localisation">
                        <div className="flex gap-3">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            <div>
                                <p className="text-xs font-semibold text-slate-900">
                                    {[company.city, company.region && `Région de ${company.region}`].filter(Boolean).join(', ') || 'N/C'}
                                </p>
                                {company.address && <p className="mt-0.5 text-[11px] text-gray-500">{company.address}</p>}
                            </div>
                        </div>
                    </Card>

                    <Card
                        tone="amber"
                        divider
                        title={<><Lock className="h-3.5 w-3.5 text-amber-600" /> Notes internes (Admin)</>}
                        aside={<button type="button" onClick={edit} className="text-[11px] font-medium text-amber-700 hover:underline">Éditer</button>}
                    >
                        <p className="text-[11px] text-gray-500">{company.notes || 'Aucune note interne enregistrée.'}</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
