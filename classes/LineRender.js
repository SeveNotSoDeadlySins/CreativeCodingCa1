class LineRender extends Chart{
    constructor(chart) {
        super(chart);  // Pass the chart instance to the parent class (Chart)
        console.log("BarRender created with", chart);

    }

    renderLabels() {
        const isChecked = document.getElementById("toggleOrientation").checked;
    
        // Force the chart to render as horizontal if the checkbox is checked
        console.log(`isChecked: ${isChecked}`);
        if (isChecked === true) {
            this.renderHorizontalLabel();
            console.log("Rendering horizontal axis");
            return;
        }
    
        // Otherwise, use the default orientation logic
        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalLines();
                break;
            case 'stacked':
                this.renderHorizontalLines();
                break;
            case 'cluster':
                this.renderClusteredLines();
                break;
            case 'fullGraph':
                this.renderFullGraphLabel();
                break;
            case 'line':
                this.renderLineChart();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
    renderVerticalLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Goes to the nearest 50.

        for (let i = 0; i <= this.maxValue; i += stepSize) {
            for (let i = 0; i <= this.maxValue; i += stepSize) {
                let yPos = -i * this.scaler;

                // If i is not 0 then draw the line
                if (i != 0) {
                    stroke(this.chartTickLinesColor);
                    strokeWeight(1);
                    line(0, yPos, this.chartWidth, yPos);
                    console.log("Rendering vertical tick lines!!!!");
                }
            }
        }
    }

    renderHorizontalLines() {
        push();
        translate(this.chartPosX, this.chartPosY); // Position the labels relative to the chart
        noFill();

        let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Goes to the nearest 50.

        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let xPos = i * this.scaler;

            if (i != 0) {
                stroke(this.chartTickLinesColor);
                strokeWeight(1);
                line(xPos, 0, xPos, -this.chartWidth);
            }
        }
        pop();
    }
    
    renderClusteredLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
    
        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Round to nearest 50
    
        let clusterWidth = (this.barWidth * this.yValue.length) + this.gap; // Width of each cluster
        this.chartWidth = (clusterWidth * this.data.length) - this.gap + (2 * this.margin); //Changing this.chartWidth to the dynamic width


        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let yPos = -i * this.scaler; // Calculate the Y position using the scaler
    
            if (i !== 0) {
                stroke(this.chartTickLinesColor);
                strokeWeight(1);
                line(0, yPos, this.chartWidth, yPos); // Extend line to full chart width
                console.log(`Rendering horizontal grid line at yPos: ${yPos}`);
            }
        }
    
        pop();
    }
    
}