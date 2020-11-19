export class Circle {
    private radian: number;
    private radius: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private config: circleConfig;

    constructor(
        private id: string, 
        private width: number, 
        private height: number,
        private lineWidth: number
        ) {

          this.canvas = document.getElementById(id) as HTMLCanvasElement;
          this.ctx = this.canvas.getContext('2d');

          this.canvas.width = width;
          this.canvas.height = height;
          this.canvas.style.left = 0 + "px";
    }

    recalcValues(counterTimer: number, timeValue: number) {
        this.radian = (counterTimer * (180 / timeValue) * (Math.PI * 2)) / 180;
        this.radius = Math.round(this.height / 2) - this.config.frontLineWidth - 0.5;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // this.drawLayer('rgba(250, 20, 50, 0.5)', this.config.bgLineWidth);
        this.drawLayer( this.config.frontColor, this.config.frontLineWidth);
    }

    private drawLayer(color: string, lineWidth: number) {
      this.ctx.beginPath();
      this.ctx.lineWidth = lineWidth;
      this.ctx.strokeStyle = color;

      this.ctx.arc(
        this.height / 2,
        this.height / 2,
        this.radius,
        -Math.PI / 2,
        this.radian - Math.PI / 2,
        false
      );

      this.ctx.stroke();
    }

    setConfig(config: circleConfig) {
      this.config = config;
    }
}