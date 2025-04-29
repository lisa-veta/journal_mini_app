import React from "react";
import { Link } from "react-router-dom";
import {useSaveAttendance} from "../../hooks/useSaveAttendance";
import {useSelector} from "react-redux";

const Layout = ({ children, schedule, currentLessonData, telegramId, lesson, hasChanges, isHeadman }) => {
    const { saveAttendance } = useSaveAttendance(schedule, lesson, telegramId);
    const userRole = useSelector((state) => state.userRole);
    const handleSaveAttendance = async () => {
        if (hasChanges && isHeadman && userRole==='student') {
            await saveAttendance(currentLessonData);
        }
    };
    return (
        <div>
            <header>
                <nav style={{ fontSize: "2rem", margin: "5rem 0 2rem 2rem", fontWeight: 500 }}>
                    <Link to="/" onClick={handleSaveAttendance}>Назад к журналу</Link>
                </nav>
            </header>
            <main>{children}</main>
        </div>
    );
}

export default Layout