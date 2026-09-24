import type { CourseData } from "../services/coursesService";

export const isProtectedCourse = (id: string, category?: string): boolean =>
  category === "Oficial"
  || id.startsWith("arquitectura")
  || id.startsWith("podcast")
  || id.startsWith("seminario")
  || id.startsWith("analisis");

export const canEditCourse = (
  canManageCourses: boolean,
  course: Pick<CourseData, "id" | "_id" | "categoria">,
): boolean => {
  const id = course.id ?? course._id;
  return Boolean(
    canManageCourses
    && id
    && !isProtectedCourse(id, course.categoria),
  );
};
