// src/routes/PageSuspense.tsx
import React, { Suspense } from "react";
import LoadingState from "@components/ui/LoadingState";

export const PageSuspense: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingState />}>{children}</Suspense>
);
