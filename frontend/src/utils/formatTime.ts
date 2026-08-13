export function formatTime(t: string) {
  const [h, m] = t.split(":");
  return `${parseInt(h)}h${m}`;
}

export function timeToHHMM(t: string) {
  // "09:00:00" → "09:00"
  return t.slice(0, 5);
}
