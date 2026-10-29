export const contentKinds = ["characters", "drinks", "food", "album"] as const;
export type ContentKind = (typeof contentKinds)[number];

export function isContentKind(value: unknown): value is ContentKind {
  return typeof value === "string" && contentKinds.includes(value as ContentKind);
}

export function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function safeImageName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-80) || "image";
}
