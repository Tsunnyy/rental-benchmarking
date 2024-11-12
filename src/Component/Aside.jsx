import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Aside = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [completedStep, setCompletedStep] = useState(0);
    const [currentId, setCurrentId] = useState(null);

    const apiUrl = import.meta.env.VITE_API_KEY;

    // Get current ID from URL
    const getCurrentId = () => {
        const matches = location.pathname.match(/\/([^\/]+)$/);
        return matches && !isNaN(matches[1]) ? matches[1] : null;
    };

    // Fetch completed step when ID changes
    useEffect(() => {
        const id = params.id || getCurrentId();
        if (id) {
            setCurrentId(id);
            axios.get(`${apiUrl}/api/rental_benchmarking/get_report_data?id=${id}`)
                .then((response) => {
                    setCompletedStep(response.data.data.completed_step || 0);
                })
                .catch((error) => {
                    console.error('Error fetching step data:', error);
                });
        } else {
            setCompletedStep(0);
            setCurrentId(null);
        }
    }, [location.pathname]);

    const asideData = [
        {
            id: 1,
            title: "Home",
            path: "/",
            icon: "home",
            step: 0
        },
        {
            id: 2,
            title: "Subject Property Details",
            path: currentId ? `/subject-property/${currentId}` : "/subject-property",
            icon: "subject",
            step: 1
        },
        {
            id: 3,
            title: "Frontage / Vintage",
            path: currentId ? `/comparable-details/${currentId}` : "/comparable-details",
            icon: "frontage",
            step: 2
        },
        {
            id: 4,
            title: "Subject Lease Clause",
            path: currentId ? `/site-lease-terms/${currentId}` : "/site-lease-terms",
            icon: "clause",
            step: 3
        },
        {
            id: 5,
            title: "Recommended Rentals",
            path: currentId ? `/recommended-rentals/${currentId}` : "/recommended-rentals",
            icon: "rental",
            step: 4
        }
    ];

    const handleNavigation = (e, item) => {
        // Always allow navigation to home
        if (item.step === 0) return true;

        // If this is a new entry (no ID)
        if (!currentId && item.step > 1) {
            e.preventDefault();
            alert("Please complete the subject property details first.");
            return false;
        }

        // For existing entries, check if the step is accessible
        if (currentId && item.step > completedStep + 1) {
            e.preventDefault();
            alert("Please complete the previous steps first.");
            return false;
        }

        return true;
    };

    return (
        <aside>
            <img src="/rental-benchmarking/img/logo.svg" alt="" className="logo" />
            <ul>
                {asideData.map((item) => (
                    <li key={item.id} className={item.step > completedStep + 1 ? 'disabled' : ''}>
                        <NavLink
                            className={({ isActive }) =>
                                `${isActive ? "active" : ""} ${item.step > completedStep + 1 ? 'disabled' : ''}`
                            }
                            to={item.path}
                            onClick={(e) => handleNavigation(e, item)}
                            style={item.step > completedStep + 1 ? {
                                opacity: 0.5,
                                cursor: 'not-allowed'
                            } : {}}
                        >
                            {item.icon && <img src={`/rental-benchmarking/img/icons/${item.icon}.svg`} alt="" />}
                            {item.title}
                            {item.step > completedStep + 1 &&
                                <span className="lock-icon"></span>
                            }
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Aside;