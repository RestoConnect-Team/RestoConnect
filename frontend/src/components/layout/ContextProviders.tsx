"use client";

import SettingProvider from "@/contexts/SettingsContext";
import { ReactNode } from "react";

export default function ContextProviders({
  children,
}: {
  children: ReactNode;
}) {
  return <SettingProvider>{children}</SettingProvider>;
}
