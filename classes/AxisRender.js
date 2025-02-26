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
            // case 'stacked':
            //     this.stackedRenderAxis();
            //     break;
            case 'cluster':
                this.renderClustedAxis();
                break;
            case 'fullGraph':
                this.graph100axis();
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

    renderStackedAxis() {
        let maxVal = this.chart.MaxValue; // the maximum region total
        let tickSpacing = this.chart.chartHeight / numTicks;
        
        push();
        stroke(0);
        for (let i = 0; i <= numTicks; i++) {
          let yPos = this.chart.chartPosY + this.chart.chartHeight - i * tickSpacing;
          line(this.chart.chartPosX - 5, yPos, this.chart.chartPosX, yPos);
          
          // Compute tick value: For a stacked chart, tick value = (maxVal/numTicks)*i.
          let tickVal = (maxVal / numTicks) * i;
          // Format as needed (or convert to percentage, etc.)
          textAlign(RIGHT, CENTER);
          textSize(12);
          fill(0);
          text(thistickVal.toFixed(0), this.chart.chartPosX - 10, yPos);
        }
        pop();
      }
      


    graph100axis() { //100% graph
        push();
        stroke(0);
        strokeWeight(1);
        // Draw Y-axis
        line(this.x, this.y, this.x, this.y + this.chartHeight);
        // Draw X-axis (at the bottom)
        line(this.x, this.y + this.chartHeight, this.x + this.chartWidth, this.y + this.chartHeight);
        pop();
    }
    
}