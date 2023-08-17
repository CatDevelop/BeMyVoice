import React from 'react';
import s from './WidthContent.module.css';
import {FloatButton, theme, Tooltip} from "antd";
import {useTheme} from "../../hooks/use-theme";
import { BulbOutlined } from '@ant-design/icons';
import {useDispatch} from "react-redux";
import {setTheme} from "../../store/slices/localSlice";

function WidthContent ({children}) {
    const theme = useTheme()
    const dispatch = useDispatch()

    return (
        <div className={s.container} style={{backgroundColor: theme.theme === 'dark' ? "#242428" : "#FFFFFF"}}>
            <div className={s.app}>
                {children}
                {/*<Tooltip placement="left" title={"Сменить тему"} arrow={false}>*/}
                {/*    <FloatButton icon={<BulbOutlined />} type="default" onClick={() => {*/}
                {/*        dispatch(setTheme())*/}
                {/*        if(theme.isDark)*/}
                {/*            document.body.classList.remove('darkTheme');*/}
                {/*        else*/}
                {/*            document.body.classList.toggle('darkTheme');*/}
                {/*    }}/>*/}
                {/*</Tooltip>*/}
            </div>
        </div>
    )
}

export default WidthContent;
