/**
 * Launch accounts. All demo personas are gone — these three exist purely so
 * you can test the full loop (post a deal, follow, DM, heart, go live)
 * by switching between them from the avatar menu in the navbar.
 *
 * "Test 1" keeps the historical id `me` because the auth flow logs into it.
 */
export const users = [
  {
    id: 'me',
    name: 'Test 1',
    username: 'test_one',
    email: 'test1@allstreetlive.com',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=T1&backgroundColor=00c805&textColor=052012',
    coverPhoto: 'https://picsum.photos/seed/testcover1/1200/400',
    location: 'Dallas, TX',
    bio: 'Test wholesaler account. Post deals, go live, and message the other test accounts from here.',
    tags: ['Wholesaler'],
    followers: 0,
    following: 0,
    dealsPosted: 0,
    dealsClosed: 0,
    isBusinessProfile: false,
    joinedDate: '2026-07-01',
    accountTier: 'Basic',
    isTrialAccount: true,
    isPrivate: false,
    isCommunityLeader: false,
    isAdmin: false,
    phone: '(555) 000-0001',
  },
  {
    id: 'test-2',
    name: 'Test 2',
    username: 'test_two',
    email: 'test2@allstreetlive.com',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=T2&backgroundColor=f59e0b&textColor=161a17',
    coverPhoto: 'https://picsum.photos/seed/testcover2/1200/400',
    location: 'Atlanta, GA',
    bio: 'Test buyer account. Use it to browse deals, get addresses, heart listings, and DM Test 1.',
    tags: ['Cash Buyer', 'Fix N Flipper'],
    followers: 0,
    following: 0,
    dealsPosted: 0,
    dealsClosed: 0,
    isBusinessProfile: false,
    joinedDate: '2026-07-01',
    accountTier: 'Basic',
    isTrialAccount: true,
    isPrivate: false,
    isCommunityLeader: false,
    isAdmin: false,
    phone: '(555) 000-0002',
  },
  {
    id: 'test-3',
    name: 'Test 3',
    username: 'test_three',
    email: 'test3@allstreetlive.com',
    avatar: 'https://api.dicebear.com/9.x/initials/svg?seed=T3&backgroundColor=00e5a0&textColor=052012',
    coverPhoto: 'https://picsum.photos/seed/testcover3/1200/400',
    location: 'Phoenix, AZ',
    bio: 'Test landlord account. Third wheel for testing follows, group chats, and live tours.',
    tags: ['Landlord'],
    followers: 0,
    following: 0,
    dealsPosted: 0,
    dealsClosed: 0,
    isBusinessProfile: false,
    joinedDate: '2026-07-01',
    accountTier: 'Basic',
    isTrialAccount: true,
    isPrivate: false,
    isCommunityLeader: false,
    isAdmin: false,
    phone: '(555) 000-0003',
  },
];

export const currentUser = users[0];

export const getUserById = (id) => {
  return users.find(u => String(u.id) === String(id));
};
