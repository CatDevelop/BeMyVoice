import React from 'react';
import s from './WidthContent.module.css';

function WidthContent({children}) {
    return (
        <div className={s.container} style={{backgroundColor: "#242428"}}>
            <div className={s.app}>
                {children}
            </div>
        </div>
    )
}

export default WidthContent;
