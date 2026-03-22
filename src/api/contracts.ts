export interface ApiErrorResponse {
  error: string;
  message?: string;
  status?: number;
}

export interface IbgeSyncResponse {
  statesCreated: number;
  statesUpdated: number;
  municipalitiesCreated: number;
  forced: boolean;
}

export interface CandidateWeightedResult {
  candidateId: string;
  candidateName: string;
  weightedPercentage: number;
}

export type MunicipalityGroup = "GROUP_1" | "GROUP_2" | "GROUP_3" | "GROUP_4";

export interface GroupBreakdownItem {
  stateAcronym: string;
  municipalityGroup: MunicipalityGroup;
  groupPopulation: number;
  sampledPopulation: number;
  candidates: CandidateWeightedResult[];
}

export interface PollImportResponse {
  pollId: string;
  pollDate: string;
  weightedPopulation: number;
  candidates: CandidateWeightedResult[];
  groupBreakdown: GroupBreakdownItem[];
}
