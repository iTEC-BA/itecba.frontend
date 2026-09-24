import { useAuthorization } from "@/hooks/useAuthorization";
import { canEditCourse } from "../utils/coursePermissions";
import type { CourseData } from "../services/coursesService";

export const useCoursePermissions = () => {
  const { can } = useAuthorization();
  const canEditCourses = can("courses.edit");
  const canManageCourses = can("courses.manage");

  return {
    canEditCourses,
    canManageCourses,
    canEditCourse: (course: Pick<CourseData, "id" | "_id" | "categoria">) =>
      canEditCourse(canEditCourses, course),
    canDeleteCourse: (course: Pick<CourseData, "id" | "_id" | "categoria">) =>
      canEditCourse(canManageCourses, course),
  };
};
