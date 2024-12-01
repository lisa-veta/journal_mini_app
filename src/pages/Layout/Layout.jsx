import React from "react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => (
    <div>
        <header>
            <nav style={{ fontSize: "2rem", margin: "5rem 0 2rem 2rem", fontWeight: 500 }}>
                <Link to="/">Назад к журналу</Link>
            </nav>
        </header>
        <main>{children}</main>
    </div>
);

export default Layout