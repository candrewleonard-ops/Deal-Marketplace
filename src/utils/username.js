import { restrictedWords } from '../data/restrictedWords';

export function validateUsername(username, existingUsers = []) {
  if (!username || username.length < 3) return { valid: false, error: 'Username must be 3+ characters' };
  if (username.length > 20) return { valid: false, error: 'Max 20 characters' };
  if (!/^[a-z0-9_]+$/i.test(username)) return { valid: false, error: 'Only letters, numbers, underscores' };
  const lower = username.toLowerCase();
  if (restrictedWords.some(w => lower.includes(w))) return { valid: false, error: 'Username contains restricted words' };
  if (existingUsers.some(u => u.username && u.username.toLowerCase() === lower)) return { valid: false, error: 'Username already taken' };
  return { valid: true };
}
