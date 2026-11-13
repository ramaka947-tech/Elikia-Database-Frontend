// Icône Messages de la barre du haut, avec le nombre de messages non lus (fichier partagé, géré par Rama)
import { Link, useLocation } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';
import useUnreadMessages from '../../utils/useUnreadMessages';

export default function MessagesButton() {
  const unread = useUnreadMessages();
  const { pathname } = useLocation();
  const active = pathname.startsWith('/messages');

  return (
    <Link
      to="/messages"
      className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-colors ${
        active ? 'bg-white/15 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`}
      aria-label={unread ? `Messages, ${unread} non lu${unread > 1 ? 's' : ''}` : 'Messages'}
      title="Messages"
    >
      <MessageSquareText size={22} />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-elikia-bright text-navy text-[11px] font-bold flex items-center justify-center ring-2 ring-navy">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </Link>
  );
}
