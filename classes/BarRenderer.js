class BarRenderer {
    constructor(chart) {
        // `chart` is the instance of the `Chart` class passed in.
        this.chart = chart; 
        console.log("BarRenderer created with chart:");
    }

    renderBars() {
        const isChecked = document.getElementById("toggleOrientation").checked;
    
        // Force the chart to render as horizontal if the checkbox is checked
        console.log(`isChecked: ${isChecked}`);
        if (isChecked === true) {
            this.renderHorizontalBars();
            console.log("Rendering horizontal bars");
            return;
        }
    
        // Otherwise, use the default orientation logic
        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalGraph();
                break;
            case 'horizontal':
                this.renderHorizontalBars();
                break;
            case 'stacked':
                this.renderStackedBars();
                break;
            case 'fullGraph':
                this.renderFullGraphBars();
                break;
            case 'line':
                this.renderLineChart();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
    renderVerticalBars() {
        push();
        translate(this.chartPosX, this.chartPosY);
        scale(1, -1);
        translate(this.margin, 0);
        console.log("Rendering vertical bars");
        for (let i = 0; i < this.data.length; i++) {
            let jump = (this.barWidth + this.gap) * i;
            console.log(`Rendering bar at index ${i} with height: ${this.data[i][this.yValue] * this.scaler}`);
            fill(this.barColour);
            noStroke();
            rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0, 0, 5, 5);
        }
        pop();
    }


    renderHorizontalBars() {
        push();
        translate(this.chartPosX, this.chartPosY);
        translate(0, -this.margin);
        for (let i = 0; i < this.data.length; i++) {
            let jump = (this.barWidth + this.gap) * i;
            fill(this.barColour);
            noStroke();
            let barHeight = this.barWidth;
            let barWidth = this.data[i][this.yValue] * this.scaler;
            rect(0, -jump - this.margin, barWidth, barHeight, 0, 5, 0, 0);
        }
        pop();
    }
}