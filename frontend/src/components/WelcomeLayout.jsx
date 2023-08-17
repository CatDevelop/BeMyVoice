import React from 'react';
import {Outlet} from 'react-router-dom';
import WidthContent from "./WidthContent/WidthContent";

const HomeLayout = () => {
    return (
        <div>
            {/*<NavBar type="main"/>*/}
            <WidthContent>
                <Outlet/>
            </WidthContent>
            {/*<Footer/>*/}
        </div>
    );
};

export default HomeLayout;
