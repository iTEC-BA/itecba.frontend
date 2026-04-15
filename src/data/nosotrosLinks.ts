export interface NosotrosLink {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  iconType: 'document' | 'spreadsheet' | 'folder';
  colorClass: string;
  hoverClass: string;
}

export const NOSOTROS_DATA: NosotrosLink[] = [
  {
    id: 'n1',
    title: 'Hoja de Valores',
    subtitle: 'Nuestros principios',
    url: 'https://docs.google.com/document/d/17NfRQ24K0BnJ0Dt0BNbdfqaZGO1GyCuj/edit?usp=drivesdk&ouid=107710303928154493488&rtpof=true&sd=true',
    iconType: 'document',
    colorClass: 'text-blue-400',
    hoverClass: 'hover:border-blue-400'
  },
  {
    id: 'n2',
    title: 'Balance General',
    subtitle: 'Transparencia financiera',
    url: 'https://docs.google.com/spreadsheets/d/1DSZhK1d_GCTZWqSopms5MtBXRMAZNF_s/edit?usp=drive_link&ouid=115839091097710835696&rtpof=true&sd=true',
    iconType: 'spreadsheet',
    colorClass: 'text-green-400',
    hoverClass: 'hover:border-green-400'
  },
  {
    id: 'n3',
    title: 'Cartas a Departamentos',
    subtitle: 'Presentaciones oficiales',
    url: 'https://drive.google.com/file/d/1QIdeUYI6rF5xpo3tOJDJ2iCrqJgoSAsw/view?usp=sharing',
    iconType: 'folder',
    colorClass: 'text-purple-400',
    hoverClass: 'hover:border-purple-400'
  }
];