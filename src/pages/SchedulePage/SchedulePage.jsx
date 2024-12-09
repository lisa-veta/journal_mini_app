import "./SchedulePage.css"
import { Navigation, Schedule } from "components/index.jsx";
import { timeTable } from '../../services/api/send.js';
import { useEffect, useState } from 'react';
import { IsLessonCurrent, GetWeekDayIndex } from '../../services/schedule/ScheduleService.js';

const SchedulePage = (props) => {

    const [weeks, setWeeks] = useState(
        [
            { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
            { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
        ]
    );

    useEffect(() => {
        (async () => {
            try {
                const data = await timeTable(props.groupId);
                const parsedData = JSON.parse(JSON.stringify(data));
                //console.log('ответ с сервера', JSON.stringify(data));

                const tempSchedule = {
                    weeks: [
                        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
                        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
                    ]
                };

                for (let i = 0; i < parsedData.length; i++) {
                    let dayIndex = GetWeekDayIndex(parsedData[i].week_day);
                    let weekIndex = parsedData[i].number_week - 1;

                    tempSchedule.weeks[weekIndex].days[dayIndex].day_number = dayIndex + 1;

                    tempSchedule.weeks[weekIndex].days[dayIndex].subjects.push(
                            {
                                name: parsedData[i].lesson,
                                id_lesson: parsedData[i].id_lesson,
                                room: parsedData[i].classroom,
                                teachers: parsedData[i].teachers.map(t => t),
                                type_id: (parsedData[i].type_lesson === "Лекция") ? 1 :
                                    (parsedData[i].type_lesson === "Практика") ? 2 :
                                        (parsedData[i].type_lesson === "Лабораторная работа") ? 3 : 4,
                                //building_id: 1,
                                start_time: parsedData[i].lesson_start_time,
                                end_time: parsedData[i].lesson_end_time,
                                id: parsedData[i].id
                            }
                    );
                }
                
                setWeeks(tempSchedule.weeks);
                //IsLessonCurrent(7);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <div className="schedule-content">
            <h1 className='schedule-header schedule-header_position'>Расписание</h1>
            <Schedule weeks={weeks} groupId={props.groupId} date={props.date}></Schedule>
            {/*<Navigation></Navigation>*/}
        </div >
    );
};
export default SchedulePage;