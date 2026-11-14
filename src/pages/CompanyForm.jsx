import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, CircleCheck, Loader2, Save, X } from 'lucide-react';
import api from '../api/client';

/* ------------------------------------------------------------------ */
/* Données statiques                                                   */
/* ------------------------------------------------------------------ */

const SENEGAL_REGIONS_CITIES = {
    "Dakar": ["Dakar", "Pikine", "Guédiawaye", "Rufisque", "Bargny", "Diamniadio"],
    "Thiès": ["Thiès", "Mbour", "Tivaouane", "Joal-Fadiouth", "Khombole"],
    "Saint-Louis": ["Saint-Louis", "Richard-Toll", "Dagana", "Podor"],
    "Ziguinchor": ["Ziguinchor", "Bignona", "Oussouye"],
    "Kaolack": ["Kaolack", "Nioro du Rip", "Guinguinéo"],
    "Diourbel": ["Diourbel", "Touba", "Mbacké"],
    "Fatick": ["Fatick", "Foundiougne", "Gossas"],
    "Kaffrine": ["Kaffrine", "Birkelane", "Koungheul", "Malem Hodar"],
    "Kédougou": ["Kédougou", "Saraya", "Salémata"],
    "Kolda": ["Kolda", "Vélingara", "Médina Yoro Foulah"],
    "Louga": ["Louga", "Linguère", "Kébémer"],
    "Matam": ["Matam", "Kanel", "Ourossogui", "Ranérou"],
    "Sédhiou": ["Sédhiou", "Goudomp", "Bounkiling"],
    "Tambacounda": ["Tambacounda", "Bakel", "Goudiry", "Koumpentoum"],
};

const CURRENT_YEAR = new Date().getFullYear();

// Adresse de la page Fiche : à adapter si ta route est différente
const FICHE_PATH = (companyId) => `/companies/${companyId}`;

const DEFAULTS = {
    name: '', legal_name: '', legal_form: 'SARL', creation_year: '', ninea: '', rccm: '',
    sector_id: '', sub_sector: '', business_type: 'B2B', description: '',
    region: 'Dakar', city: 'Dakar', address: '',
    employee_range: '', revenue_range: '', size_category: 'PME',
    primary_contact_name: '', primary_contact_role: '', primary_contact_email: '',
    phone: '', email: '', website: '', linkedin_url: '',
    status: 'actif', source: 'RCCM Dakar & API',
    verified_at: new Date().toISOString().split('T')[0],
    confidence_score: 85,
    is_legal_verified: true, is_contacts_verified: true, is_size_verified: false,
    notes: '',
};

/* ------------------------------------------------------------------ */
/* Description du formulaire (sections → lignes → champs)              */
/* ------------------------------------------------------------------ */

const SECTIONS = [
    {
        title: '1. Identité juridique',
        rows: [
            { cols: 2, fields: [
                { name: 'name', label: 'Nom commercial', required: true, placeholder: 'Ex : Teranga Pay Technologies' },
                { name: 'legal_name', label: 'Raison sociale', placeholder: 'Ex : TERANGA PAY TECHNOLOGIES SAS', checkDuplicate: true },
            ]},
            { cols: 2, fields: [
                { name: 'legal_form', label: 'Forme juridique', options: ['SARL', 'SA', 'SAS', 'SUARL', 'GIE', 'Entreprise Individuelle'] },
                { name: 'creation_year', label: 'Année de création', type: 'number', placeholder: '2021' },
            ]},
            { cols: 2, fields: [
                { name: 'ninea', label: 'NINEA', placeholder: '088452198 263', checkDuplicate: true },
                { name: 'rccm', label: 'RCCM', placeholder: 'SN-DKR-2020-B-14892' },
            ]},
        ],
    },
    {
        title: '2. Activité & localisation',
        rows: [
            { cols: 3, fields: [
                { name: 'sector_id', label: 'Secteur', required: true, options: 'sectors', emptyLabel: 'Sélectionner un secteur' },
                { name: 'sub_sector', label: 'Sous-secteur', required: true, placeholder: 'Fintech & Paiements' },
                { name: 'business_type', label: 'Modèle', required: true, options: ['B2B', 'B2C', 'B2G', 'Mixte'] },
            ]},
            { cols: 1, fields: [
                { name: 'description', label: 'Description courte', required: true, type: 'textarea', rows: 3, maxLength: 500,
                  placeholder: 'Activité principale, produits/services, marché cible...' },
            ]},
            { cols: 3, fields: [
                { name: 'region', label: 'Région', required: true, options: Object.keys(SENEGAL_REGIONS_CITIES) },
                { name: 'city', label: 'Ville', required: true, options: 'cities' },
                { name: 'address', label: 'Adresse', placeholder: 'Avenue, quartier, lot...' },
            ]},
        ],
    },
    {
        title: '3. Taille, dirigeant & contacts',
        rows: [
            { cols: 3, fields: [
                { name: 'size_category', label: 'Taille estimée', options: [
                    { value: 'Micro', label: 'Microentreprise' }, 'TPE', 'PME', 'Grande entreprise'] },
                { name: 'employee_range', label: 'Effectif estimé', emptyLabel: 'Sélectionner', options: [
                    '1 - 9 employés', '10 - 19 employés', '20 - 49 employés', '50 - 249 employés', '250+ employés'] },
                { name: 'revenue_range', label: 'CA estimé', emptyLabel: 'Sélectionner', options: [
                    '< 50M FCFA', '50M - 100M FCFA', '100M - 500M FCFA', '500M+ FCFA'] },
            ]},
            { cols: 3, fields: [
                { name: 'primary_contact_name', label: 'Dirigeant principal', placeholder: 'Nom complet' },
                { name: 'primary_contact_role', label: 'Fonction', placeholder: 'Directeur Général' },
                { name: 'primary_contact_email', label: 'Email dirigeant', type: 'email', placeholder: 'dirigeant@entreprise.sn' },
            ]},
            { cols: 2, fields: [
                { name: 'phone', label: 'Téléphone entreprise', type: 'tel', placeholder: '+221 33 000 00 00' },
                { name: 'email', label: 'Email entreprise', type: 'email', placeholder: 'contact@entreprise.sn' },
            ]},
            { cols: 2, fields: [
                { name: 'website', label: 'Site web', placeholder: 'https://entreprise.sn' },
                { name: 'linkedin_url', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
            ]},
        ],
    },
    {
        title: '4. Qualité des données & notes internes',
        rows: [
            { cols: 4, fields: [
                { name: 'status', label: 'Statut', required: true, options: [
                    { value: 'actif', label: 'Actif' }, { value: 'inactif', label: 'Inactif' },
                    { value: 'a_verifier', label: 'À vérifier' }] },
                { name: 'source', label: 'Source', required: true, options: [
                    'RCCM Dakar & API', 'Saisie manuelle', 'Import CSV', 'Enquête terrain'] },
                { name: 'verified_at', label: 'Date de vérification', required: true, type: 'date' },
                { name: 'confidence_score', label: 'Score de confiance (0-100)', required: true, type: 'number', min: 0, max: 100 },
            ]},
            { checks: [
                { name: 'is_legal_verified', label: 'Identité légale vérifiée' },
                { name: 'is_contacts_verified', label: 'Contacts vérifiés' },
                { name: 'is_size_verified', label: 'Effectif & CA vérifiés (sinon affichés comme Estimés)' },
            ]},
            { cols: 1, fields: [
                { name: 'notes', label: 'Notes internes (visibles uniquement par les administrateurs)', type: 'textarea', rows: 3, maxLength: 1000,
                  placeholder: 'Commentaires internes sur la qualification...' },
            ]},
        ],
    },
];

const GRID = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };

/* ------------------------------------------------------------------ */
/* Validation et masques de saisie                                     */
/* ------------------------------------------------------------------ */

const isEmpty = (v) => v === '' || v === null || v === undefined;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const emailRule = (v) => !EMAIL_RE.test(v) && 'Adresse email invalide';
const urlRule = (v) => {
    try { return !['http:', 'https:'].includes(new URL(v).protocol) && 'URL invalide (ex : https://entreprise.sn)'; }
    catch { return 'URL invalide (ex : https://entreprise.sn)'; }
};

// Chaque règle renvoie un message d'erreur, ou false si la valeur est correcte
const RULES = {
    ninea: (v) => !/^[A-Za-z0-9 ]{7,15}$/.test(v) && 'NINEA invalide (7 à 15 caractères, lettres et chiffres)',
    rccm: (v) => !/^[A-Za-z0-9./\- ]{5,30}$/.test(v) && 'RCCM invalide (ex : SN-DKR-2020-B-14892)',
    creation_year: (v) => (!Number.isInteger(Number(v)) || Number(v) < 1900 || Number(v) > CURRENT_YEAR) && `Année comprise entre 1900 et ${CURRENT_YEAR}`,
    email: emailRule,
    primary_contact_email: emailRule,
    phone: (v) => String(v).replace(/\D/g, '').length !== 12 && 'Téléphone invalide (ex : +221 77 123 45 67)',
    website: urlRule,
    linkedin_url: urlRule,
    confidence_score: (v) => (Number(v) < 0 || Number(v) > 100) && 'Le score doit être compris entre 0 et 100',
};

function validate(field, value) {
    if (field.required && isEmpty(value)) return 'Ce champ est obligatoire';
    if (!isEmpty(value) && RULES[field.name]) return RULES[field.name](value) || null;
    return null;
}

// Formate le téléphone pendant la frappe : +221 77 123 45 67
function maskPhone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length <= 3 && '221'.startsWith(digits)) return '';
    const d = (digits.startsWith('221') ? digits.slice(3) : digits).slice(0, 9);
    return `+221 ${[d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ')}`;
}

const MASKS = { phone: maskPhone };

/* ------------------------------------------------------------------ */
/* Composants                                                          */
/* ------------------------------------------------------------------ */

const controlBase =
    'w-full rounded-md border bg-white px-3 text-xs text-gray-900 placeholder:text-gray-400 ' +
    'placeholder:font-mono focus:outline-none focus:ring-1';

function Field({ field, value, error, duplicate, onChange, onBlur, options }) {
    const { name, label, required, type = 'text', placeholder, emptyLabel, rows, min, max, maxLength } = field;
    const common = {
        id: name, name, value: value ?? '', onChange, onBlur,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? `${name}-error` : undefined,
    };
    const state = error
        ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500';
    const cls = `${controlBase} ${state}`;

    let control;
    if (options) {
        control = (
            <div className="relative">
                <select {...common} className={`${cls} h-9 appearance-none pr-8`}>
                    {emptyLabel && <option value="">{emptyLabel}</option>}
                    {options.map((o) => {
                        const { value: v, label: l } = typeof o === 'string' ? { value: o, label: o } : o;
                        return <option key={v} value={v}>{l}</option>;
                    })}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-800" />
            </div>
        );
    } else if (type === 'textarea') {
        control = <textarea {...common} rows={rows} maxLength={maxLength} placeholder={placeholder} className={`${cls} resize-y py-2`} />;
    } else {
        control = <input {...common} type={type} min={min} max={max} placeholder={placeholder} className={`${cls} h-9`} />;
    }

    return (
        <div>
            <label htmlFor={name} className="mb-1 block text-[11px] font-medium text-gray-600">
                {label}{required && ' *'}
            </label>
            {control}
            {error && <p id={`${name}-error`} role="alert" className="mt-1 text-[11px] text-red-600">{error}</p>}
            {!error && duplicate && (
                <p className="mt-1 text-[11px] text-amber-700">
                    Une fiche existe déjà : <strong>{duplicate.name}</strong>{' '}
                    <Link to={FICHE_PATH(duplicate.id)} target="_blank" className="underline">Voir</Link>
                </p>
            )}
            {maxLength && (
                <p className="mt-1 text-right text-[10px] text-gray-400">{String(value ?? '').length}/{maxLength}</p>
            )}
        </div>
    );
}

function Checkbox({ name, label, checked, onChange }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-700">
            <input
                type="checkbox" name={name} checked={Boolean(checked)} onChange={onChange}
                className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            {label}
        </label>
    );
}

function Section({ title, children }) {
    return (
        <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
            {children}
        </section>
    );
}

function FormSkeleton() {
    return (
        <div className="mx-auto max-w-4xl animate-pulse space-y-5 px-4 py-8" aria-busy="true">
            <div className="h-6 w-72 rounded bg-gray-200" />
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-xl border border-gray-200 bg-gray-100" />)}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function CompanyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [sectors, setSectors] = useState([]);
    const [columns, setColumns] = useState(null); // colonnes réellement présentes en base (null = inconnu)
    const [formData, setFormData] = useState(DEFAULTS);
    const [initial, setInitial] = useState(JSON.stringify(DEFAULTS));
    const [errors, setErrors] = useState({});
    const [duplicates, setDuplicates] = useState({});
    const [serverError, setServerError] = useState(null);
    const [pageLoading, setPageLoading] = useState(isEditMode);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const dirty = JSON.stringify(formData) !== initial && !success;
    const cities = SENEGAL_REGIONS_CITIES[formData.region] || [];

    const optionsFor = (field) => {
        if (field.options === 'sectors') return sectors.map((s) => ({ value: s.id, label: s.name }));
        if (field.options === 'cities') return cities;
        return field.options;
    };

    // Masque les champs que la base ne sait pas encore enregistrer
    const sections = useMemo(() => {
        if (!columns) return SECTIONS;
        return SECTIONS
            .map((s) => ({
                ...s,
                rows: s.rows
                    .map((r) => (r.checks
                        ? { ...r, checks: r.checks.filter((c) => columns.includes(c.name)) }
                        : { ...r, fields: r.fields.filter((f) => columns.includes(f.name)) }))
                    .filter((r) => (r.checks || r.fields).length > 0),
            }))
            .filter((s) => s.rows.length > 0);
    }, [columns]);

    const visibleFields = useMemo(
        () => sections.flatMap((s) => s.rows.flatMap((r) => r.fields || [])),
        [sections]
    );

    /* Chargement initial */
    useEffect(() => {
        (async () => {
            try {
                const { data: sectorList } = await api.get('/sectors');
                setSectors(sectorList);

                if (isEditMode) {
                    const { data } = await api.get(`/companies/${id}`);
                    const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v ?? DEFAULTS[k] ?? '']));
                    const merged = { ...DEFAULTS, ...clean, verified_at: String(clean.verified_at || '').slice(0, 10) };
                    setFormData(merged);
                    setInitial(JSON.stringify(merged));
                }
            } catch (err) {
                console.error('Erreur chargement:', err);
                setServerError('Impossible de charger les données du formulaire.');
            } finally {
                setPageLoading(false);
            }
        })();

        // Si la route n'existe pas encore, on affiche simplement tous les champs
        api.get('/companies/columns').then(({ data }) => setColumns(data)).catch(() => {});
    }, [id, isEditMode]);

    /* Alerte du navigateur si on ferme l'onglet avec des modifications */
    useEffect(() => {
        if (!dirty) return undefined;
        const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
        window.addEventListener('beforeunload', warn);
        return () => window.removeEventListener('beforeunload', warn);
    }, [dirty]);

    /* Saisie */
    const handleChange = ({ target }) => {
        const { name, type, checked } = target;
        const value = MASKS[name] ? MASKS[name](target.value) : target.value;

        setFormData((prev) => {
            const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
            if (name === 'region') next.city = SENEGAL_REGIONS_CITIES[value]?.[0] || '';
            return next;
        });
        if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
        if (duplicates[name]) setDuplicates((d) => ({ ...d, [name]: null }));
    };

    /* Validation à la sortie du champ + détection de doublon */
    const handleBlur = async ({ target: { name, value } }) => {
        const field = visibleFields.find((f) => f.name === name);
        if (!field) return;

        const message = validate(field, value);
        setErrors((e) => ({ ...e, [name]: message }));

        if (field.checkDuplicate && !message && !isEmpty(value)) {
            try {
                const { data } = await api.get('/companies/check', { params: { [name]: value.trim(), exclude: id } });
                setDuplicates((d) => ({ ...d, [name]: data.duplicate }));
            } catch {
                /* route absente ou erreur réseau : on ignore, le serveur contrôlera à l'enregistrement */
            }
        }
    };

    const handleCancel = () => {
        if (dirty && !window.confirm('Quitter sans enregistrer ? Les modifications seront perdues.')) return;
        navigate(-1); // retour à la page précédente
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);

        const found = {};
        visibleFields.forEach((f) => { found[f.name] = validate(f, formData[f.name]); });
        setErrors(found);
        const firstInvalid = visibleFields.find((f) => found[f.name]);
        if (firstInvalid) {
            document.getElementById(firstInvalid.name)?.focus();
            return;
        }

        setLoading(true);
        // Nettoyage : espaces superflus, '' → null, conversion des nombres
        const cleaned = Object.fromEntries(
            Object.entries(formData).map(([k, v]) => {
                const val = typeof v === 'string' ? v.trim() : v;
                return [k, val === '' ? null : val];
            })
        );
        const payload = {
            ...cleaned,
            sector_id: cleaned.sector_id ? Number(cleaned.sector_id) : null,
            creation_year: cleaned.creation_year ? Number(cleaned.creation_year) : null,
            confidence_score: cleaned.confidence_score ? Number(cleaned.confidence_score) : 85,
            status: (cleaned.status || 'actif').toLowerCase(),
        };

        try {
            const { data } = isEditMode
                ? await api.put(`/companies/${id}`, payload)
                : await api.post('/companies', payload);

            setSuccess(true);
            const flash = isEditMode ? 'Fiche mise à jour avec succès' : 'Fiche créée avec succès';
            // Direction la fiche qui vient d'être créée / modifiée (le répertoire n'est pas encore prêt)
            const companyId = data?.id ?? id;
            const target = companyId ? FICHE_PATH(companyId) : '/repertoire';
            setTimeout(() => navigate(target, { state: { flash } }), 800);
        } catch (err) {
            console.error('Erreur sauvegarde:', err.response?.data || err);
            const message = err.response?.data?.error;
            // Doublon détecté par le serveur : on l'affiche sous le champ concerné
            const key = err.response?.status === 409 ? (/NINEA/i.test(message) ? 'ninea' : /RCCM/i.test(message) ? 'rccm' : null) : null;
            if (key) {
                setErrors((prev) => ({ ...prev, [key]: message }));
                document.getElementById(key)?.focus();
            } else {
                setServerError(message || 'Une erreur est survenue lors de l’enregistrement.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <FormSkeleton />;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-5">
                <h1 className="text-lg font-bold text-gray-900">
                    {isEditMode ? 'Modifier la fiche entreprise' : 'Créer une nouvelle fiche entreprise'}
                </h1>
                <p className="mt-1 text-[11px] text-slate-500">
                    Contrôle automatique des doublons sur NINEA et raison sociale. La date de modification est enregistrée automatiquement.
                </p>
            </div>

            <form id="company-form" onSubmit={handleSubmit} noValidate className="space-y-5">
                {sections.map((section) => (
                    <Section key={section.title} title={section.title}>
                        {section.rows.map((row, i) =>
                            row.checks ? (
                                <div key={i} className="flex flex-wrap gap-x-6 gap-y-2">
                                    {row.checks.map((c) => (
                                        <Checkbox key={c.name} {...c} checked={formData[c.name]} onChange={handleChange} />
                                    ))}
                                </div>
                            ) : (
                                <div key={i} className={`grid grid-cols-1 gap-4 ${GRID[Math.min(row.cols, row.fields.length)]}`}>
                                    {row.fields.map((f) => (
                                        <Field
                                            key={f.name} field={f} value={formData[f.name]}
                                            error={errors[f.name]} duplicate={duplicates[f.name]}
                                            onChange={handleChange} onBlur={handleBlur} options={optionsFor(f)}
                                        />
                                    ))}
                                </div>
                            )
                        )}
                    </Section>
                ))}

                {/* Barre d'actions fixe en bas de l'écran */}
                <div className="sticky bottom-0 -mx-4 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur">
                    <div className="min-w-0 text-[11px]" aria-live="polite">
                        {success ? (
                            <span className="flex items-center gap-1.5 font-medium text-emerald-600">
                                <CircleCheck className="h-3.5 w-3.5" />
                                {isEditMode ? 'Fiche mise à jour avec succès' : 'Fiche créée avec succès'}
                            </span>
                        ) : serverError ? (
                            <span role="alert" className="text-red-600">{serverError}</span>
                        ) : dirty ? (
                            <span className="flex items-center gap-1.5 text-amber-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Modifications non enregistrées
                            </span>
                        ) : null}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button" onClick={handleCancel} disabled={success}
                            className="flex h-9 items-center gap-1.5 rounded-md border border-gray-300 bg-white px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        >
                            <X className="h-3.5 w-3.5" /> Annuler
                        </button>
                        <button
                            type="submit" disabled={loading || success}
                            className="flex h-9 items-center gap-1.5 rounded-md bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                            {loading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer la fiche'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
