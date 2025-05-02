import { useState, useEffect } from 'react';
import { Day, Lesson } from "components/index.jsx";
import { ScheduleService } from 'services/scheduleService/ScheduleService.js';
import {incrementOpenCurrentLesson} from "../../services/api/send";
import {useSelector} from "react-redux";

function Schedule(props) {
    const style = { backgroundColor: 'var(--colorRed)' };
    const telegramId = props.telegramId;
    const [week, setWeek] = useState(() => {
        const evenWeek = props.weeks.find(w => w.is_even === true);
        return evenWeek || props.weeks[0];
    });
    const [currentLessons, setCurrentLessons] = useState([]);
    const userRole = useSelector(state => state.userRole);

    useEffect(() => {
        const evenWeek = props.weeks.find(w => w.is_even === true);
        setWeek(evenWeek || props.weeks[0]);
    }, [props.weeks]);

    const handleWeekChange = (event) => {

        document.querySelector('.select-list').blur();

        const selectedWeekIndex = event.target.value;
        switch (selectedWeekIndex) {
            case '1':
                setWeek(props.weeks[0]);
                break;
            default:
                setWeek(props.weeks[1]);
        }
    };

    const addTransparentClass = () => {
        document.querySelector('.schedule-days-container').classList.add('semi-transparent');
    };

    const removeTransparentClass = () => {
        document.querySelector('.schedule-days-container').classList.remove('semi-transparent');
    };

    useEffect(() => {
        (async () => {
            try {
                const currentLessons = await new ScheduleService(null, null, null, null, props.date, props.schedule).FindCurrentLessons();
                if (currentLessons.length !== 0) {
                    if(userRole === 'student') {
                        const lessons = currentLessons.map((lesson) => {
                            return {
                                name: lesson.lesson,
                                id_lesson: lesson.id_lesson,
                                room: lesson.classroom,
                                teachers: lesson.teachers.map(t => t),
                                type_id: (lesson.type_lesson === "Лекция") ? 1 :
                                    (lesson.type_lesson === "Практика") ? 2 :
                                        (lesson.type_lesson === "Лабораторная работа") ? 3 : 4,
                                start_time: lesson.lesson_start_time,
                                end_time: lesson.lesson_end_time,
                                id: lesson.id,
                                style: { backgroundColor: 'var(--colorBlue)'}
                            }
                        });
                        setCurrentLessons(lessons);
                        return;
                    }

                    const lessons = currentLessons.map((lesson) => {
                        return {
                            name: lesson.lesson,
                            id_lesson: lesson.id_lesson,
                            room: lesson.classroom,
                            group_id: lesson.group_id,
                            group_name: lesson.abbr_group,
                            type_id: (lesson.type_lesson === "Лекция") ? 1 :
                            (lesson.type_lesson === "Практика") ? 2 :
                                (lesson.type_lesson === "Лабораторная работа") ? 3 : 4,
                            start_time: lesson.lesson_start_time,
                            end_time: lesson.lesson_end_time,
                            id: lesson.id,
                            class_id: lesson.class_id,
                            style: { backgroundColor: 'var(--colorBlue)'}
                        }
                    });
                    setCurrentLessons(lessons);
                }
            } catch (error) {
                console.error("Ошибка при получении текущей пары:", error);
            }
        })();

    }, [props.weeks, week, props.date]);

    useEffect(() => {
        (() => {
            const currentWeekNumber = new ScheduleService().GetCurrentWeekNumber(
                new Date(props.date.year,
                    props.date.month - 1,
                    props.date.day,
                    props.date.hour,
                    props.date.minute));
            setWeek(props.weeks[currentWeekNumber - 1]);
        })()
    }, [props.date, props.weeks]);

    const selectedWeekIndex = props.weeks.indexOf(week) + 1;
    return (
        <div className='schedule-container'>
            <div className='week-select-container'>
                <select className='select-list'
                        value={selectedWeekIndex}
                    onChange={handleWeekChange}
                    onFocus={addTransparentClass}
                    onBlur={removeTransparentClass}
                >
                    <option className='select-list__item' value='1'>1 неделя</option>
                    <option className='select-list__item' value='2'>2 неделя</option>
                </select>
            </div>

            <div className='current-lesson-label'>
                {currentLessons.length === 2 ? 'Текущие пары' : 'Текущая пара'}
            </div>
            <div className='current-lesson-container day-container'>
                {currentLessons.length === 0 ?
                    (
                        <div className='lesson-container' style={style}>
                            Нет текущей пары
                        </div>
                    ) : (
                        currentLessons.map((lesson) => {
                            return (
                                <Lesson lesson={lesson} style={style} incrementMethod={() => {
                                    incrementOpenCurrentLesson(telegramId);}} >
                                </Lesson>
                            )
                        })
                    )
                }
            </div>

            <div className='schedule-days-container'>
                {week.days.map(day => (
                    <Day key={day.day_number} day={day} />
                ))}
            </div>
        </div>
    );
}

export default Schedule;