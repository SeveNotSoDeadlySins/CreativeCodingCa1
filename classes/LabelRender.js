class LabelRender extends Chart{
    constructor(chart) {
        super(chart);  // Pass the chart instance to the parent class (Chart)
        console.log("BarRender created with", chart);


        this.x = chart.chartPosX || 50;         // for example, the x-coordinate of the axis
        this.y = chart.chartPosY || 100;         // the y-coordinate
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
                this.renderVerticalLabel();
                break;
            // case 'stacked':
            //     this.renderStackedLabel();
            //     break;
            case 'cluster':
                this.drawRegionLabels();
                break;
            case 'fullGraph':
                this.drawRegionLabels();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
    renderVerticalLabel() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            push();
            let jump = (this.barWidth + this.gap) * i;
            translate(jump + (this.barWidth / 2), 10);
            fill(this.axisTextColour);
            textAlign(LEFT, CENTER);
            noStroke();

            textSize(10);
            rotate(45);

            text(this.data[i][this.xValue], 0, 0);
            pop();

        }

        pop();
        pop();
    }


    renderHorizontalLabel() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            push();

            let jump = (this.barWidth + this.gap) * i;
            translate(-this.margin -this.gap, -jump - this.margin -this.gap);
            fill(this.axisTextColour);
            textAlign(RIGHT, CENTER);
            noStroke();
            textSize(10);
            rotate(0);
            text(this.data[i][this.xValue], 0, -this.gap);
            
            pop();
        }

        pop();
        pop();
    }

    renderClusteredLabel() {
        push();
        translate(this.chartPosX, this.chartPosY);
        translate(this.margin, 0);
    
        for (let i = 0; i < this.data.length; i++) {
            push();
    
            // Calculate the starting position of the cluster starts at 0 to 11 (for male and female
            let clusterStart = i * ((this.barWidth * this.yValue.length) + this.gap);
            
            // Calculate the center of the cluster for label positioning
            let clusterMid = clusterStart + (this.barWidth * this.yValue.length) / 2;
    
            // Translate to the correct X and Y positions
            translate(clusterMid, 15);
            
            fill(this.axisTextColour);
            textAlign(LEFT, CENTER); // Centering the text
            noStroke();
            textSize(10);
            
            rotate(45); // Rotate the text for better readability
    
            // Render the label
            text(this.data[i][this.xValue], 0, 0);
    
            pop();
        }
    
        pop();
    }

    drawRegionLabels(regionLabels) {
        // regionLabels is an array of objects like:
        // { text: "Northern Africa (48.9%)", x: 200, y: 420, angle: 45 }
        for (let lbl of regionLabels) {
          push();
          translate(lbl.x, lbl.y);
          rotate(radians(lbl.angle));  // or rotate(-radians(45)) if you want the other direction
          textAlign(CENTER, TOP);
          textSize(12);
          fill(0);
          // Make sure lbl.text is a string, not an object
          text(lbl.text, 0, 0);
          pop();
        }
      }
      
}