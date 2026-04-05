export const groups = [
  { id: 'g1', name: 'Dallas Wholesalers Network', description: 'Connecting wholesalers in the DFW metro. Share deals, buyers, and strategies.', isPrivate: false, memberCount: 1240, memberIds: ['me', 1, 3, 4], ownerId: 3, bannerImage: 'https://picsum.photos/seed/group1/1200/300', createdAt: '2023-01-15', category: 'Networking' },
  { id: 'g2', name: 'Fix & Flip Mastermind', description: 'Monthly case studies from active flippers doing 10+ deals per year.', isPrivate: true, memberCount: 185, memberIds: ['me', 1, 7], ownerId: 7, bannerImage: 'https://picsum.photos/seed/group2/1200/300', createdAt: '2022-06-02', category: 'Education' },
  { id: 'g3', name: 'Texas Real Estate Investors', description: 'All things Texas REI - Dallas, Houston, Austin, San Antonio.', isPrivate: false, memberCount: 3420, memberIds: ['me', 3, 4], ownerId: 3, bannerImage: 'https://picsum.photos/seed/group3/1200/300', createdAt: '2020-03-10', category: 'Regional' },
  { id: 'g4', name: 'Creative Finance Inner Circle', description: 'Subject-to, seller finance, lease options. Advanced strategies only.', isPrivate: true, memberCount: 92, memberIds: [4, 7], ownerId: 4, bannerImage: 'https://picsum.photos/seed/group4/1200/300', createdAt: '2023-09-21', category: 'Education' },
  { id: 'g5', name: 'Southeast Cash Buyers', description: 'Verified cash buyers across GA, AL, FL, SC, NC, TN.', isPrivate: false, memberCount: 780, memberIds: [1, 5, 8, 9], ownerId: 1, bannerImage: 'https://picsum.photos/seed/group5/1200/300', createdAt: '2021-11-30', category: 'Buyers' },
  { id: 'g6', name: 'New Investor Bootcamp', description: 'Weekly live Q&A for folks doing their first 3 deals.', isPrivate: false, memberCount: 2100, memberIds: ['me', 4], ownerId: 4, bannerImage: 'https://picsum.photos/seed/group6/1200/300', createdAt: '2022-01-05', category: 'Education' },
  { id: 'g7', name: 'STR Investors Alliance', description: 'Short-term rental operators sharing tips, software, and market insights.', isPrivate: true, memberCount: 340, memberIds: [10], ownerId: 10, bannerImage: 'https://picsum.photos/seed/group7/1200/300', createdAt: '2022-08-15', category: 'Strategy' },
  { id: 'g8', name: 'Phoenix Wholesalers', description: 'Active AZ wholesalers. Share buyers, split deals, move volume.', isPrivate: true, memberCount: 210, memberIds: [2], ownerId: 2, bannerImage: 'https://picsum.photos/seed/group8/1200/300', createdAt: '2021-04-18', category: 'Regional' },
  { id: 'g9', name: 'Midwest Rentals Club', description: 'Buy & hold investors in KC, Indy, St. Louis, Cincinnati.', isPrivate: false, memberCount: 540, memberIds: [5, 6, 7], ownerId: 7, bannerImage: 'https://picsum.photos/seed/group9/1200/300', createdAt: '2023-02-12', category: 'Regional' },
  { id: 'g10', name: 'Contractor Referrals Network', description: 'Vetted contractors, GCs, and subs nationwide. Post needs, get quotes.', isPrivate: true, memberCount: 128, memberIds: [7], ownerId: 7, bannerImage: 'https://picsum.photos/seed/group10/1200/300', createdAt: '2023-05-08', category: 'Services' },
  { id: 'g11', name: 'Private Money Lenders', description: 'Connect borrowers and lenders. Deal-based capital for flippers.', isPrivate: true, memberCount: 67, memberIds: [4, 9], ownerId: 9, bannerImage: 'https://picsum.photos/seed/group11/1200/300', createdAt: '2022-12-01', category: 'Capital' },
  { id: 'g12', name: 'Atlanta Real Estate Hub', description: 'Everything Atlanta real estate - deals, meetups, market updates.', isPrivate: true, memberCount: 890, memberIds: [1, 'admin-carson'], ownerId: 'admin-carson', bannerImage: 'https://picsum.photos/seed/group12/1200/300', createdAt: '2019-05-15', category: 'Regional' },
];

export const pendingInvites = [
  { groupId: 'g4', invitedBy: 4, timestamp: '2026-04-03' },
  { groupId: 'g10', invitedBy: 7, timestamp: '2026-04-02' },
];

export const getGroupById = (id) => groups.find(g => g.id === id);
export const getUserGroups = (userId) => groups.filter(g => g.memberIds.includes(userId));
