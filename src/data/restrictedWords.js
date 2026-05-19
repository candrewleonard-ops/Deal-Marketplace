// Restricted words for username validation.
// Slurs are represented by placeholders (do NOT include actual slurs).
export const restrictedWords = [
  // Profanity
  'fuck', 'shit', 'bitch', 'damn', 'piss', 'cunt', 'dick', 'cock',
  'pussy', 'bastard', 'whore', 'slut', 'asshole', 'dumbass',
  // Placeholder slur blocks
  'nword', 'fword', 'rword', 'cword', 'sword',
  // Reserved / impersonation
  'admin', 'moderator', 'owner', 'staff', 'support', 'official',
  'allstreet', 'allstreetlive', 'carson',
];
