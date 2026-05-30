export interface ToolLink {
  id: string;
  label: string;
  url: string;
  description?: string;
  iconName?: string;
  isExternal?: boolean;
  badge?: string;
  badgeColor?: string;
}

export interface FolderItem {
  id: string;
  label: string;
  iconName: string;
  iconColor: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  links: ToolLink[];
}

export interface SectionData {
  id: string;
  title: string;
  iconName: string;
  colorTheme: string;
  folders: FolderItem[];
}