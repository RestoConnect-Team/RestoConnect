import { createContext, ReactNode, useContext, useState } from "react";

const SettingContext = createContext(
  {} as {
    isTutorialOpen: boolean | undefined;
    setIsTutorialOpen: (isOpen: boolean) => void;
  },
);

export default function SettingProvider({ children }: { children: ReactNode }) {
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>();

  return (
    <SettingContext.Provider value={{ isTutorialOpen, setIsTutorialOpen }}>
      {children}
    </SettingContext.Provider>
  );
}

export const useSettings = () => useContext(SettingContext);
