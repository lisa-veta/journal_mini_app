import React, { useState, useEffect } from "react";
import { doneAttendance } from "../../services/api/send.js";
import { ScheduleService } from "../../services/scheduleService/ScheduleService";
import "./SaveAttendanceButton.css"
const SaveAttendanceButton = ({ schedule, currentLessonData, hasChanges, setHasChanges, lesson, isHeadman}) => {
    //console.debug("КНОППКАА", lesson, schedule, currentLessonData);
    const currentLesson = schedule.find(item => item.isLessonCurrent === true);
    const [showPopup, setShowPopup] = useState(false);
    const popupClass = showPopup ? 'buttonSave__popup-visible' : 'buttonSave__popup-hidden';
    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);
    const handleSave = async () => {
        try {
            console.debug(currentLessonData)
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
            const updatedStudents = currentLessonData.map(student => ({
                condition: transformCondition(student.condition),
                id: student.studentId,
            }));
            console.log("updatedStudents", updatedStudents)
            const scheduleService = new ScheduleService();
            const id = await scheduleService.getAttendanceId(schedule, lesson.id)
            await doneAttendance(id, updatedStudents);
            setShowPopup(true);
            setHasChanges(false);
            console.log("Посещаемость сохранена успешно!");
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", error);
        }
    };
    if (currentLesson) {

        return (
            <div className="buttonSave-container">
                <div  className={`buttonSave ${!hasChanges || !isHeadman ? 'buttonSave_disabled' : ''}`}>
                    <button className={`buttonSave__btn`} onClick={handleSave} disabled={!hasChanges || !isHeadman}>
                        {isHeadman ? 'Сохранить' : 'У вас нет прав на сохранение'}
                    </button>
                </div>
                {showPopup && (
                    <div className={`buttonSave__popup ${popupClass}`}>
                        Изменения сохранены!
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div className="buttonSave-container">
                <div className="buttonSave buttonSave_disabled">
                    <button disabled>Нет текущей пары</button>
                </div>
            </div>

        );
    }
};

export default SaveAttendanceButton;