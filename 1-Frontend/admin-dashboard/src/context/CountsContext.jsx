import { createContext, useContext, useState } from "react";

const CountsContext = createContext();

export const CountsProvider = ({children}) => {
    const [emergencyCount, setEmergencyCount] = useState(0);

    return(
       <CountsContext.Provider value={{ emergencyCount, setEmergencyCount }}>
            {children}
       </CountsContext.Provider>
    )
}

// Custom hook

export const useEmergencyCount = () => {
    return useContext(CountsContext);
}