/**
 * Template "How To" articles + YouTube embed slots.
 *
 * Each section has multiple article shells you can edit later. Replace the
 * `summary` and `sections[].body` fields with real copy. Add YouTube IDs to
 * the `videos` array for each section and they'll embed automatically.
 *
 * To embed a YouTube video, set `youtubeId` to the 11-char ID from the URL.
 *   e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ → 'dQw4w9WgXcQ'
 */

const placeholder = (title) => [
  {
    heading: 'Overview',
    body: `Write the intro for "${title}" here. 2–3 sentences explaining what the reader will learn and why it matters.`,
  },
  {
    heading: 'Step-by-step',
    body: 'Step 1: …\nStep 2: …\nStep 3: …\nStep 4: …\nStep 5: …',
  },
  {
    heading: 'Common pitfalls',
    body: 'List the mistakes new investors make and how to avoid them.',
  },
  {
    heading: 'Quick checklist',
    body: '• Item one\n• Item two\n• Item three\n• Item four',
  },
];

export const sections = {
  flippers: {
    id: 'flippers',
    label: 'For Flippers',
    emoji: '🔨',
    color: '#ef4444',
    blurb: 'Strategy and playbooks for buying houses, renovating, and selling for profit.',
    articles: [
      {
        slug: 'first-flip-walkthrough',
        title: 'Your First Fix & Flip — The Complete Walkthrough',
        readTime: '8 min read',
        summary: 'A full beginner-to-close playbook covering deal selection, financing, the renovation timeline, and a clean exit.',
        sections: placeholder('Your First Fix & Flip'),
      },
      {
        slug: 'calculating-arv',
        title: 'How to Calculate ARV (After Repair Value) Like a Pro',
        readTime: '6 min read',
        summary: 'Pull the right comps, adjust for differences, and reverse-engineer your max allowable offer.',
        sections: placeholder('Calculating ARV'),
      },
      {
        slug: 'rehab-budgeting',
        title: 'Rehab Budgeting — The 70% Rule and Beyond',
        readTime: '7 min read',
        summary: 'Where the 70% rule comes from, when it works, and how to build a real bid-up budget from a contractor walk.',
        sections: placeholder('Rehab Budgeting'),
      },
      {
        slug: 'finding-flip-deals',
        title: 'Where to Find Fix & Flip Deals in 2026',
        readTime: '5 min read',
        summary: 'Wholesalers, MLS, foreclosures, probate, direct mail — what\'s working right now and what isn\'t.',
        sections: placeholder('Finding Flip Deals'),
      },
    ],
    videos: [
      // { youtubeId: '', title: 'My first flip from offer to sale' },
      // { youtubeId: '', title: 'Walkthrough of a $50k profit flip' },
    ],
  },

  landlords: {
    id: 'landlords',
    label: 'For Landlords',
    emoji: '🏠',
    color: '#10b981',
    blurb: 'Build and scale a long-term rental portfolio with positive cash flow.',
    articles: [
      {
        slug: 'first-rental',
        title: 'Buying Your First Rental Property',
        readTime: '7 min read',
        summary: 'How to evaluate cash flow, choose a market, and structure financing for your first long-term hold.',
        sections: placeholder('First Rental Property'),
      },
      {
        slug: 'screening-tenants',
        title: 'Screening Tenants Without Getting Sued',
        readTime: '6 min read',
        summary: 'Fair housing rules, the application stack you should use, and red flags to watch for during showings.',
        sections: placeholder('Screening Tenants'),
      },
      {
        slug: 'cash-flow-math',
        title: 'The Real Math Behind Cash Flow',
        readTime: '5 min read',
        summary: 'CapEx, vacancy, management, maintenance — what to actually subtract before you call it positive cash flow.',
        sections: placeholder('Cash Flow Math'),
      },
      {
        slug: 'self-vs-pm',
        title: 'Self-Manage vs. Hire a Property Manager',
        readTime: '5 min read',
        summary: 'The hidden costs of each approach and when it makes sense to make the switch.',
        sections: placeholder('Self-Manage vs PM'),
      },
    ],
    videos: [
      // { youtubeId: '', title: 'My first BRRRR deal walkthrough' },
    ],
  },

  wholesalers: {
    id: 'wholesalers',
    label: 'For Wholesalers',
    emoji: '📣',
    color: '#8b5cf6',
    blurb: 'How to find motivated sellers, lock up contracts, and assign for a fee.',
    articles: [
      {
        slug: 'wholesaling-101',
        title: 'Wholesaling 101 — How the Whole Game Works',
        readTime: '7 min read',
        summary: 'The full process: find a deal, get it under contract, assign to a cash buyer, collect the fee.',
        sections: placeholder('Wholesaling 101'),
      },
      {
        slug: 'finding-motivated-sellers',
        title: 'Finding Motivated Sellers in 2026',
        readTime: '8 min read',
        summary: 'List-pulling, direct mail, cold calling, PPC, and SMS — which channels still work and which are saturated.',
        sections: placeholder('Finding Motivated Sellers'),
      },
      {
        slug: 'building-buyers-list',
        title: 'Building a Buyers List That Actually Buys',
        readTime: '5 min read',
        summary: 'Where active cash buyers hang out, how to qualify them, and the email cadence that closes assignments fast.',
        sections: placeholder('Buyers List'),
      },
      {
        slug: 'assignment-contracts',
        title: 'The Assignment Contract — Legal Basics',
        readTime: '6 min read',
        summary: 'How a clean assignment contract reads, double-close vs. assignment, and the disclosure rules by state.',
        sections: placeholder('Assignment Contracts'),
      },
    ],
    videos: [
      // { youtubeId: '', title: 'How I made $15k on a wholesale deal' },
    ],
  },

  expand: {
    id: 'expand',
    label: 'Expand Your Business',
    emoji: '📈',
    color: '#f59e0b',
    blurb: 'Scale beyond one-off deals — systems, capital, and partnerships that 10x your output.',
    articles: [
      {
        slug: 'first-hire',
        title: 'Hiring Your First VA or Acquisitions Manager',
        readTime: '6 min read',
        summary: 'When to hire, where to find good people, and the scorecard you should run them on monthly.',
        sections: placeholder('First Hire'),
      },
      {
        slug: 'raising-private-capital',
        title: 'Raising Private Money — Your First $1M',
        readTime: '8 min read',
        summary: 'How to legally raise money from friends, family, and accredited investors. Reg D, JV structures, and a sample pitch.',
        sections: placeholder('Raising Private Money'),
      },
      {
        slug: 'systems-and-crm',
        title: 'Building Systems and Choosing a CRM',
        readTime: '6 min read',
        summary: 'The tech stack a 5-deal-a-month operator runs (without burning out).',
        sections: placeholder('Systems and CRM'),
      },
      {
        slug: 'partnerships',
        title: 'JV Partnerships — Splits That Don\'t Blow Up',
        readTime: '6 min read',
        summary: 'How to structure a 50/50 with a partner so the relationship survives the third deal.',
        sections: placeholder('JV Partnerships'),
      },
    ],
    videos: [
      // { youtubeId: '', title: 'How I went from 1 deal/month to 10' },
    ],
  },

  remote: {
    id: 'remote',
    label: 'Remote Rehab',
    emoji: '🌎',
    color: '#06b6d4',
    blurb: 'Flip and rehab houses in markets you don\'t live in. The systems, the people, and the tech.',
    articles: [
      {
        slug: 'building-remote-team',
        title: 'Building a Remote Boots-on-the-Ground Team',
        readTime: '7 min read',
        summary: 'Who you actually need on the ground (and who you don\'t), how to vet them, and how to pay them.',
        sections: placeholder('Remote Team'),
      },
      {
        slug: 'remote-walkthroughs',
        title: 'Doing Property Walkthroughs Without Being There',
        readTime: '5 min read',
        summary: 'Apps, gear, and a checklist for a Facetime / Zoom walkthrough that catches the same problems an in-person visit would.',
        sections: placeholder('Remote Walkthroughs'),
      },
      {
        slug: 'managing-contractors-remote',
        title: 'Managing Contractors From 1,000 Miles Away',
        readTime: '8 min read',
        summary: 'Daily photo SOPs, milestone-based payment schedules, and the project-management stack that keeps a rehab on time.',
        sections: placeholder('Remote Contractors'),
      },
      {
        slug: 'remote-closing',
        title: 'Closing on a Remote Property Step-by-Step',
        readTime: '5 min read',
        summary: 'Mobile notaries, wire instructions, and the title-company questions that prevent fraud.',
        sections: placeholder('Remote Closing'),
      },
    ],
    videos: [
      // { youtubeId: '', title: 'My remote rehab in another state' },
    ],
  },
};

// Section ordering for the page nav
export const sectionOrder = [
  'flippers',
  'landlords',
  'wholesalers',
  'lenders',          // special — uses the lenders data file, not articles
  'expand',
  'remote',
];
