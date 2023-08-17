import React from 'react';
import ReactDOM from 'react-dom';
import * as VFX from 'react-vfx';

import styled from "styled-components";

const Content = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

const fragmentShader = `
#define u_color vec3(0, 255, 175)
#define u_background vec3(0, 0, 0)
uniform vec2 resolution;
uniform float time;
uniform float enterTime;

mat2 m(float a) {
    float c=cos(a), s=sin(a);
    return mat2(c,-s,s,c);
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}


float map(vec3 p) {
    p.xz *= m(time * 0.4);p.xy*= m(time * 0.1);
    vec3 q = p * 2.0 + time;
    return length(p+vec3(sin(time * 0.1))) * log(length(p) + 0.9) + cos(q.x + sin(q.z + cos(q.y))) * 0.5 - 1.0;
}

void main() {
    vec2 a = gl_FragCoord.xy / resolution.x*1.8 - vec2(1, 1);
    vec3 cl = vec3(0.0);
    float d = 2.5;

    for (int i = 0; i <= 5; i++) {
        vec3 p = vec3(0, 0, 4.0) + normalize(vec3(a, -1.0)) * d;
        float rz = map(p);
        float f =  clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);
        vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
        cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.6 * l;
        d += min(rz, 1.0);
    }
    
    vec4 color = vec4(min(u_color, cl),1.0);
    //color = min(u_background, u_color);
    color.r = max(u_background.r,color.r);
    color.g = max(u_background.g,color.g);
    color.b = max(u_background.b,color.b);
    
    // gl_FragColor = mix(u_color, vec4(0.0), v);
   gl_FragColor = color;
}
`;

export const WaveShader = () => {
    return (
        <VFX.VFXProvider>
            <VFX.VFXSpan  shader={fragmentShader} style={{opacity: 1, width: "500px", height: "500px", display: "block"}}>
            </VFX.VFXSpan>
        </VFX.VFXProvider>
    )
}

