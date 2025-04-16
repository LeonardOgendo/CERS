import { useEffect } from "react";
import axiosInstance from "../../api/axiosConfig";
import { useCount } from "../../context/CountsContext";


const CountsFetcher = () => {
    const {
        setActiveEmergenciesCount,
        setResolvedEmergenciesCount,
        setTotalEmergencyReports,
        setTotalResponders,
        setTotalUsers,
    } = useCount();

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [activeRes, resolvedRes, emergenciesRes, respondersRes, usersRes] = await Promise.all([
                    axiosInstance.get('/emergencies/active/list/'),
                    axiosInstance.get('/emergencies/resolved/list/'),
                    axiosInstance.get('/emergencies/all/list/'),
                    axiosInstance.get('/admin/responders/view/'),
                    axiosInstance.get('/users/all-users/')
                ]);

                setActiveEmergenciesCount(activeRes.data.results.length);
                setResolvedEmergenciesCount(resolvedRes.data.results.length);
                setTotalEmergencyReports(emergenciesRes.data.length);
                setTotalResponders(respondersRes.data.length);
                setTotalUsers(usersRes.data.length);

            } catch (error) {
                console.error('Failer to fetch dashboard counts', error);
            }
        };

        fetchCounts();

        const interval = setInterval(fetchCounts, 5000);
        return () => clearInterval(interval);

    }, [])

    return null;
}

export default CountsFetcher;