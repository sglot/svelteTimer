export class Circle {
    private radian: number;
    private radius: number;

    constructor(
        private ctx, 
        private width: number, 
        private height: number,
        private lineWidth: number
        ) {

    }

    recalcValues(counterTimer: number, timeValue: number) {
        this.radian = (counterTimer * (180 / timeValue) * (Math.PI * 2)) / 180;
        this.radius = Math.round(this.height / 2) - this.lineWidth - 0.5;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.lineWidth = this.lineWidth;

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
}