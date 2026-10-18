export const PROJECTS = [
  {
    id: 'valorcup',
    title: 'Valor Cup',
    kind: 'apps',
    label: 'Live platform',
    blurb:
      'A complete tournament site for a college sports league: points table, fixtures, results, team and player pages, plus admin and captain panels, fan polls and certificates.',
    stack: ['Vercel', 'MongoDB', 'Admin roles'],
    url: 'https://valorcup.vercel.app',
    img: '/img/p-valorcup.webp'
  },
  {
    id: 'pizza',
    title: 'Prashant Pizza',
    kind: 'sites',
    label: 'Redesign concept',
    blurb:
      'A redesign concept for a Patna pizza shop, built from its real menu: 20 items, size and topping picker, a cart, and a short 3D intro. Made as a pitch, not a client delivery.',
    stack: ['Vercel', 'Real menu', 'Mobile ordering'],
    url: 'https://prashant-pizza-nu.vercel.app',
    img: '/img/p-pizza.webp'
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
    img: '/img/p-vanta.webp'
  },
  {
    id: 'cutbrief',
    title: 'CutBrief',
    kind: 'ai',
    label: 'Our own tool',
    blurb:
      'Turns a client\u2019s rough reel request into a clean editor brief. A small open-weight AI runs locally, so client messages are never uploaded.',
    stack: ['Local AI', 'Browser', 'GitHub Pages'],
    url: 'https://sanny1921.github.io/cutbrief/',
    img: '/img/p-cutbrief.webp'
  }
];
export const FILTERS = [
  ['all', 'All'],
  ['sites', 'Websites'],
  ['apps', 'Web apps'],
  ['ai', 'AI tools']
];
export const SERVICES = [
  {
    id: 'web',
    n: '01',
    title: 'Web development',
    lead: 'Fast, mobile-first websites and web apps, built to look sharp on an average phone.',
    points: [
      'Business, portfolio and landing pages',
      'Menus, catalogues and ordering flows',
      'Web apps with logins, dashboards and admin panels',
      'Speed and slow-network tuning'
    ]
  },
  {
    id: 'ads',
    n: '02',
    title: 'Ads',
    lead: 'Ad creatives that send the right people to your website or WhatsApp.',
    points: [
      'Instagram and Facebook ad creatives',
      'Local promotion for shops, cafes and institutes',
      'Landing pages built for a single campaign',
      'Clear, honest messaging'
    ]
  },
  {
    id: 'video',
    n: '03',
    title: 'Video editing',
    lead: 'Short-form edits that keep people watching, cut by our editors and finished by us.',
    points: [
      'Reels, Shorts and YouTube short-form',
      'Motion typography and branded captions',
      'Sound design and music',
      'Hooks and pacing for retention'
    ]
  }
];
export const STEPS = [
  ['Brief', 'We ask what you sell, who buys, and what you want visitors to do.'],
  ['Preview', 'You get a private preview link before anything goes live.'],
  ['Test', 'We check every page on real phones and slow networks.'],
  ['Launch', 'We go live on your go-ahead and stay reachable after.']
];
