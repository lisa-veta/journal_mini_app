import React, { useState, useEffect } from "react";
import "./SaveAttendanceButton.css"
import {useSaveAttendance} from "../../hooks/useSaveAttendance";
import {useSelector} from "react-redux";

const SaveAttendanceButton = ({ schedule, currentLessonData, hasChanges, setHasChanges, lesson, isHeadman, telegramId}) => {
    const [showPopup, setShowPopup] = useState(false);
    const userRole = useSelector((state) => state.userRole);
    const { saveAttendance } = useSaveAttendance(schedule, lesson, telegramId, userRole);
    const popupClass = showPopup ? 'buttonSave__popup-visible' : 'buttonSave__popup-hidden';
    const currentLesson = schedule.find(item => item.isLessonCurrent === true);

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
                {userRole === 'student' ? (
                <div  className={`buttonSave ${!hasChanges || !isHeadman ? 'buttonSave_disabled' : ''}`}>

                        <button className={`buttonSave__btn`} onClick={handleSave} disabled={!hasChanges || !isHeadman}>
                            {isHeadman ? 'Сохранить' : 'У вас нет прав на сохранение'}
                        </button>
                </div>
                    ) : (
                    <div  className="buttonSave">
                        <button className={`buttonSave__btn`} onClick={handleSave}>
                            {hasChanges ? 'Сохранить и подтвердить' : 'Подтвердить'}
                        </button>
                    </div>
                    )}
                {showPopup && (
                    <div className={`buttonSave__popup ${popupClass}`}>
                        {userRole==='student' ? "Изменения сохранены!" : "Посещаемость подтверждена!"}
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