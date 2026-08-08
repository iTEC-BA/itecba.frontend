import React from 'react';
import {
  Home, Search, Compass, PlayCircle, Play, MessageCircle, Heart, Plus, Menu,
  Users, User, GraduationCap, BookOpen, Calendar, ArrowLeft, Trash2, Send,
  Download, Check, Share2, Clock, X, ExternalLink, UploadCloud, Bookmark,
  FileSpreadsheet, Pencil, FileText, Archive, File, Folder, MapPin, Zap,
  Info, ShieldCheck, Settings, Star, ChevronUp, ChevronDown, LayoutGrid,
  Video, Library, Newspaper, Calculator, Wrench, Gift, TrendingUp, Bell,
  BellDot, BarChart3, Ticket, Lock,
  type LucideIcon,
} from 'lucide-react';
 
// ==========================================
// ÍCONOS PERSONALIZADOS SIN EQUIVALENTE EN LUCIDE
// (marcas, ilustraciones propias, etc.)
// ==========================================
const customIcons: { [key: string]: React.ReactNode } = {
  google: <svg viewBox="0 0 24 24" className="w-full h-full"><path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.404 1.679l3.329-3.328A11.758 11.758 0 0012 .118 11.895 11.895 0 001.328 6.46l3.938 3.305z"/><path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-3.936 3.304A11.893 11.893 0 0012 23.885c2.923 0 5.59-1.01 7.394-2.738l-3.354-3.134z"/><path fill="#4A90E2" d="M19.394 21.147C21.432 19.336 22.75 16.514 22.75 12c0-.82-.09-1.637-.245-2.427H12v4.582h6.059c-.29 1.503-1.127 2.766-2.316 3.655l3.651 3.337z"/><path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.328 6.46A11.874 11.874 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/></svg>,
  youtube: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  whatsapp: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>,
  siuGuarani: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  aulasVirtuales: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>,
  hologram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>,
  chip: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="4" x2="9" y2="20"></line><line x1="15" y1="4" x2="15" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="9" x2="9" y2="9"></line><line x1="4" y1="15" x2="9" y2="15"></line><line x1="15" y1="9" x2="20" y2="9"></line><line x1="15" y1="15" x2="20" y2="15"></line></svg>,
  nfc: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 8a10 10 0 0 1 16 0M6 12a6 6 0 0 1 12 0M8 16a2 2 0 0 1 8 0"/></svg>,
  documentFill: <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/></svg>,
};
 
// ==========================================
// MAPA DE ÍCONOS ESTÁNDAR → lucide-react
// ==========================================
const lucideIcons: { [key: string]: LucideIcon } = {
  home: Home,
  search: Search,
  compass: Compass,
  play: PlayCircle,
  playFill: Play,
  message: MessageCircle,
  heart: Heart,
  plus: Plus,
  menu: Menu,
  burger: Menu,
  users: Users,
  user: User,
  profile: User,
  degree: GraduationCap,
  entry: BookOpen,
  book: BookOpen,
  calendar: Calendar,
  arrowLeft: ArrowLeft,
  trash: Trash2,
  send: Send,
  download: Download,
  check: Check,
  shareNetwork: Share2,
  share: Share2,
  clock: Clock,
  close: X,
  externalLink: ExternalLink,
  uploadCloud: UploadCloud,
  bookmark: Bookmark,
  bookmarkFilled: Bookmark,
  sheets: FileSpreadsheet,
  spreadsheet: FileSpreadsheet,
  edit: Pencil,
  document: FileText,
  "file-text": FileText,
  pdf: FileText,
  zip: Archive,
  file: File,
  folder: Folder,
  pin: MapPin,
  "map-pin": MapPin,
  lightning: Zap,
  info: Info,
  verified: ShieldCheck,
  settings: Settings,
  star: Star,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  category: LayoutGrid,
  grid: LayoutGrid,
  video: Video,
  library: Library,
  news: Newspaper,
  calculator: Calculator,
  tool: Wrench,
  gift: Gift,
  "chart-line": TrendingUp,
  chart: BarChart3,
  ticket: Ticket,
  bell: Bell,
  bellDot: BellDot,
  lock: Lock,
};
 
// Íconos que deben renderizarse con relleno sólido ("versión Fill")
const FILLED_TYPES = new Set(["playFill", "bookmarkFilled"]);
 
// Tamaño/color fijo heredado para los badges de tipo de archivo
const FIXED_STYLE: { [key: string]: string } = {
  pdf: "w-6 h-6 shrink-0 text-red-500",
  zip: "w-6 h-6 shrink-0 text-yellow-500",
  file: "w-6 h-6 shrink-0 text-gray-500",
};
 
// ==========================================
// COMPONENTE Icons
// Delega en lucide-react para los íconos estándar y en customIcons para
// las piezas gráficas propias que no existen en la librería.
// ==========================================
export const Icons = ({ type, className }: { type: string, className?: string }) => {
  const LucideIcon = lucideIcons[type];
 
  const renderGeometry = () => {
    if (LucideIcon) {
      return (
        <LucideIcon
          className={FIXED_STYLE[type] ?? "w-full h-full"}
          {...(FILLED_TYPES.has(type) ? { fill: "currentColor" } : {})}
        />
      );
    }
    if (customIcons[type]) return customIcons[type];
    // Fallback: ícono de archivo genérico (mismo comportamiento que antes)
    return <File className="w-6 h-6 shrink-0 text-gray-500" />;
  };
 
  return (
    <div className={`flex items-center justify-center shrink-0 ${className}`}>
      {renderGeometry()}
    </div>
  );
};
 
// ==========================================
// GRÁFICO DINÁMICO DE PROGRESO (DONUT)
// ==========================================
interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}
 
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size = 160,
  strokeWidth = 14
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
 
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Círculo de fondo (Gris) */}
      <circle
        stroke="#474747" // --color-itec-gray
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Círculo de progreso (Azul) */}
      <circle
        stroke="#022A5E" // --color-itec-blue
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        className="transition-all duration-1000 ease-out"
      />
    </svg>
  );
};
