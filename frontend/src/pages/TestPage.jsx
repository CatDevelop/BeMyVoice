import s from './Pages.module.css'
import {useNavigate} from "react-router-dom";

export const TestPage = (props) => {
    const navigate = useNavigate()
    return (
        <div className={s.welcomePage}>
            <div className={s.mainContainer}>
                <button onClick={() => navigate("/")}>Старт</button>
            </div>
        </div>
    )
}
