
export function formatTaka(amount: number): string {
  return `${new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 2,
  }).format(amount)} টাকা`;
}

export function formatPercent(value: number): string {
  const absolute = new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits: 1,
  }).format(Math.abs(value));

  if (value > 0) return `▲ ${absolute}%`;
  if (value < 0) return `▼ ${absolute}%`;

  return "— ০.০%";
}

export function formatBanglaDate(date = new Date()): string {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}


export function formatBengaliNumber(
  value: number,
  maximumFractionDigits = 0,
): string {
  return new Intl.NumberFormat("bn-BD", {
    maximumFractionDigits,
  }).format(value);
}


export function getUnitLabel(unit: string): string {
  const units: Record<string, string> = {
    kg: "কেজি",
    kilogram: "কেজি",
    liter: "লিটার",
    litre: "লিটার",
    dozen: "ডজন",
    piece: "পিস",
    pcs: "পিস",
    gram: "গ্রাম",
    ml: "মিলিলিটার",
  };

  return units[unit.toLowerCase()] ?? unit;
}
