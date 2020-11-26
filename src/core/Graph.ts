export class Graph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private step: number;
    private idealX: number;
    private allTime: number;
    private isConfigured: boolean = false;
    private TWO_PI: number = 2 * Math.PI;
    private lastX: number = 1;
    private newX: number = 1;


    constructor(id: string) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.style.left = 0 + "px";

        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#000';
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStep(h: number, color: string) {
        let colX1 = this.lastX;
        let colY1 = 1;
        let colY2 = this.canvas.height - 2;

        let pacerX = colX1;
        let pacerY = this.canvas.height / 2;

        if (this.step < 1) {
            if (this.newX - this.lastX < 1) {
                this.drawColumn(colX1, colY1, 1, colY2, color);
                this.newX += this.step;
                return;
            }

            this.drawPacer(pacerX, pacerY, color);
            this.drawColumn(colX1, colY1, 1, colY2, color);
            this.newX += this.step;
            this.lastX = this.newX;
            return;
        }

        if (this.idealX < this.lastX) {
            this.drawPacer(pacerX, pacerY, color);
            this.drawColumn(colX1, colY1, this.step, colY2, color);
            this.idealX += this.step;
            return;
        }

        this.drawPacer(pacerX, pacerY, color);
        this.drawColumn(colX1, colY1, this.step, colY2, color);

        this.lastX += this.step;
        this.idealX += this.step;
    }

    private drawColumn(x: number, y: number, w: number, h: number, color: string) {
        // this.ctx.clearRect(x, y, w, h);
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.fillRect(x, y, w, h);
        this.ctx.closePath();
    }

    private drawPacer(x: number, y: number, color: string) {
        let rad = this.canvas.height / 2 - 2; // середина минус границы
        this.ctx.fillStyle = this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, rad, -Math.PI / 2, Math.PI / 2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    setParams(allTime: number, timerStep: number) {
        this.step = (this.canvas.width / allTime) * (timerStep / 1000);
        this.allTime = allTime;
        console.log('step=' + this.step);
        console.log('width=' + this.canvas.width);
        this.isConfigured = true;
    }

    configured() {
        return this.isConfigured;
    }
}