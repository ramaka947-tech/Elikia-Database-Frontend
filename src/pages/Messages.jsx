// Responsable : Rama
// Messagerie : /messages (liste des discussions) et /messages/:id (une discussion).
// - Client : ses discussions avec l'équipe, bouton « Nouvelle discussion ».
// - Admin  : toutes les discussions des utilisateurs, il y répond.
// Ordinateur : liste à gauche + discussion à droite. Téléphone : la liste, puis la discussion en plein écran.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MessageSquarePlus, MessagesSquare, ArrowLeft, Send, Search } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { refreshUnread } from '../utils/useUnreadMessages';
import Button from '../components/ui/Button';
import NewConversationModal from '../components/messages/NewConversationModal';

const time = (d) => new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
function shortDate(d) {
  const date = new Date(d);
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return time(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}
const longDate = (d) => new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
const initials = (name = '?') => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

/* ---------- Liste des discussions ---------- */
function ConversationList({ conversations, activeId, isAdmin, onNew, loading }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const shown = conversations.filter(
    (c) => !q || c.subject.toLowerCase().includes(q) || (isAdmin && c.user_name.toLowerCase().includes(q))
  );

  return (
    <div className="flex flex-col min-h-0 h-full">
      <div className="p-4 border-b border-line space-y-3">
        {!isAdmin && (
          <Button onClick={onNew} className="w-full h-11">
            <MessageSquarePlus size={18} /> Nouvelle discussion
          </Button>
        )}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isAdmin ? 'Rechercher (sujet, utilisateur)' : 'Rechercher une discussion'}
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto divide-y divide-line">
        {loading && <li className="p-5 text-sm text-slate-500">Chargement...</li>}
        {!loading && shown.length === 0 && (
          <li className="p-6 text-center text-sm text-slate-500">
            {conversations.length === 0
              ? isAdmin ? 'Aucun message reçu pour le moment.' : "Vous n'avez pas encore de discussion."
              : 'Aucune discussion ne correspond.'}
          </li>
        )}
        {shown.map((c) => {
          const active = c.id === activeId;
          const mine = (c.last_sender_role === 'ADMIN') === isAdmin;
          return (
            <li key={c.id}>
              <Link
                to={`/messages/${c.id}`}
                className={`flex gap-3 px-4 py-3.5 transition-colors ${active ? 'bg-elikia-light' : 'hover:bg-slate-50'}`}
              >
                <span className="w-10 h-10 shrink-0 rounded-full bg-navy text-gold text-sm font-semibold flex items-center justify-center">
                  {isAdmin ? initials(c.user_name) : <MessagesSquare size={18} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className={`truncate text-sm ${c.unread ? 'font-bold text-ink' : 'font-semibold text-ink'}`}>
                      {isAdmin ? c.user_name : c.subject}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-400">{shortDate(c.updated_at)}</span>
                  </span>
                  {isAdmin && <span className="block truncate text-xs font-medium text-navy/80">{c.subject}</span>}
                  <span className="flex items-center justify-between gap-2">
                    <span className={`truncate text-xs ${c.unread ? 'text-ink' : 'text-slate-500'}`}>
                      {mine && 'Vous : '}{c.last_body}
                    </span>
                    {c.unread > 0 && (
                      <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-elikia text-white text-[11px] font-bold flex items-center justify-center">
                        {c.unread}
                      </span>
                    )}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------- Une discussion ---------- */
function Thread({ id, isAdmin, onSent }) {
  const { user } = useAuth();
  const [conv, setConv] = useState(null);
  const [error, setError] = useState('');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bottom = useRef(null);

  const load = useCallback(() =>
    api.get(`/messages/conversations/${id}`)
      .then(({ data }) => { setConv(data); setError(''); refreshUnread(); })
      .catch((err) => setError(err.response?.status === 404 ? 'Discussion introuvable.' : 'Impossible de charger la discussion.')),
  [id]);

  // Chargement + nouvelles réponses toutes les 10 secondes
  useEffect(() => {
    setConv(null);
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [load]);

  const count = conv?.messages.length || 0;
  useEffect(() => {
    bottom.current?.scrollIntoView({ block: 'end' });
  }, [count]);

  async function send(e) {
    e?.preventDefault();
    const body = text.trim();
    if (!body || sending) return;
    setSending(true);
    setSendError('');
    try {
      const { data } = await api.post(`/messages/conversations/${id}/messages`, { body });
      setConv((c) => ({ ...c, messages: [...c.messages, { ...data, sender_name: user?.name }] }));
      setText('');
      onSent();
    } catch (err) {
      setSendError(err.response?.data?.message || "Envoi impossible.");
    } finally {
      setSending(false);
    }
  }

  // Entrée = envoyer, Maj + Entrée = retour à la ligne
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (error) return <p className="m-6 text-red-600 bg-red-50 rounded-2xl px-5 py-4">{error}</p>;
  if (!conv) return <p className="m-6 text-slate-500">Chargement de la discussion...</p>;

  let lastDay = '';
  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* En-tête */}
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-line">
        <Link to="/messages" className="lg:hidden -ml-1 p-2 rounded-full text-slate-500 hover:bg-slate-100" aria-label="Retour aux discussions">
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <p className="font-semibold text-navy truncate">{conv.subject}</p>
          <p className="text-xs text-slate-500 truncate">
            {isAdmin ? `${conv.user_name} · ${conv.user_email}` : "Avec l'équipe Elikia Database"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-cream">
        {conv.messages.map((m) => {
          const mine = m.sender_id === user?.id;
          const day = longDate(m.created_at);
          const showDay = day !== lastDay;
          lastDay = day;
          // Nom affiché au-dessus des messages des autres
          const who = m.sender_role === 'ADMIN' ? (isAdmin ? m.sender_name || 'Administrateur' : 'Équipe Elikia') : conv.user_name;
          return (
            <div key={m.id}>
              {showDay && <p className="text-center text-[11px] text-slate-400 my-2 first-letter:uppercase">{day}</p>}
              <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 ${mine ? 'bg-elikia text-white rounded-br-md' : 'bg-white border border-line text-ink rounded-bl-md'}`}>
                  {!mine && <p className="text-[11px] font-semibold text-elikia-dark mb-0.5">{who}</p>}
                  <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
                  <p className={`text-[10px] mt-1 text-right ${mine ? 'text-white/70' : 'text-slate-400'}`}>{time(m.created_at)}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottom} />
      </div>

      {/* Réponse */}
      <form onSubmit={send} className="border-t border-line p-3 sm:p-4 bg-white">
        {sendError && <p className="mb-2 text-xs text-red-600">{sendError}</p>}
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Écrire un message..."
            aria-label="Votre message"
            className="flex-1 max-h-32 min-h-11 rounded-2xl border border-line bg-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-elikia/30 focus:border-elikia"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="w-11 h-11 shrink-0 rounded-full bg-elikia text-white flex items-center justify-center hover:bg-elikia-dark disabled:opacity-50"
            aria-label="Envoyer"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Messages() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [creating, setCreating] = useState(false);

  const loadList = useCallback(() =>
    api.get('/messages/conversations')
      .then(({ data }) => { setConversations(data); setLoadError(''); })
      .catch(() => setLoadError('Impossible de charger les discussions.'))
      .finally(() => setLoading(false)),
  []);

  // Liste rechargée à l'ouverture d'une discussion et toutes les 30 secondes
  useEffect(() => {
    loadList();
    const timer = setInterval(loadList, 30000);
    return () => clearInterval(timer);
  }, [loadList, id]);

  function handleCreated(newId) {
    setCreating(false);
    loadList();
    navigate(`/messages/${newId}`);
  }

  return (
    <>
      {loadError && <p className="mb-4 text-red-600 bg-red-50 rounded-2xl px-5 py-4">{loadError}</p>}

      {/* Hauteur = écran moins la barre du haut, le titre (téléphone) et la barre du bas (téléphone) */}
      <div
        className={`bg-white rounded-3xl border border-line overflow-hidden grid lg:grid-cols-[22rem_minmax(0,1fr)] min-h-[24rem] sm:h-[calc(100dvh-9.5rem)] lg:h-[calc(100dvh-10.5rem)] ${
          id ? 'h-[calc(100dvh-13.5rem)]' : 'h-[calc(100dvh-19rem)]'
        }`}
      >
        {/* Liste : toujours visible sur ordinateur ; sur téléphone seulement sans discussion ouverte */}
        <aside className={`${id ? 'hidden lg:flex' : 'flex'} flex-col min-h-0 lg:border-r border-line`}>
          <ConversationList
            conversations={conversations}
            activeId={id}
            isAdmin={isAdmin}
            onNew={() => setCreating(true)}
            loading={loading}
          />
        </aside>

        <section className={`${id ? 'flex' : 'hidden lg:flex'} flex-col min-h-0`}>
          {id ? (
            <Thread key={id} id={id} isAdmin={isAdmin} onSent={loadList} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-elikia-light text-elikia flex items-center justify-center">
                <MessagesSquare size={30} />
              </div>
              <p className="mt-4 font-serif text-2xl text-navy">Vos messages</p>
              <p className="mt-1 text-sm text-slate-500 max-w-sm">
                {isAdmin
                  ? 'Choisissez une discussion à gauche pour lire et répondre.'
                  : "Choisissez une discussion, ou écrivez à l'équipe avec « Nouvelle discussion »."}
              </p>
            </div>
          )}
        </section>
      </div>

      {!isAdmin && <NewConversationModal open={creating} onClose={() => setCreating(false)} onCreated={handleCreated} />}
    </>
  );
}
