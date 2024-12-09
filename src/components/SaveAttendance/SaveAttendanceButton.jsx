import React, { useState, useEffect } from "react";
import { doneAttendance } from "../../services/api/send.js";
import "./SaveAttendanceButton.css"
const SaveAttendanceButton = ({ schedule, currentLessonData, attendanceId, hasChanges, setHasChanges}) => {
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
            const updatedStudents = currentLessonData.map(student => ({
                condition: student.condition === 0 ? 4 : student.condition,
                id: student.studentId,
            }));
            console.log(updatedStudents)
            await doneAttendance(attendanceId, updatedStudents);
            setShowPopup(true);
            setHasChanges(false);
            console.log("Посещаемость сохранена успешно!");
        } catch (error) {
            console.error("Ошибка при создании посещаемости:", error);
        }
    };
    if (currentLesson) {

        return (
            <div className="buttonSave-container buttonSave_position">
                <div  className={`buttonSave ${!hasChanges ? 'buttonSave_disabled' : ''}`}>
                    <button className={`buttonSave__btn`} onClick={handleSave} disabled={!hasChanges}>Сохранить</button>
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
            <div className="buttonSave-container buttonSave_position">
                <div className="buttonSave buttonSave_disabled">
                    <button disabled>Нет текущей пары</button>
                </div>
            </div>

        );
    }
};

export default SaveAttendanceButton;