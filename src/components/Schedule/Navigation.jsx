import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

function Navigation() {
    return (
        <div className='nav-container'>
            <div className='nav-content'>
                <Link to='/something' className='nav-content__something'></Link>
                <Link to='/schedule' className='nav-content__schedule'></Link>
                <Link to='/attendance/:subjectId' className='nav-content__attendance'></Link>
                <Link to='/account' className='nav-content__account'></Link>
            </div>
        </div>
    );
}

export default Navigation;