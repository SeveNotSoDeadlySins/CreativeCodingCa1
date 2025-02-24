class TickRender extends Chart {
    constructor(chart) {
        super(chart); // Call the BaseRender constructor
        console.log("TickRender created with", chart);
    }

    renderTick() {
        const isChecked = document.getElementById("toggleOrientation").checked;
        
        if (isChecked) {
            this.renderHorizontalTick(); // Force horizontal ticks if checkbox is checked
            console.log("Rendering horizontal ticks thanks to checkbox");
            return;
        }

        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalTick();
                break;
            case 'stacked':
                this.renderStackedTick();
                break;
            case 'cluster':
                this.renderClusteredTick();
                break;
            case 'fullGraph':
                this.renderFullGraphTick();
                break;
            case 'line':
                this.renderLineChart();
                break;
                
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }    
    }

    renderVerticalTick() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis

        fill(this.axisTickTextColour);
        textAlign(RIGHT, CENTER);
        textSize(12); // Size of text on y axis

        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let yPos = -i * this.scaler;

            stroke(this.axisTickColor);
            strokeWeight(1);
            line(0, yPos, -10, yPos);

            // Draw Y-axis numbers making sure they are all rounded to their nearest 50
            noStroke();
            text(i, -15, yPos);
        }
        pop();

        console.log("Rendering vertical ticks");
    }

    renderHorizontalTick() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50;

        fill(this.axisTickTextColour);
        textAlign(CENTER, TOP);
        textSize(12);

        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let xPos = i * this.scaler;

            if (i !== 0) {
                stroke(this.axisTickColor);
                strokeWeight(1);
                line(xPos, 0, xPos, this.gap);
            }

            // Draw Y-axis numbers making sure they are all rounded to their nearest 50
            noStroke();
            text(i, xPos + this.gap, 15);
        }
        pop();

        console.log("Rendering horizontal ticks");
    }

    renderClusteredTick() {
        push();
        translate(this.chartPosX, this.chartPosY); // Move to the chart position
        noFill();
    
        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis
    
        fill(this.axisTickTextColour);
        textAlign(RIGHT, CENTER);
        textSize(12); // Size of text on y axis
    
        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let yPos = -i * this.scaler; // Position on the y-axis, scaled correctly
    
            // Draw the tick mark
            stroke(this.axisTickColor);
            strokeWeight(1);
            line(0, yPos, -10, yPos); // Tick line pointing left from the axis
    
            // Draw the Y-axis label
            noStroke();
            text(i, -15, yPos); // Label to the left of the tick
        }
    
        pop();
        console.log("Rendering clustered Y-axis with ticks and labels");
    }
    

    renderStackedTick() {
        console.log("Rendering stacked ticks...");
        // Add custom tick rendering logic for stacked orientation if needed
        this.renderVerticalTick(); // Fallback to vertical ticks if appropriate
    }

    renderFullGraphTick() {
        console.log("Rendering full graph ticks...");
        // Custom logic for full graph ticks
        this.renderVerticalTick(); // Fallback to vertical ticks if appropriate
    }

    renderLineChart() {
        console.log("Rendering line chart ticks...");
        // Implement specific tick rendering for line charts
    }
}
