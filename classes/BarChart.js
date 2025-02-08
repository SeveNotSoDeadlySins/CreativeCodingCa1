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

        this.axisColour = color(0, 0, 0);
        this.barColour = color(0, 0, 255);
        this.axisTextColour = color(125);
        this.axisTickTextColour = color(255, 0, 0);
        this.axisTickColor = color(0, 255, 0);
        this.chartTickLinesColor = color(60, 125, 0);
    }

    renderBars() {
        push();
        translate(this.chartPosX, this.chartPosY);
        push();
        translate(this.margin, 0);
        for (let i = 0; i < this.data.length; i++) {
            let jump = (this.barWidth + this.gap) * i;
            fill(this.barColour);
            noStroke();


            if(this.orientation === 'vertical') {
                rect(jump, 0, this.barWidth, -this.data[i][this.yValue] * this.scaler);
            } else if(this.orientation === 'horizontal') {
                // Hotizontal bars
                let barHeight = this.barWidth;
                let barWidth = this.data[i][this.yValue] * this.scaler;

                rect(0, jump, barWidth, barHeight);
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
            line(0, 0, this.chartWidth, 0);
            line(0, 0, 0, -this.chartHeight);
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
            fill(this.axisTextColour);
            textAlign(LEFT, CENTER);
            textSize(10);
            push();

            if (this.orientation === 'vertical') {
                translate(jump + (this.barWidth / 2), 10);
                rotate(45);
                text(this.data[i][this.xValue], 0, 0);
            } else if (this.orientation === 'horizontal') {
                translate(0, jump + (this.barWidth / 2));
                rotate(0);
                text(this.data[i][this.xValue], 0, 0);
            }
            pop();
        }
        pop();
        pop();
    }

    renderYaxisTicks() {
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
                    line(xPos, 0, xPos, -10);
                }
    
                // Draw Y-axis numbers making sure they are all rounded to their nearest 10
                noStroke();
                text(i, xPos, 15); 
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

        for (let i = 0; i <= this.maxValue; i += stepSize) {
            let yPos = -(i * this.chartHeight / this.maxValue);
            // Draw grid lines

            // If i is not 0 then draw the line
            if (i != 0) {
                stroke(this.chartTickLinesColor);
                strokeWeight(1);
                line(0, yPos, this.chartWidth, yPos);
            }
        }
        pop();
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
