export function intervalToMs(interval: string): number {
  const match = interval.match(/^(\d+)([mhd])$/);
  if (!match) {
    throw new Error(`Unsupported interval format: ${interval}`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Unsupported interval unit: ${unit}`);
  }
}
