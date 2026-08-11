export function formatDate(
  date: string | null | undefined,
  inFrench?: boolean,
) {
  if (!date) return "Non définie";
  if (inFrench) {
    return new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(
      new Date(date),
    );
  }
  return new Date(date).toLocaleDateString("fr-FR");
}
