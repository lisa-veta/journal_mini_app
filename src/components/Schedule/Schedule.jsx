import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Day } from "components/index.jsx";
import { ScheduleService } from 'services/scheduleService/ScheduleService.js';

function Schedule(props) {
    const navigate = useNavigate();

    const [week, setWeek] = useState(() => {
        // Найти неделю, где is_even=true
        const evenWeek = props.weeks.find(w => w.is_even === true);
        return evenWeek || props.weeks[0];
    });

    const [currentLesson, setCurrentLesson] = useState({
        text: "Сейчас нет пары",
        onClick: null,
        style: {cursor: 'none'}
    });

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
                const currentLesson = await new ScheduleService().FindCurrentLesson(5);
                if (!currentLesson) {
                    setCurrentLesson({
                        text: "Сейчас нет пары",
                        onClick: null,
                        style: { cursor: 'default' }
                    });
                } else {
                    setCurrentLesson({
                        text: `Перейти к отметкам текущей пары: ${currentLesson.lesson}`,
                        onClick: () => {
                            navigate(`/attendance/${currentLesson.id}`,
                                { state:
                                    {
                                        lesson: 
                                        {
                                            name: currentLesson.lesson,
                                            id_lesson: currentLesson.id_lesson,
                                            room: currentLesson.classroom,
                                            teacher: `${currentLesson.lastname} ${currentLesson.name} ${currentLesson.patronymic}`,
                                            teacher_lastName: currentLesson.lastname,
                                            teacher_name: currentLesson.name,
                                            teacher_patronymic: currentLesson.patronymic,
                                            type_id: (currentLesson.type_lesson === "Лекция") ? 1 :
                                                (currentLesson.type_lesson === "Практика") ? 2 :
                                                    (currentLesson.type_lesson === "Лабораторная работа") ? 3 : 4,
                                            //building_id: 1,
                                            start_time: currentLesson.lesson_start_time,
                                            end_time: currentLesson.lesson_end_time,
                                            id: currentLesson.id
                                        }
                                    }
                                });
                        },
                        style: { cursor: 'pointer' }
                    });
                }
            } catch (error) {
                console.error("Ошибка при получении текущего урока:", error);
            }
        })();

    }, [props.weeks, week]);

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

            <div className='schedule-container__current-lesson-navigation-container'>
                <button className='schedule-container__current-lesson-button'
                    onClick={currentLesson.onClick}
                    style={currentLesson.style}                >
                    {currentLesson.text}
                    
                </button>
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