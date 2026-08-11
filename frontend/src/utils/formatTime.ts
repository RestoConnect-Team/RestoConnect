export function formatTime(t: string) {
  const [h, m] = t.split(":");
  return `${parseInt(h)}h${m}`;
}
