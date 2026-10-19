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
      'A small web tool that turns a rough request into a clean brief. A small open-weight AI runs locally, so client messages are never uploaded.',
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
    id: 'sites',
    n: '01',
    title: 'Business websites',
    lead: 'Fast, mobile-first websites that explain what you do in five seconds and make the next step obvious.',
    points: [
      'Business, portfolio and landing pages',
      'Menus, catalogues and WhatsApp enquiry buttons',
      'Clear layouts that read well on an average phone',
      'Per-page titles and link previews'
    ]
  },
  {
    id: 'apps',
    n: '02',
    title: 'Web apps',
    lead: 'Websites that do work for you: sign-ins, dashboards and admin panels built around how your team operates.',
    points: [
      'Logins, dashboards and admin panels',
      'Leagues, fixtures, results and certificates',
      'Ordering flows with a cart',
      'Real-time features like chat and voice notes'
    ]
  },
  {
    id: 'motion',
    n: '03',
    title: '3D and motion on the web',
    lead: 'Interactive 3D and scroll animation that makes a site memorable, with a light version for slow phones.',
    points: [
      '3D hero and product objects',
      'Scroll animation and stacking cards',
      'Automatic light fallback on weak devices',
      'Tested for smooth scrolling on real phones'
    ]
  },
  {
    id: 'launch',
    n: '04',
    title: 'Speed, testing and launch',
    lead: 'A site that loads fast, is checked before it goes live, and is looked after after launch.',
    points: [
      'Speed and slow-network tuning',
      'Checks on small, large and tall phones',
      'A private preview link before anything goes live',
      'Fixes and updates after launch'
    ]
  }
];
export const STEPS = [
  ['Brief', 'We ask what you sell, who buys, and what you want visitors to do.'],
  ['Preview', 'You get a private preview link before anything goes live.'],
  ['Test', 'We check every page on real phones and slow networks.'],
  ['Launch', 'We go live on your go-ahead and stay reachable after.']
];
