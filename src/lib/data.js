export const PROJECTS = [
  {
    id: 'valorcup',
    title: 'Valor Cup',
    kind: 'apps',
    label: 'Live platform',
    blurb:
      'A complete tournament site for a college sports league: points table, fixtures, results, team and player pages, plus admin and captain panels, fan polls and certificates.',
    stack: ['Fast hosting', 'Database', 'Admin roles'],
    url: 'https://valorcup.vercel.app',
    img: '/img/p-valorcup.webp',
    imgWide: '/img/p-valorcup-hd.webp'
  },
  {
    id: 'pizza',
    title: 'Prashant Pizza',
    kind: 'sites',
    label: 'Redesign concept',
    blurb:
      'A redesign concept for a Patna pizza shop, built from its real menu: 20 items, size and topping picker, a cart, and a short 3D intro. Made as a pitch, not a client delivery.',
    stack: ['Fast hosting', 'Real menu', 'Mobile ordering'],
    url: 'https://prashant-pizza-nu.vercel.app',
    img: '/img/p-pizza.webp',
    imgWide: '/img/p-pizza-hd.webp'
  },
  {
    id: 'vanta',
    title: 'VANTA',
    kind: 'apps',
    label: 'Live product',
    blurb:
      'Temporary chat rooms that disappear. Real-time messaging, voice notes and calls in the browser, with nothing stored permanently.',
    stack: ['React', 'Node', 'Socket.IO', 'WebRTC'],
    url: 'https://vanta2-0.vercel.app',
    img: '/img/p-vanta.webp',
    imgWide: '/img/p-vanta-hd.webp'
  },
  {
    id: 'cutbrief',
    title: 'CutBrief',
    kind: 'ai',
    label: 'Our own tool',
    blurb:
      'A small web tool that turns a rough request into a clean brief. A small open-weight AI runs locally, so client messages are never uploaded.',
    stack: ['Local AI', 'Browser', 'Static hosting'],
    url: 'https://sanny1921.github.io/cutbrief/',
    img: '/img/p-cutbrief.webp',
    imgWide: '/img/p-cutbrief-hd.webp'
  }
];
export const FILTERS = [
  ['all', 'All'],
  ['sites', 'Websites'],
  ['apps', 'Web apps'],
  ['ai', 'AI tools']
];
export { SERVICES } from './services.js';
export const STEPS = [
  ['Brief', 'We ask what you sell, who buys, and what you want visitors to do.'],
  ['Preview', 'You get a private preview link before anything goes live.'],
  ['Test', 'We check every page on real phones and slow networks.'],
  ['Launch', 'We go live on your go-ahead and stay reachable after.']
];
