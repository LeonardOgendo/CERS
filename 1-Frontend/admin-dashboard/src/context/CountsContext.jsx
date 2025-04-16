import { createContext, useContext, useState } from "react";

const CountsContext = createContext();

export const CountsProvider = ({ children }) => {
    const [activeEmergenciesCount, setActiveEmergenciesCount] = useState(0);
    const [resolvedEmergenciesCount, setResolvedEmergenciesCount] = useState(0);
    const [totalEmergencyReports, setTotalEmergencyReports] = useState(0);
    const [totalResponders, setTotalResponders] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const allValues = {
        activeEmergenciesCount,
        setActiveEmergenciesCount,
        resolvedEmergenciesCount,
        setResolvedEmergenciesCount,
        totalEmergencyReports,
        setTotalEmergencyReports,
        totalResponders,
        setTotalResponders,
        totalUsers,
        setTotalUsers,
    }
    return(
       <CountsContext.Provider value={allValues}>
            {children}
       </CountsContext.Provider>
    )
}

// Custom hook

export const useCount = () => {
    return useContext(CountsContext);
}