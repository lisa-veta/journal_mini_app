import { useState, useEffect } from 'react';
import { Day, Lesson } from "components/index.jsx";
import { ScheduleService } from 'services/scheduleService/ScheduleService.js';

function Schedule(props) {
    const style = { backgroundColor: 'var(--colorRed)' };

    const [week, setWeek] = useState(() => {
        // Найти неделю, где is_even=true
        const evenWeek = props.weeks.find(w => w.is_even === true);
        return evenWeek || props.weeks[0];
    });

    const [currentLesson, setCurrentLesson] = useState(null);

    // Для обновления локального состояния при обновлении недель во внешнем компоненте
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

    const addTranstparentClass = () => {

        document.querySelector('.schedule-days-container').classList.add('semi-transparent');
    };

    const removeTransparentClass = () => {

        document.querySelector('.schedule-days-container').classList.remove('semi-transparent');
    };

    useEffect(() => {
        (async () => {
            try {
                // Поменять номер группы в будущем
                console.debug(props.date, "!!!!!!!!!!!!!!!!!!!!!!1")
                const currentLesson = await new ScheduleService(null, null, null, null, props.date, props.schedule).FindCurrentLesson(props.groupId);
                if (!currentLesson) {
                    setCurrentLesson(null);
                } else {
                    setCurrentLesson(
                        {
                            name: currentLesson.lesson,
                            id_lesson: currentLesson.id_lesson,
                            room: currentLesson.classroom,
                            teachers: currentLesson.teachers.map(t => t),
                            type_id: (currentLesson.type_lesson === "Лекция") ? 1 :
                                (currentLesson.type_lesson === "Практика") ? 2 :
                                    (currentLesson.type_lesson === "Лабораторная работа") ? 3 : 4,
                            //building_id: 1,
                            start_time: currentLesson.lesson_start_time,
                            end_time: currentLesson.lesson_end_time,
                            id: currentLesson.id,
                            style: { backgroundColor: '#69e9f5'}
                        }
                    )
                }
            } catch (error) {
                console.error("Ошибка при получении текущей пары:", error);
            }
        })();

    }, [props.weeks, week]);

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
                    onFocus={addTranstparentClass}
                    onBlur={removeTransparentClass}
                >
                    <option className='select-list__item' value='1'>1 неделя</option>
                    <option className='select-list__item' value='2'>2 неделя</option>
                </select>
            </div>

            <div className='current-lesson-label'>Текущая пара</div>
            <div className='current-lesson-container day-container'>
                <Lesson lesson={currentLesson} style={style}></Lesson>
            </div>

            <div className='schedule-days-container'>
                {week.days.map(day => (
                    <Day key={day.day_number} day={day} />
                ))}
            </div>
        </div>
    );
};

export default Schedule;