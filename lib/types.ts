export type CallType = "Inbound" | "Outbound";

export interface CallRow {
  date: string; // ISO yyyy-MM-dd
  centre: string;
  agentId: string;
  agentName: string;
  callType: CallType;
  calls: number;
  connected: number;
  talktimeSeconds: number;
}
