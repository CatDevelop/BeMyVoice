import {Dots} from "./Dots";
import React from "react";

export const BackgroundDots = () => {
    return (
        <>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', left: 0, top: 0}}/>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', left: 60, top: 0}}/>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', left: 0, top: 140}}/>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', right: 0, top: 60}}/>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', right: 100, top: 0}}/>
            <Dots style={{zIndex: "0", position: 'absolute', color: 'rgb(65,66,72)', right: 100, bottom: 0}}/>
        </>
    )
}
