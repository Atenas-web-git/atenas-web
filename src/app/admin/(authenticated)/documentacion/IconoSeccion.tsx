import {
  Compass,
  ShieldCheck,
  MousePointerClick,
  FileText,
  Bell,
  Calendar,
  FileBox,
  Trophy,
  Image as ImageIcon,
  ClipboardList,
  BriefcaseBusiness,
  UserPlus,
  Mail,
  Settings,
  Users,
  CheckCircle2,
  BookOpen,
  BookMarked,
} from "lucide-react";

/**
 * Icono de una sección de la documentación, resuelto por nombre.
 *
 * Es un `switch` explícito y no un mapa de componentes a propósito: así
 * ningún componente se construye dinámicamente durante el render.
 */
export function IconoSeccion({
  nombre,
  size,
  color,
}: {
  nombre: string;
  size: number;
  color: string;
}) {
  const props = { size, color, strokeWidth: 2 } as const;

  switch (nombre) {
    case "Compass":
      return <Compass {...props} />;
    case "ShieldCheck":
      return <ShieldCheck {...props} />;
    case "MousePointerClick":
      return <MousePointerClick {...props} />;
    case "FileText":
      return <FileText {...props} />;
    case "Bell":
      return <Bell {...props} />;
    case "Calendar":
      return <Calendar {...props} />;
    case "FileBox":
      return <FileBox {...props} />;
    case "Trophy":
      return <Trophy {...props} />;
    case "Image":
      return <ImageIcon {...props} />;
    case "ClipboardList":
      return <ClipboardList {...props} />;
    case "BriefcaseBusiness":
      return <BriefcaseBusiness {...props} />;
    case "UserPlus":
      return <UserPlus {...props} />;
    case "Mail":
      return <Mail {...props} />;
    case "Settings":
      return <Settings {...props} />;
    case "Users":
      return <Users {...props} />;
    case "CheckCircle2":
      return <CheckCircle2 {...props} />;
    case "BookOpen":
      return <BookOpen {...props} />;
    default:
      return <BookMarked {...props} />;
  }
}
