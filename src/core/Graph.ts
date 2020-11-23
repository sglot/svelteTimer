export class Graph {
    private timePoint: HTMLElement;

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    // private config: circleConfig;

    constructor(id: string) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = innerWidth;
        this.canvas.height = innerHeight;
        this.canvas.style.left = 0 + "px";

        // this.timePoint = tp;
        this.ctx.fillStyle = '#ff4456';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAxios(): void {

    }

    drawRect(time: number, color: string) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(time*1000, 0, time + 3, this.canvas.height);
        // console.log(time);
    }
}