type ClassValue = string | number | boolean | undefined | null;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}