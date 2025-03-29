import React, { useState, useEffect } from "react";
import "./SaveAttendanceButton.css"
import {useSaveAttendance} from "../../hooks/useSaveAttendance";

const SaveAttendanceButton = ({ schedule, currentLessonData, hasChanges, setHasChanges, lesson, isHeadman, telegramId}) => {
    const currentLesson = schedule.find(item => item.isLessonCurrent === true);
    const [showPopup, setShowPopup] = useState(false);
    const popupClass = showPopup ? 'buttonSave__popup-visible' : 'buttonSave__popup-hidden';
    const { saveAttendance } = useSaveAttendance(schedule, lesson, telegramId);
    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);
    const handleSave = async () => {
        await saveAttendance(currentLessonData, setHasChanges);
        setShowPopup(true);
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