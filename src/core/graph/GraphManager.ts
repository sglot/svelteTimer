import type { GraphInterface } from "./GraphInterface";
import { GraphSeparated } from "./GraphSeparated"
import { GraphTiny } from "./GraphTiny";

export class GraphManager implements GraphInterface {
    private graph: GraphTiny | GraphSeparated;

    setGraph(variant: string) {
        if (variant === "separated") {
            this.graph = new GraphSeparated('graph-separated');
            return;
        }

        if (variant === "tiny") {
            this.graph = new GraphTiny('graph-tiny');
            return;
        }
    }

    drawStep(color: string, divide: boolean) {
        if (this.graph instanceof GraphSeparated) {
            this.graph.drawStep(color, divide);
            return;
        }

        if (this.graph instanceof GraphTiny) {
            this.graph.progressInc();
            this.graph.drawStep(200);
            return;
        }

    }

    setParams(allTime: number, timerStep: number, time, shape): void {
        this.graph.setParams(allTime, timerStep, time, shape);
    }

    configured(): boolean {
        return this.graph.configured();
    }

    getWidth(): number {
        return this.graph instanceof GraphTiny
            ? this.graph.getWidth()
            : 0;
    }

    getHeight(): number {
        return this.graph instanceof GraphTiny
            ? this.graph.getHeight()
            : 0;
    }

    getCursorRadius(): number {
        return this.graph instanceof GraphTiny
            ? this.graph.getCursorRadius()
            : 0;
    }

    dropConfigured(): void {
        this.graph.dropConfigured();
    }

    drawToEnd(color: string) {
        this.graph.drawToEnd(color);
    }
}