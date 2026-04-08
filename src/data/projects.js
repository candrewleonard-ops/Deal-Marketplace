export const initialProjects = [
  {
    id: 1,
    name: 'Finishing Kitchen',
    createdAt: '2025-06-11T21:57:00',
    updatedAt: '2025-06-11T21:57:00',
    assignedUsers: ['admin-carson'],
    sections: [
      {
        id: 's1',
        name: 'Finishing',
        collapsed: false,
        tasks: [
          {
            id: 't1',
            name: 'Refinish Tub',
            completed: true,
            assignedTo: 'admin-carson',
            completedAt: '2025-06-11T21:52:00',
            notes: 'https://www.homedepot.com/p/Bondo-41-oz-Short-Strand-Fiberglass-Filler-272/202077784 Filler\nhttps://www.homedepot.com/p/Homax-Tough-as-Tile-26-oz-White-Tub-Sink-and-Tile-Epoxy-3158/306586140 Epoxy',
          },
          {
            id: 't2',
            name: 'Trim and Baseboards',
            completed: true,
            assignedTo: 'admin-carson',
            completedAt: '2025-06-11T21:52:00',
            notes: '',
          },
          {
            id: 't3',
            name: 'Paint Walls',
            completed: false,
            assignedTo: null,
            completedAt: null,
            notes: '',
          },
          {
            id: 't4',
            name: 'Install Light Fixtures',
            completed: false,
            assignedTo: null,
            completedAt: null,
            notes: '',
          },
          {
            id: 't5',
            name: 'Replace Cabinet Hardware',
            completed: false,
            assignedTo: null,
            completedAt: null,
            notes: '',
          },
          {
            id: 't6',
            name: 'Install Backsplash',
            completed: false,
            assignedTo: null,
            completedAt: null,
            notes: '',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Peachtree Rd Flip',
    createdAt: '2025-06-10T14:30:00',
    updatedAt: '2025-06-11T09:15:00',
    assignedUsers: ['admin-carson', 1],
    sections: [
      {
        id: 's2a',
        name: 'Kitchen',
        collapsed: false,
        tasks: [
          { id: 't7', name: 'Demo cabinets', completed: true, assignedTo: 1, completedAt: '2025-06-10T16:00:00', notes: '' },
          { id: 't8', name: 'Install new countertops', completed: false, assignedTo: null, completedAt: null, notes: 'Granite from supplier - call for quote' },
          { id: 't9', name: 'Paint cabinets', completed: false, assignedTo: null, completedAt: null, notes: '' },
        ],
      },
      {
        id: 's2b',
        name: 'Bathroom',
        collapsed: false,
        tasks: [
          { id: 't10', name: 'Replace vanity', completed: false, assignedTo: 'admin-carson', completedAt: null, notes: '' },
          { id: 't11', name: 'Re-tile shower', completed: false, assignedTo: null, completedAt: null, notes: '' },
          { id: 't12', name: 'Install new fixtures', completed: false, assignedTo: null, completedAt: null, notes: '' },
        ],
      },
      {
        id: 's2c',
        name: 'Exterior',
        collapsed: false,
        tasks: [
          { id: 't13', name: 'Power wash siding', completed: true, assignedTo: 1, completedAt: '2025-06-11T09:15:00', notes: '' },
          { id: 't14', name: 'Paint front door', completed: false, assignedTo: null, completedAt: null, notes: 'Color: Navy blue' },
          { id: 't15', name: 'Landscape front yard', completed: false, assignedTo: null, completedAt: null, notes: '' },
        ],
      },
    ],
  },
];

export const initialTemplates = [
  {
    id: 'tmpl-kitchen',
    name: 'Kitchen Renovation',
    sections: [
      {
        name: 'Demo',
        tasks: ['Remove old cabinets', 'Remove countertops', 'Remove flooring', 'Haul debris'],
      },
      {
        name: 'Rough-In',
        tasks: ['Plumbing rough-in', 'Electrical rough-in', 'HVAC adjustments'],
      },
      {
        name: 'Finishing',
        tasks: ['Install cabinets', 'Install countertops', 'Install backsplash', 'Paint walls', 'Install light fixtures', 'Install appliances'],
      },
    ],
  },
  {
    id: 'tmpl-bathroom',
    name: 'Bathroom Renovation',
    sections: [
      {
        name: 'Demo',
        tasks: ['Remove vanity', 'Remove tile', 'Remove toilet', 'Haul debris'],
      },
      {
        name: 'Rough-In',
        tasks: ['Plumbing rough-in', 'Electrical rough-in', 'Waterproofing'],
      },
      {
        name: 'Finishing',
        tasks: ['Tile floor', 'Tile shower/tub', 'Install vanity', 'Install toilet', 'Install fixtures', 'Paint walls'],
      },
    ],
  },
  {
    id: 'tmpl-exterior',
    name: 'Exterior Rehab',
    sections: [
      {
        name: 'Prep',
        tasks: ['Power wash', 'Scrape peeling paint', 'Repair siding', 'Caulk gaps'],
      },
      {
        name: 'Paint & Finish',
        tasks: ['Prime exterior', 'Paint siding', 'Paint trim', 'Paint front door'],
      },
      {
        name: 'Landscaping',
        tasks: ['Mow and edge', 'Mulch beds', 'Plant shrubs', 'Clean gutters'],
      },
    ],
  },
];
