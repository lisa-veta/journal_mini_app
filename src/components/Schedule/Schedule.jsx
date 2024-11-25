import { useState } from 'react';
import { Day } from "components/index.jsx";
function Schedule(props) {
    const [week, setWeek] = useState(props.weeks[0]);

    const handleWeekChange = (event) => {
        const selectedWeekIndex = event.target.value;
        switch (selectedWeekIndex) {
            case '1':
                setWeek(props.weeks[0]);
                break;
            default:
                setWeek(props.weeks[1]);
        }
    };

    return (
        <div className='schedule-container'>
            <div className='week-select-container'>
                <select className='select-list' onChange={handleWeekChange}>
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