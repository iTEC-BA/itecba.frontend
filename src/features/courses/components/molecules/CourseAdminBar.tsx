// src/features/courses/components/molecules/CourseAdminBar.tsx
// Barra de acciones administrativas visible SOLO para admins.
import React from "react";
import { Plus, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
  onAdd:          () => void;
  onBrokenVideos: () => void;
}

export const CourseAdminBar: React.FC<Props> = ({ onAdd, onBrokenVideos }) => (
  <div className="flex items-center gap-2 flex-wrap">
    <Button
      onClick={onBrokenVideos}
      variant="danger"
      hierarchy="solid"
      icon={<AlertOctagon className="size-3.5" />}
    >
      Videos reportados
    </Button>
    <Button
      onClick={onAdd}
      variant="primary"
      hierarchy="solid"
      icon={<Plus className="size-3.5" />}
    >
      Nuevo curso
    </Button>
  </div>
);
