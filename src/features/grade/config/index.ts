import type { GradeConfig } from '../types/grade.types';
import { GRADE_SISTEMAS }    from './grade_sistemas';
import { GRADE_ELECTRONICA } from './grade_electronica';

export const GRADE_CONFIGS: Record<string, GradeConfig> = {
  sistemas:    GRADE_SISTEMAS,
  electronica: GRADE_ELECTRONICA,
};

export { GRADE_SISTEMAS, GRADE_ELECTRONICA };
export type { GradeConfig };
