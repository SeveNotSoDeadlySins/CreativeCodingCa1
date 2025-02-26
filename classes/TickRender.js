class TickRender extends Chart {
    /**
     * Constructor for the TickRender class.
     * @param {object} chart - The main Chart instance that contains shared properties (like chartPosX, chartPosY, etc.).
     */
    constructor(chart) {
        super(chart); // Call the parent class (Chart) constructor, passing the chart object
        console.log("TickRender created with", chart);

        // TickRender-specific properties, with defaults if not provided:
        this.tickLabels = chart.tickLabels || [0, 25, 50, 75, 100]; // Default tick labels
        this.textSize = chart.textSize || 12;                       // Font size for tick labels
        this.tickLength = chart.tickLength || 5;                    // Length of each tick mark
        this.x = chart.chartPosX || 50;                             // X position of the axis
        this.y = chart.chartPosY || 100;                            // Y position of the axis
        this.chartHeight = chart.chartHeight || 400;                // Height of the chart area
    }

    /**
     * Main method to render tick marks.
     * Decides which tick rendering function to call based on orientation or user settings.
     */
    renderTick() {
        // Check if the toggleOrientation checkbox is checked in the DOM
        const isChecked = document.getElementById("toggleOrientation").checked;
        
        // If toggled, force horizontal ticks
        if (isChecked) {
            this.renderHorizontalTick();
            console.log("Rendering horizontal ticks thanks to checkbox");
            return;
        }

        // Otherwise, switch based on the chart orientation
        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalTick();
                break;
            // case 'stacked':
            //     this.renderStackedTick();
            //     break;

            case 'cluster':
                this.renderClusteredTick();
                break;
            case 'fullGraph':
                // For a 'fullGraph' orientation, we call drawTicks (example usage).
                this.drawTicks();
                break;    
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }    
    }

    /**
     * Renders vertical tick marks along the Y-axis for a vertical chart.
     * Typically used when the chart is oriented upright (bars go up).
     */
    renderVerticalTick() {
        push();
        // Move to the chart's position
        translate(this.chartPosX, this.chartPosY);
        noFill();

        // Calculate a step size so that ticks are always in increments of 50
        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50;

        fill(this.axisTickTextColour);
        textAlign(RIGHT, CENTER);
        textSize(12); // Font size for the tick labels on the Y-axis
        textFont(customFont);

        // Loop from 0 up to maxValue in increments of stepSize
        for (let i = 0; i <= this.maxValue; i += stepSize) {
            // y-position for the tick (negative since the chart might be flipped)
            let yPos = -i * this.scaler;

            // Draw a small line to mark the tick on the axis
            stroke(this.axisTickColor);
            strokeWeight(1);
            line(0, yPos, -10, yPos);

            // Draw the label (e.g. population or numeric value) to the left of the tick
            noStroke();
            text(formatPopulation(i), -15, yPos);
        }
        pop();

        console.log("Rendering vertical ticks");
    }

    /**
     * Renders horizontal tick marks along the X-axis for a horizontally oriented chart.
     * Typically used when bars go left-to-right.
     */
    renderHorizontalTick() {
        push();
        // Move to the chart's position
        translate(this.chartPosX, this.chartPosY);
        noFill();
      
        // Step size in increments of 50
        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50;
      
        fill(this.axisTickTextColour);
        textSize(12);
        textAlign(LEFT, CENTER);
        textFont(customFont);
      
        // Loop through the range in increments of stepSize
        for (let i = 0; i <= this.maxValue; i += stepSize) {
          let xPos = i * this.scaler;
      
          // Draw a small vertical line (tick mark) above the axis
          if (i !== 0) {
            stroke(this.axisTickColor);
            strokeWeight(1);
            line(xPos, 0, xPos, this.gap);
          }
      
          // Now draw the label, rotated 90 degrees
          noStroke();
          push();
            // Move to where the text should be placed
            translate(xPos + this.gap, 15);
            // Rotate 90° clockwise
            rotate(90);
            // Draw the label at the new origin
            text(formatPopulation(i), 0, 0);
          pop(); 
        }
      
        pop();
        console.log("Rendering horizontal ticks");
    }
      
    /**
     * Renders clustered tick marks for a "cluster" orientation.
     * Similar to vertical, but may differ in exact usage.
     */
    renderClusteredTick() {
        push();
        // Position at the chart origin
        translate(this.chartPosX, this.chartPosY);
        noFill();
    
        // Step size in increments of 50
        const stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50;
    
        fill(this.axisTickTextColour);
        textAlign(RIGHT, CENTER);
        textSize(12); // Size of text on y axis
        textFont(customFont);

        // Loop and draw ticks
        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let yPos = -i * this.scaler; // scaled position on the Y-axis
    
            // Draw a small line to mark the tick
            stroke(this.axisTickColor);
            strokeWeight(1);
            line(0, yPos, -10, yPos); 
    
            // Label for the tick (numeric value)
            noStroke();
            text(i, -15, yPos);
        }
    
        pop();
        console.log("Rendering clustered Y-axis with ticks and labels");
    }
    
    /**
     * Renders ticks for a "stacked" orientation if needed.
     * Currently calls renderVerticalTick() as a fallback.
     */
    renderStackedTick() {
        console.log("Rendering stacked ticks...");
        // If you have special logic for stacked, place it here.
        // For now, fallback to vertical.
        this.renderVerticalTick();
    }

    /**
     * Renders ticks for a line chart orientation if needed.
     * Currently just logs a message. Add line chart tick logic here if desired.
     */
    renderLineChart() {
        console.log("Rendering line chart ticks...");
        // Implement specific tick rendering for line charts if needed.
    }

    /**
     * drawTicks() is an example function that draws a simple set of ticks
     * using the tickLabels array. Possibly used in 'fullGraph' orientation.
     */
    drawTicks() { //100% chart
        push();
        textAlign(RIGHT, CENTER);
        textSize(this.textSize);
        textFont("sans-serif");
        fill(0);
        textFont(customFont);

        // Loop through the tickLabels array
        for (let t of this.tickLabels) {
          // We assume 0% is at the bottom and 100% at the top
          let tickY = this.y + this.chartHeight - (t / 100) * this.chartHeight;
          
          // Draw a small line (tick mark) on the left
          stroke(0);
          line(this.x - this.tickLength, tickY, this.x, tickY);
          noStroke();
          
          // Draw the tick label, 10px to the left of the tick mark
          text(t + "%", this.x - this.tickLength - 5, tickY);
        }
        pop();
    }
}
