import { useState } from 'react';

function Schedule(props) {
    const [week, setWeek] = useState(props.weeks[0]);

    return (
        <div className='schedule-container'>
            <div className='week-select-container'>
                <select className='select-list'>
                    <option className='select-list__item'>1 неделя</option>
                    <option className='select-list__item'>2 неделя</option>
                </select>
            </div>

            <div>
                само расписание
            </div>
        </div>
    );
};

export default Schedule;