export class Graph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private step: number;
    private idealX: number;
    private lastX: number;
    private newX: number;
    private w: number;
    private h: number;
    private rad: number;

    private isConfigured: boolean = false;
    private TWO_PI: number = 2 * Math.PI;
    private M_PI_D_2: number = -Math.PI / 2;
    private borderWidth: number = 2;

    constructor(id: string) {
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d");

        this.canvas.height = this.canvas.offsetHeight;
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.style.left = 0 + "px";

        this.init();
    }

    init() {
        this.w = 2;
        this.h = this.canvas.height - this.w * 2;
        
        this.drawBorder('#0a23d2');
    }

    drawBorder(color: string) {
        this.ctx.strokeStyle = '#222222';
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawPaper();
    }

    drawPaper() {
        this.ctx.fillStyle = '#eeeeee';
        this.ctx.fillRect(this.borderWidth, this.borderWidth, this.canvas.width - this.borderWidth * 2, this.canvas.height - this.borderWidth * 2);
    }

    drawStep(color: string, divide: boolean) {

        let pacerX = this.lastX;
        let pacerY = this.canvas.height / 2;

        if (this.step < 1) {
            if (this.newX - this.lastX < 1) {
                this.drawColumn(this.lastX, this.w, 1, this.h, color);
                this.newX += this.step;
                return;
            }

            // if (pacerX + this.rad < this.canvas.width - this.borderWidth) {
                this.drawPacer(pacerX, pacerY, color, divide);
            // }
            
            this.drawColumn(this.lastX, this.w, 1, this.h, color);
            this.newX += this.step;
            this.lastX = this.newX;
            return;
        }

        if (this.idealX < this.lastX) {
            if (pacerX + this.rad < this.canvas.width - this.borderWidth) {
                this.drawPacer(pacerX, pacerY, color, divide);
            }
            this.drawColumn(this.lastX, this.w, this.step, this.h, color);
            this.idealX += this.step;
            return;
        }

        if (pacerX + this.rad < this.canvas.width - this.borderWidth) {
            this.drawPacer(pacerX, pacerY, color, divide);
        }
        this.drawColumn(this.lastX, this.w, this.step, this.h, color);

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

    private drawPacer(x: number, y: number, color: string, divide: boolean) {
        
        this.ctx.fillStyle = this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.rad, -Math.PI / 2, Math.PI / 2, false);
        this.ctx.closePath();
        this.ctx.fill();

        if (divide) {
   
            this.ctx.fillStyle = '#eeeeee';
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.rad, this.M_PI_D_2, this.TWO_PI, false);
            this.ctx.closePath();
            this.ctx.fillStyle = '#eeeeee';
            this.ctx.fill();
            this.ctx.fillStyle = color;
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.rad, Math.PI / 2, 2*Math.PI /3, false);
            this.ctx.closePath();
            this.ctx.stroke();
            // this.drawColumn(this.lastX, this.w, this.step, this.h, color);
        }
    }

    setParams(allTime: number, timerStep: number) {
        this.init();
        this.step = ((this.canvas.width - this.borderWidth * 2) / allTime) * (timerStep / 1000);
        this.lastX = this.borderWidth;
        this.newX = this.borderWidth;
        this.isConfigured = true;
        this.rad = this.canvas.height / 2 - this.borderWidth; // середина минус границы

        console.log('step=' + this.step);
        console.log('width=' + this.canvas.width);
    }

    configured() {
        return this.isConfigured;
    }

    drawToEnd(color: string) {
        this.drawColumn(this.lastX - 1, this.w, this.canvas.width  - this.lastX-1, this.h, color);
    }

    dropConfigured() {
        this.lastX = this.borderWidth+10;
        this.newX = this.borderWidth+10;
        this.isConfigured = false;
    }

}