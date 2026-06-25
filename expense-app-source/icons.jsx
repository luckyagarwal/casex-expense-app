// Minimal stroke icons for the glass app. 1.5px stroke, white.
const Icon = ({ name, size = 18, color = 'currentColor', strokeWidth = 1.6 }) => {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':       return <svg {...props}><path d="M3 11l9-8 9 8"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>;
    case 'list':       return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6"  r="1.2" fill={color} stroke="none"/><circle cx="4" cy="12" r="1.2" fill={color} stroke="none"/><circle cx="4" cy="18" r="1.2" fill={color} stroke="none"/></svg>;
    case 'analytics':  return <svg {...props}><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>;
    case 'search':     return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case 'plus':       return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'bell':       return <svg {...props}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7z"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case 'settings':   return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.13-1.34l2.07-1.61-2-3.46-2.43.97a7 7 0 0 0-2.32-1.34L13.9 2.5h-4l-.29 2.72a7 7 0 0 0-2.32 1.34l-2.43-.97-2 3.46 2.07 1.61A7 7 0 0 0 4.8 12c0 .46.05.91.13 1.34L2.86 14.95l2 3.46 2.43-.97a7 7 0 0 0 2.32 1.34l.29 2.72h4l.29-2.72a7 7 0 0 0 2.32-1.34l2.43.97 2-3.46-2.07-1.61c.08-.43.13-.88.13-1.34z"/></svg>;
    case 'arrow-right':return <svg {...props}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case 'arrow-up-right':return <svg {...props}><path d="M7 17L17 7"/><path d="M8 7h9v9"/></svg>;
    case 'arrow-down-left':return <svg {...props}><path d="M17 7L7 17"/><path d="M16 17H7V8"/></svg>;
    case 'arrow-left': return <svg {...props}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;
    case 'chevron-right': return <svg {...props}><path d="M9 6l6 6-6 6"/></svg>;
    case 'send':       return <svg {...props}><path d="M3 11l18-7-7 18-2-8z"/></svg>;
    case 'swap':       return <svg {...props}><path d="M7 7h12M7 7l3-3M7 7l3 3"/><path d="M17 17H5M17 17l-3-3M17 17l-3 3"/></svg>;
    case 'wallet':     return <svg {...props}><path d="M3 7a2 2 0 0 1 2-2h14v4"/><path d="M19 9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z"/><circle cx="16" cy="14" r="1.2" fill={color} stroke="none"/></svg>;
    case 'eye':        return <svg {...props}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'filter':     return <svg {...props}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'calendar':   return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>;
    case 'check':      return <svg {...props}><path d="M5 12l5 5L20 7"/></svg>;
    case 'x':          return <svg {...props}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case 'trend-up':   return <svg {...props}><path d="M3 17l6-6 4 4 7-7"/><path d="M14 8h6v6"/></svg>;
    case 'card':       return <svg {...props}><rect x="2.5" y="6" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h3"/></svg>;
    case 'sun':        return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case 'moon':       return <svg {...props}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
    case 'palette':    return <svg {...props}><path d="M12 2a10 10 0 1 0 0 20 2.5 2.5 0 0 0 2.5-2.5c0-.7-.3-1.3-.7-1.8-.4-.4-.7-1-.7-1.7a2.5 2.5 0 0 1 2.5-2.5H18a4 4 0 0 0 4-4c0-4.4-4.5-8-10-8z"/><circle cx="7.5" cy="10.5" r="1.2" fill={color} stroke="none"/><circle cx="12" cy="7" r="1.2" fill={color} stroke="none"/><circle cx="16.5" cy="10.5" r="1.2" fill={color} stroke="none"/></svg>;
    case 'sparkles':   return <svg {...props}><path d="M12 3l1.8 4.6L18 9l-4.2 1.4L12 15l-1.8-4.6L6 9l4.2-1.4L12 3z"/><path d="M19 14l.9 2.3L22 17l-2.1.7L19 20l-.9-2.3L16 17l2.1-.7L19 14z"/></svg>;
    case 'edit':       return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
    case 'clock':      return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>;
    case 'mic':        return <svg {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;
    case 'mic-off':    return <svg {...props}><line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 11v-1"/><path d="M5 10v1a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><line x1="12" x2="12" y1="19" y2="22"/></svg>;
    case 'keyboard':   return <svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="6" y1="8" x2="6" y2="8.01"/><line x1="10" y1="8" x2="10" y2="8.01"/><line x1="14" y1="8" x2="14" y2="8.01"/><line x1="18" y1="8" x2="18" y2="8.01"/><line x1="6" y1="12" x2="6" y2="12.01"/><line x1="18" y1="12" x2="18" y2="12.01"/><line x1="7" y1="16" x2="17" y2="16"/><line x1="10" y1="12" x2="10" y2="12.01"/><line x1="14" y1="12" x2="14" y2="12.01"/></svg>;
    default: return null;
  }
};

Object.assign(window, { Icon });
