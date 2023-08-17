import s from './SLTVizualizer.module.css'
import classNames from 'classnames'
export const SLTVizualizer = (props) => {
    const stroke = <span className={classNames(s.stroke, !props.playing ? s.pause : '')} style={{ animationPlayState: props.playing ? 'running': 'paused'}}></span>
    return (
        <div>
            <div className={s.vizualizer}>
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
