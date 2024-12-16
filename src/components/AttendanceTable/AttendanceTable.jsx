import React, {useEffect, useState, useRef} from "react";
import "./AttendanceTable.css";
import { getCellText, getCellStyle } from "./config";
import {SaveAttendanceButton} from "../index";

const AttendanceTable = ({ students, schedule, attendStudents, lesson, isHeadman }) => {
    const [cellStates, setCellStates] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const currentLessonRef = useRef(null);


    useEffect(() => {
        if (currentLessonRef.current) {
            currentLessonRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [schedule]);

    useEffect(() => {
        const initialStates = {};
        attendStudents.forEach((entry) => {
            const cellKey = `${entry.studentId}-${entry.scheduleId}`;
            initialStates[cellKey] = entry.condition;
        });
        setCellStates(initialStates);
    }, [attendStudents]);


    const handleCellClick = (studentId, lesson) => {

        if (lesson.isLessonCurrent !== true) return;

        const cellKey = `${studentId}-${lesson.id}`;
        setHasChanges(true);

        setCellStates((prev) => {
            const currentState = prev[cellKey] || 0;
            return {
                ...prev,
                [cellKey]: (currentState + 1) % 4,
            };
        });
    };
    const getCurrentLessonData = (schedule) => {
        let currentLessonId;
        for (const entry of schedule) {
            if (entry.isLessonCurrent === true) {
                currentLessonId = entry.id;
                break;
            }
        }
        return students.map((student) => {
            const cellKey = `${student.id}-${currentLessonId}`;
            const condition = cellStates[cellKey] || 0;
            return {
                studentId: student.id,
                condition,
            };
        });
    };
    return (
        <div>
            <div className="attendancePrev">
                {hasChanges ? "Есть несохраненные изменения" : ""}
            </div>
            <div className="attendanceTable-wrapper">
                <table className="attendanceTable">
                    <thead>
                    <tr>
                        <th>Студент</th>
                        {schedule.map((item) => (
                            <th
                                key={item.id}
                                ref={item.isLessonCurrent === true ? currentLessonRef : null}
                                className="attendanceTable__vertical-header"
                                style={{
                                    backgroundColor:
                                        item.isLessonCurrent === true ? "#ffffff" : "#e0e0e0",
                                    border: item.isLessonCurrent === true ? "2px solid rgb(112,112,112)" : "",
                                    borderWidth: "2px",
                                }}
                            >
                                {item.date}, {item.lesson}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.lastname} {student.name[0]}.</td>
                            {schedule.map((item) => {
                                // Ищем состояние для текущей ячейки
                                const cellState = cellStates[`${student.id}-${item.id}`];
                                return (
                                    <td
                                        key={item.id}
                                        style={
                                        getCellStyle(cellState, item.isLessonCurrent === true)
                                    }
                                        onClick={() => handleCellClick(student.id, item)}
                                    >
                                        {getCellText(cellState)} {/* Выводим текст состояния */}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div>
                <SaveAttendanceButton schedule={schedule} currentLessonData={getCurrentLessonData(schedule)}
                                 hasChanges={hasChanges} setHasChanges={setHasChanges} lesson={lesson} isHeadman={isHeadman}></SaveAttendanceButton>
            </div>
        </div>
    );
};

export default AttendanceTable;