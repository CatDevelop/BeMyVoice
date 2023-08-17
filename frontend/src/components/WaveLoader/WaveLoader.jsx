import s from './WaveLoader.module.css'
import classNames from 'classnames'
export const WaveLoader = (props) => {
    const stroke = <span className={s.stroke} style={{ animationPlayState: props.playing ? 'running': 'paused'}}></span>
    return (
        <div>
            <div className={classNames(s.backCont,  !props.playing ? s.backContPause: "")}>
                <div className={s.back} style={{mixBlendMode: 'plus-lighter', width: "482px", height: '256.09px'}}/>
            </div>
            <div className={s.loader}>

                {stroke}
                {stroke}
                {stroke}
                {stroke}
                {stroke}
                {stroke}
                {stroke}
            </div>
        </div>

    )
}
