import React from "react";
import { Link } from "react-router-dom";
import {ScheduleService} from "../../services/scheduleService/ScheduleService";
import {doneAttendance, incrementCurrentAttendance} from "../../services/api/send";
import {useSaveAttendance} from "../../hooks/useSaveAttendance";

const Layout = ({ children, schedule, currentLessonData, telegramId, lesson, hasChanges, isHeadman }) => {
    const { saveAttendance } = useSaveAttendance(schedule, lesson, telegramId);
    const handleSaveAttendance = async () => {
        if (hasChanges && isHeadman) {
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