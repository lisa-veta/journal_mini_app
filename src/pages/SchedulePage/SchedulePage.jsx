import "./SchedulePage.css"
import { Schedule } from "components/index.jsx";
import { useEffect, useState } from 'react';
import { ScheduleService } from '../../services/scheduleService/ScheduleService.js';

const SchedulePage = (props) => {

    const [weeks, setWeeks] = useState([
        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
    ]);

    useEffect(() => {
        ( () => {
            try {
                const parsedData = props.schedule
                //console.log('ответ с сервера', JSON.stringify(data));

                const tempSchedule = {
                    weeks: [
                        { is_even: false, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) },
                        { is_even: true, days: Array(6).fill(null).map((_, index) => ({ day_number: index + 1, subjects: [] })) }
                    ]
                };

                for (let i = 0; i < parsedData.length; i++) {
                    let dayIndex = new ScheduleService().GetWeekDayIndex(parsedData[i].week_day);
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
    }, [props.schedule]);

    return (
        <div className="schedule-content">
            <h1 className='schedule-header schedule-header_position'>Расписание</h1>
            <Schedule weeks={weeks} groupId={props.groupId} date={props.date} schedule={props.schedule}></Schedule>
            {/*<Navigation></Navigation>*/}
        </div >
    );
};
export default SchedulePage;