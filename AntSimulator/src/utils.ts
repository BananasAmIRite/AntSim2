export function hexToRGB(hex: string) {
  const extracted = /#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})/g.exec(hex);

  if (!extracted) throw new Error('Invalid hex');

  const r = parseInt(extracted[1], 16);
  const g = parseInt(extracted[2], 16);
  const b = parseInt(extracted[3], 16);

  return [r, g, b];
}
