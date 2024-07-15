import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface UserActivityContextType {
  isUserActive: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  polling: boolean;
  setPolling: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUserActive, setIsUserActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      setIsUserActive(true);
      timeout = setTimeout(() => {
        setIsUserActive(false);
        setShowModal(true);
        setPolling(false);
      }, 3 * 60 * 1000); // 3 minutes timeout
    };

    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      clearTimeout(timeout);
    };
  }, []);

  const value = {
    isUserActive,
    showModal,
    setShowModal,
    polling,
    setPolling,
  };

  return (
    <UserActivityContext.Provider value={value} >
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivity = (): UserActivityContextType => {
  const context = useContext(UserActivityContext);
  if (!context) {
    throw new Error("useUserActivity must be used within a UserActivityProvider");
  }
  return context;
};
