import React, { useState } from "react";
import "./AttendanceTable.css";

const AttendanceTable = ({ students, schedule, currentLessonId }) => {
    const [cellStates, setCellStates] = useState({});

    const handleCellClick = (studentId, lessonId) => {
        if (lessonId !== currentLessonId) return;

        const cellKey = `${studentId}-${lessonId}`;
        setCellStates((prev) => ({
            ...prev,
            [cellKey]: ((prev[cellKey] || 0) + 1) % 4,
        }));
    };

    const getCellStyle = (state, isActive) => {
        let style = {};

        if (!isActive) {
            return { backgroundColor: "#e0e0e0", cursor: "not-allowed", text: '' };
        }

        switch (state) {
            case 1:
                style = { backgroundColor: "#e69191"};
                break;
            case 2:
                style = { backgroundColor: "#ffec98" };
                break;
            case 3:
                style = { backgroundColor: "#aaeaff" };
                break;
            default:
                break;
        }

        return style;
    };

    const getCellText = (state) => {
        let text = '';

        switch (state) {
            case 1:
                text = "н";
                break;
            case 2:
                text = "б";
                break;
            case 3:
                text = "у";
                break;
            default:
                break;
        }

        return text;
    };

    return (
        <div className="attendanceTable-wrapper">
            <table className="attendanceTable">
                <thead>
                <tr>
                    <th>Студент</th>
                    {schedule.map((item) => (
                        <th
                            key={item.id}
                            className="attendanceTable__vertical-header"
                            style={{
                                backgroundColor:
                                    item.id === currentLessonId ? "#f9f9f9" : "#e0e0e0",
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
                        <td>{student.name}</td>
                        {schedule.map((item) => (
                            <td
                                key={item.id}
                                style={getCellStyle(cellStates[`${student.id}-${item.id}`], item.id === currentLessonId)}
                                onClick={() => handleCellClick(student.id, item.id)}
                            >
                                {getCellText(cellStates[`${student.id}-${item.id}`])} {}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;