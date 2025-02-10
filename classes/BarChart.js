class BarChart {
    constructor(_data, _xValue, _yValue, _tickNum, _chartHeight, _barWidth, _margin, _axisThickness, _chartPosX, _chartPosY ,_orientation) {
        this.data = _data;
        this.xValue = _xValue;
        this.yValue = _yValue;
        this.tickNum = _tickNum;
        this.chartHeight = _chartHeight;
        this.barWidth = _barWidth;
        this.margin = _margin;
        this.axisThickness = _axisThickness;
        this.chartPosX = _chartPosX;
        this.chartPosY = _chartPosY;
        this.orientation = _orientation;

        // Scalers for the y axis
        this.maxValue = ceil(max(this.data.map(row => row[this.yValue])) / 10) * 10; // Round up to nearest 10

        // Calculate the gap dynamically based on the number of bars
        this.gap = this.barWidth * 0.5; // Gap is half the width of a bar (you can adjust this ratio)

        // Calculate the width of the chart dynamically
        this.chartWidth = (this.data.length * this.barWidth) + ((this.data.length - 1) * this.gap) + (this.margin * 2);

        this.scaler = this.chartHeight / this.maxValue;

            this.axisColour = "black";
            this.barColour = "black";
            this.axisTextColour = "black";
            this.axisTickTextColour = "black";
            this.axisTickColor = "black";
            this.chartTickLinesColor = "black";
    }

renderBars() {
    push();
    translate(this.chartPosX, this.chartPosY);

    push();
    

    if (this.yValue.length > 1) {
            scale(1, -1); // Invert the y axis
        
            translate(this.margin, 0);
            for (let i = 0; i < this.data.length; i++) {
                let jump = (this.barWidth + this.gap) * i;
                let bar2 = this.data[i][this.yValue[i+1]] * this.scaler;
                fill(this.barColour);
                noStroke();

                rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler);
                rect(bar2, 0, this.barWidth, this.data[i][this.yValue] * this.scaler);

            }//DO THIS TOMMOROW
        }
     else {
        if (this.orientation === 'vertical') {
            scale(1, -1); // Invert the y axis
    
            translate(this.margin, 0);
            for (let i = 0; i < this.data.length; i++) {
                let jump = (this.barWidth + this.gap) * i;
                fill(this.barColour);
                noStroke();
    
                rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0,0,5,5);
            }
        }
     else if (this.orientation === 'horizontal') {
            translate(0, -this.margin); // Move the chart up by the margin
            for (let i = 0; i < this.data.length; i++) {
                let jump = (this.barWidth + this.gap) * i;
                fill(this.barColour);
                noStroke();
                let barHeight = this.barWidth;
                let barWidth = this.data[i][this.yValue] * this.scaler;
                rect(0, -jump - this.margin , barWidth, barHeight, 0, 5, 0, 0);
            }
        }
    }
    pop();
    pop();
    }


    renderAxis() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();
        stroke(this.axisColour);
        strokeWeight(this.axisThickness);

        if (this.orientation === 'vertical') {
            line(0, 0, 0, -this.chartHeight);
            line(0, 0, this.chartWidth, 0);
        } else if (this.orientation === 'horizontal') {
            line(0, 0, 0, -this.chartWidth);
            line(0, 0, this.chartHeight, 0);
        }
        pop();
    }

    renderLabels() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let jump = (this.barWidth + this.gap) * i;

            // X-axis labels
            // fill(this.axisTextColour);
            // textAlign(LEFT, CENTER);
            // textSize(10);
            push();
            if (this.orientation === 'vertical') {
                translate(jump + (this.barWidth / 2), 10);
                fill(this.axisTextColour);
                textAlign(LEFT, CENTER);
                noStroke();

                textSize(10);
                rotate(45);
                text(this.data[i][this.xValue], 0, 0);
            } else if (this.orientation === 'horizontal') {
                let jump = (this.barWidth + this.gap) * i;
                translate(-this.margin -this.gap, -jump - this.margin -this.gap);
                fill(this.axisTextColour);
                textAlign(RIGHT, CENTER);
                noStroke();
                textSize(10);
                rotate(0);
                text(this.data[i][this.xValue], 0, 0);
            }
            pop();
        }
        pop();
        pop();
    }

    renderTicks() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis

        // Changing the look of the y axis.
        fill(this.axisTickTextColour);
        textAlign(RIGHT, CENTER);
        textSize(12); // Size of text on y axis

        if(this.orientation === 'vertical') {
            for (let i = 0; i <= this.maxValue; i += stepSize) {
                let yPos = -i * this.scaler;

                // If i is not 0 then draw the line
                if (i != 0) {
                    stroke(this.axisTickColor);
                    strokeWeight(1);
                    line(0, yPos, -10, yPos);
                }
    
                // Draw Y-axis numbers making sure they are all rounded to their nearest 10
                noStroke();
                text(i, -15, yPos); 
            }
        } else if(this.orientation === 'horizontal') {
            let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis
            for(let i = 0; i <= this.maxValue; i += stepSize) {
                let xPos = i * this.scaler;

                if (i != 0) {
                    stroke(this.axisTickColor);
                    strokeWeight(1);
                    line(xPos, 0, xPos, this.gap);
                }
    
                // Draw Y-axis numbers making sure they are all rounded to their nearest 10
                noStroke();
                text(i, xPos + this.gap, 15); 
            }
        }

        // Looking to display the numbers and the lines on the y axis.
        
        pop();
    }

    renderTickLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Number of divisions


        if(this.orientation === 'vertical') {
            for (let i = 0; i <= this.maxValue; i += stepSize) {
                let yPos = -i * this.scaler;
                // Draw grid lines

                // If i is not 0 then draw the line
                if (i != 0) {
                    stroke(this.chartTickLinesColor);
                    strokeWeight(1);
                    line(0, yPos, this.chartWidth, yPos);
                }
            }
        }else if(this.orientation === 'horizontal') {
            for (let i = 0; i <= this.maxValue; i += stepSize) {
                let xPos = i * this.scaler;

                if (i != 0) {
                    stroke(this.chartTickLinesColor);
                    strokeWeight(1);
                    line(xPos, 0, xPos, -this.chartWidth);
                }
            }
        }
        pop();
    }

    setColors() {
        if (this.orientation === 'vertical') {
            this.axisColour = color(120, 119, 119);
            this.barColour = color(0, 146, 153);
            this.axisTextColour = color(120, 119, 119);
            this.axisTickTextColour = color(120, 119, 119);
            this.axisTickColor = color(120, 119, 119);
            this.chartTickLinesColor = color(230, 224, 223);
        } else if (this.orientation === 'horizontal') {
            this.axisColour = color(0, 0, 0);
            this.barColour = color(0, 0, 255);
            this.axisTextColour = color(125,0,0);
            this.axisTickTextColour = color(255, 0, 0);
            this.axisTickColor = color(255, 0, 0);
            this.chartTickLinesColor = color(60, 125, 0);
        } else if (this.orientation === 'stacked') {
            this.axisColour = color(0, 0, 0);
            this.barColour = color(0, 0, 255);
            this.axisTextColour = color(125,0,0);
            this.axisTickTextColour = color(255, 0, 0);
            this.axisTickColor = color(255, 0, 0);
            this.chartTickLinesColor = color(60, 125, 0);
        }
    }
}


// renderEverything() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     noFill()

    //     let maxValue = ceil(max(this.data.map(row => row[this.yValue])) / 10) * 10; // Round up to nearest 10
    //     let stepSize = maxValue / this.numDivision; // Number of divisions
    
    //     stroke(this.axisColour);
    //     strokeWeight(this.axisThickness);
    //     line(0, 0, 0, -this.chartHeight); 
    //     line(0, 0, this.chartWidth, 0);   
    
    //     // Changing the look of the y axis.
    //     fill(this.axisTextColour);
    //     textAlign(RIGHT, CENTER);
    //     textSize(12); //Size of text on y axis

    //     // Looking to display the numbers and the lines on the y axis.
    //     for (let i = 0; i <= maxValue; i += stepSize) {
    //         let yPos = -(i * this.chartHeight / maxValue);
    //         // Draw grid lines

    //         // If i is not 0 then draw the line
    //         if (i != 0) {
    //             stroke(125);
    //             strokeWeight(1);
    //             line(0, yPos, this.chartWidth, yPos);
    //         }

    //         // Draw Y-axis numbers making sure they are all rounded to there nearest 10
    //         let roundedValue = round(i / 10) * 10;
    //         noStroke();
    //         text(roundedValue, -5, yPos); // -5 is the distance from the y axis
    //         //If the ammount of numbers is a lot decimal it will get rid of the decimal places by rounding up
    //     }
    
    //     push();
    //     translate(this.margin, 0);
    //     for (let i = 0; i < this.data.length; i++) {
    //         let jump = (this.barWidth + this.gap) * i;
    //         fill(this.barColour);
    //         noStroke();
    //         rect(jump, 0, this.barWidth, -this.data[i][this.yValue] * this.scaler);
    
    //         // X-axis labels
    //         fill(this.axisTextColour);
    //         textAlign(LEFT, CENTER);
    //         textSize(10);
    //         push();
    //         translate(jump + (this.barWidth / 2), 10);
    //         rotate(45);
    //         text(this.data[i][this.xValue], 0, 0);
    //         pop();
    //     }
    //     pop();
    //     pop();
// }
