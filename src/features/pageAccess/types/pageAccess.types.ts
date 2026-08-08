export interface PageAccessState {
  enabled: boolean;
  comingSoon: boolean;
  hidden: boolean;
  label?: string;
  updatedAt?: string;
  updatedBy?: string | null;
}

export type PageAccessMap = Record<string, PageAccessState>;

export const DEFAULT_PAGE_ACCESS_STATE: PageAccessState = {
  enabled: true,
  comingSoon: false,
  hidden: false,
};
