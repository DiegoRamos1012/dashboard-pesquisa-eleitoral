const numberFormatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

export function formatInteger(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercentage(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

export function formatCoverageRatio(
  sampledPopulation: number,
  groupPopulation: number,
): number {
  if (groupPopulation <= 0) {
    return 0;
  }

  return (sampledPopulation / groupPopulation) * 100;
}

export function formatIsoDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return dateFormatter.format(parsed);
}
