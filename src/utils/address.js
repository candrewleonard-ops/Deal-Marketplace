export function blurAddress(address) {
  if (!address) return '';
  return address.replace(/^\d+\s*/, '**** ');
}

export function getDisplayAddress(deal, hasAccess) {
  return hasAccess ? deal.address : blurAddress(deal.address);
}
