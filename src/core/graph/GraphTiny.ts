import { interpolateString as interpolate } from 'd3-interpolate';
import { tweened } from 'svelte/motion';
import type { GraphInterface } from './GraphInterface';
    
export class GraphTiny implements GraphInterface {
    private step: number;
    private w: number;
    private h: number;
    private halfH: number;
    private cursorRadius: number;
    private progress: number;

    private isConfigured: boolean = false;

    private box: HTMLElement;
    private shape: string;
    private path;
    private time;

    constructor(id: string) {
        this.box = document.getElementById(id) as HTMLElement;

        this.h = this.box.offsetHeight;
        this.w = this.box.offsetWidth;
        this.cursorRadius = 8;
        this.halfH = Math.trunc(this.h / 2);
        this.progress = this.cursorRadius;
   
        this.shape = `M0 ${this.halfH}`;
        // for (let i = 1; i <= this.w; i++) {
        //     this.shape = `${this.shape} L${(i / this.w) * this.w} 10 `;
        // }

        this.shape = `${this.shape} L${this.w} ${this.halfH} `;

        this.path = tweened(this.shape, { interpolate });
    }

    setParams(allTime: number, timerStep: number, time, path) {
        this.time = time;
        this.path = path;
        this.path.set(this.shape, { interpolate });
        console.log('time===', time);
        this.step = ((this.w - this.halfH) / allTime) * (timerStep / 1000);
        this.isConfigured = true;
    }

    configured() {
        return this.isConfigured;
    }
    
    getStep() {
        return this.step;
    }

    getWidth() {
        return this.w;
    }

    getHeight() {
        return this.h;
    }

    getCursorRadius() {
        return this.cursorRadius;
    }

    dropConfigured() {
        this.isConfigured = false;
        this.time.set(this.cursorRadius, {duration: 200, easing: x => x});
    }

    progressInc() {
        this.progress += this.step;
    }

    drawStep(duration: number) {
        this.time.set(this.progress, {duration, easing: x => x});
    }

    drawToEnd(color: string) {
        this.time.set(this.w - this.cursorRadius, {duration: 200, easing: x => x});
    }
    
}