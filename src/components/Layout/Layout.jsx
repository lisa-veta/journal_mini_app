import React from "react";
import { Link } from "react-router-dom";
import {ScheduleService} from "../../services/scheduleService/ScheduleService";
import {doneAttendance, incrementCurrentAttendance} from "../../services/api/send";

const Layout = ({ children, schedule, currentLessonData, telegramId, lesson, hasChanges, isHeadman }) => {

    const transformCondition = (condition) => {
        switch (condition) {
            case 0:
                return 1;
            case 1:
                return 4;
            default:
                return condition;
        }
    };
    const handleSaveAttendance = async () => {
        try {
            if(hasChanges && isHeadman) {
                const updatedStudents = currentLessonData.map(student => ({
                    condition: transformCondition(student.condition),
                    id: student.studentId,
                }));
                console.log("updatedStudents", updatedStudents)
                const scheduleService = new ScheduleService();
                const id = await scheduleService.getAttendanceId(schedule, lesson.id)
                await doneAttendance(id, updatedStudents);

                console.log("Посещаемость сохранена успешно!", updatedStudents);
                await incrementCurrentAttendance(telegramId);
                console.log("Типа инкремент сохранения произошел");
            }
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", error);
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