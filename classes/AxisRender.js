class AxisRender extends Chart{
    constructor(chart) {
        super(chart);  // Pass the chart instance to the parent class (Chart)
        console.log("BarRender created with", chart);

    }

    renderAxis() {
        const isChecked = document.getElementById("toggleOrientation").checked;
    
        // Force the chart to render as horizontal if the checkbox is checked
        console.log(`isChecked: ${isChecked}`);
        if (isChecked === true) {
            this.renderHorizontalAxis();
            console.log("Rendering horizontal axis");
            return;
        }
    
        // Otherwise, use the default orientation logic
        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalAxis();
                break;
            case 'stacked':
                this.renderStackedAxis();
                break;
            case 'cluster':
                this.renderClustedAxis();
                break;
            case 'fullGraph':
                this.renderFullGraphAxis();
                break;
            case 'line':
                this.renderLineChart();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
    renderVerticalAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColour);
        strokeWeight(this.axisThickness);
        line(0, 0, 0, -this.chartHeight);
        line(0, 0, this.chartWidth, 0);
        pop();
        console.log("Rendering vertical axis");
    }


    renderHorizontalAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColour);
        strokeWeight(this.axisThickness);
        line(0, 0, this.chartHeight ,0 );
        line(0, 0, 0, -this.chartWidth);
        pop();
        console.log("Rendering Horizontral axis");

    }

    renderClustedAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColour);
        strokeWeight(this.axisThickness);
    
        // Calculate the dynamic chart width
        let clusterWidth = (this.barWidth * this.yValue.length) + this.gap; // Width of each cluster
        this.chartWidth = (clusterWidth * this.data.length) - this.gap + (2 * this.margin); 
        // Subtract the extra gap, add margin for padding on both sides
    
        // Draw Y-axis (left side)
        line(0, 0, 0, -this.chartHeight);
    
        // Draw X-axis (dynamic width based on clustered bars)
        line(0, 0, this.chartWidth, 0);
    
        pop();
        console.log("Rendering renderClustedAxis axis with dynamic chart width:", this.chartWidth);
    }
    
}