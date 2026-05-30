// src/features/courses/components/molecules/CourseBreadcrumb.tsx
// Migas de pan responsivas para la navegación de cursos
import React from "react";
import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
  className?: string;
}

export const CourseBreadcrumb: React.FC<Props> = ({ crumbs, className = "" }) => (
  <nav
    aria-label="Ruta de navegación"
    className={`flex items-center gap-1.5 text-xs text-itec-gray flex-wrap ${className}`}
  >
    {crumbs.map((crumb, i) => {
      const isLast = i === crumbs.length - 1;
      return (
        <React.Fragment key={i}>
          {i > 0 && (
            "/"
          )}
          {crumb.href && !isLast ? (
            <Link
              to={crumb.href}
              className="hover:text-itec-text transition-colors truncate max-w-[120px] sm:max-w-none"
            >
              {crumb.label}
            </Link>
          ) : (
            <span
              className={`truncate max-w-[160px] sm:max-w-none ${
                isLast ? "text-itec-text font-medium" : ""
              }`}
            >
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      );
    })}
  </nav>
);
