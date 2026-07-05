/**
 * Scope of Work — the 15 basic condition questions a wholesaler answers when
 * posting a deal. Buyers see the answers in a tab on the listing page.
 *
 * Answer values: 'yes' (needs work) | 'no' (good as-is) | 'na' (not applicable).
 * 'na' items are hidden from the listing entirely.
 *
 * The big-ticket systems (roof, foundation, electrical, plumbing) are
 * deliberately ordered first.
 */

export const SOW_ITEMS = [
  { key: 'roof',       label: 'Roof',            question: 'Does it need a roof?' },
  { key: 'foundation', label: 'Foundation',      question: 'Does it need foundation work?' },
  { key: 'electrical', label: 'Electrical',      question: 'Does it need electrical work?' },
  { key: 'plumbing',   label: 'Plumbing',        question: 'Does it need plumbing?' },
  { key: 'hvac',       label: 'HVAC',            question: 'Does it need HVAC?' },
  { key: 'floors',     label: 'Floors',          question: 'Does it need floors?' },
  { key: 'paint',      label: 'Paint',           question: 'Does it need paint?' },
  { key: 'cabinets',   label: 'Cabinets',        question: 'Does it need cabinets?' },
  { key: 'showerTubs', label: 'Shower / Tubs',   question: 'Does it need showers or tubs?' },
  { key: 'kitchen',    label: 'Kitchen',         question: 'Does the kitchen need remodeling?' },
  { key: 'windows',    label: 'Windows',         question: 'Does it need windows?' },
  { key: 'doors',      label: 'Doors',           question: 'Does it need doors?' },
  { key: 'waterHeater',label: 'Water Heater',    question: 'Does it need a water heater?' },
  { key: 'exterior',   label: 'Siding / Exterior', question: 'Does the exterior need work?' },
  { key: 'landscaping',label: 'Yard / Landscaping', question: 'Does the yard need work?' },
];

/** Listing-page view: keep SOW_ITEMS order, drop 'na' + unanswered. */
export function visibleScopeEntries(scope) {
  if (!scope || typeof scope !== 'object') return [];
  return SOW_ITEMS
    .filter(({ key }) => scope[key] === 'yes' || scope[key] === 'no')
    .map(({ key, label }) => ({ key, label, needsWork: scope[key] === 'yes' }));
}

/** Has the seller answered anything at all? */
export function hasScopeAnswers(scope) {
  return visibleScopeEntries(scope).length > 0;
}
