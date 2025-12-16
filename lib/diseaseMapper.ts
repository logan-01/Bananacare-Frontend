// lib/diseaseMapper.ts

/**
 * Converts a disease name or result to its disease ID
 * Handles both formats:
 * - Disease IDs: "black-sigatoka", "bmv", "cordana", etc.
 * - Disease Names: "Black Sigatoka Disease", "Bract Mosaic Virus", etc.
 */

// Map of disease names to IDs
const diseaseNameToId: Record<string, string> = {
  "Black Sigatoka Disease": "black-sigatoka",
  "Bract Mosaic Virus": "bmv",
  "Cordana Disease": "cordana",
  "Banana Healthy": "healthy",
  Healthy: "healthy",
  "Moko Disease": "moko",
  "Panama Disease": "panama",
  "Not Banana": "not-banana",
  "Weevil Disease": "weevil",
};

/**
 * Converts a disease name or ID to its disease ID
 * This handles both old data (disease names) and new data (IDs)
 */
export function getDiseaseId(nameOrId: string): string {
  // If it's already an ID (contains hyphen), return it
  if (nameOrId.includes("-")) {
    return nameOrId;
  }

  // Check if it's a known disease name
  if (diseaseNameToId[nameOrId]) {
    return diseaseNameToId[nameOrId];
  }

  // Try case-insensitive match
  const normalized = nameOrId.trim();
  for (const [name, id] of Object.entries(diseaseNameToId)) {
    if (name.toLowerCase() === normalized.toLowerCase()) {
      return id;
    }
  }

  // If not found, log warning and return as-is
  console.warn(`Unknown disease name/ID: ${nameOrId}`);
  return nameOrId;
}
