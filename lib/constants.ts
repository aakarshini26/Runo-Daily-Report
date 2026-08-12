export interface Agent {
  id: string;
  name: string;
  centre: string;
}

export const CENTRES = ["Alwarpet", "Thoraipakkam"] as const;

export const AGENTS: Agent[] = [
  { id: "mahalakshmi", name: "Mahalakshmi", centre: "Alwarpet" },
  { id: "poojalakshmi", name: "Poojalakshmi", centre: "Alwarpet" },
  { id: "anuradha", name: "Anuradha", centre: "Thoraipakkam" },
  { id: "devika", name: "Devika", centre: "Thoraipakkam" },
];

export function agentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

// Matches a name from the sheet (case/space insensitive) to a known agent.
// Runo's export sometimes uses fuller names (e.g. "Pooja Lakshmi", "Devika
// Dev", "Anuradha Sunil") than the short names this app tracks — match on
// whichever name is a prefix of the other once spaces are stripped, so
// "Pooja Lakshmi" -> "poojalakshmi" matches "Poojalakshmi" -> "poojalakshmi",
// and "Devika Dev" -> "devikadev" matches "Devika" -> "devika" as a prefix.
export function agentByName(name: string): Agent | undefined {
  const clean = name.trim().toLowerCase().replace(/\s+/g, "");
  if (!clean) return undefined;
  return AGENTS.find((a) => {
    const known = a.name.toLowerCase().replace(/\s+/g, "");
    return known === clean || clean.startsWith(known) || known.startsWith(clean);
  });
}
