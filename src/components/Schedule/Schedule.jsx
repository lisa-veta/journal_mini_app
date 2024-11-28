import { useState } from 'react';
import { Day } from "components/index.jsx";

function Schedule(props) {
    const [week, setWeek] = useState(() => {
        // Найти неделю, где is_even=true
        const evenWeek = props.weeks.find(w => w.is_even === true);
        return evenWeek || props.weeks[0];
    });

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
        // document.querySelector('.nav-container').classList.add('semi-transparent');
    };

    const removeTransparentClass = () => {

        document.querySelector('.schedule-days-container').classList.remove('semi-transparent');
        //document.querySelector('.nav-container').classList.remove('semi-transparent');
    };
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

            <div className='schedule-days-container'>
                {week.days.map(day => (
                    <Day key={day.day_number} day={day} />
                ))}
            </div>
        </div>
    );
};

export default Schedule;