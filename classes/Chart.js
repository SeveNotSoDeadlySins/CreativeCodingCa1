class Chart {
    constructor(obj) {
        this.data = obj.data; //All of the data that is taken from the CSV file
        this.xValue = obj.xValue || "Country";
        this.yValue = obj.yValue || "Female"; // What rows that selected for the Yaxis i.e Male, Female for the sample data
        this.tickNum = obj.tickNum || 8;
        this.chartHeight = obj.chartHeight || 200;
        this.barWidth = obj.barWidth || 15;
        this.margin = obj.margin || 15;
        this.axisThickness = obj.axisThickness || 1;
        this.chartPosX = obj.chartPosX || 200;
        this.chartPosY = obj.chartPosY || 350;
        this.orientation = obj.orientation || "vertical";
        this.isChecked = obj.isChecked || false;


        console.log("Constructor set orientation to:", this.orientation);

        // Get the maximum raw value
        let rawMaxValue = max(this.data.map(row => row[this.yValue] || 0));
        if (rawMaxValue < 1) rawMaxValue = 1;

        // Calculate the maximum value on a log scale (base 10)
        this.logMaxValue = ceil(Math.log10(rawMaxValue));  // Use Math.log10 here

        // Calculate the scaler using the chart height divided by the logMaxValue
        this.scaler = this.chartHeight / this.logMaxValue;


        // Scalers for the y axis
        this.maxValue = ceil(max(this.data.map(row => row[this.yValue])) / 10) * 10; // Round up to nearest 10

        // Calculate the gap dynamically based on the number of bars
        this.gap = this.barWidth * 0.5; // Gap is half the width of a bar (you can adjust this ratio)

        // Calculate the width of the chart dynamically
        this.chartWidth = (this.data.length * this.barWidth) + ((this.data.length - 1) * this.gap) + (this.margin * 2);


       
          

        // Calculate the max value considering all selected datasets
        // if (this.orientation === "stacked" || this.orientation === "fullGraph") {
        //     // For stacked or cluster, add up the values from all selected datasets
        //     this.maxValue = ceil(
        //         max(this.data.map(row => {
        //             // Sum values from all datasets in this row (considering `this.yValue` as the array of selected datasets)
        //             let sum = 0;
        //             this.yValue.forEach(dataset => {
        //                 sum += row[dataset] || 0; // Add value for each selected dataset (use 0 if not present)
        //             });
        //             return sum;
        //         })) / 10
        //     ) * 10; // Round up to the nearest multiple of 10
        // } else if (this.orientation === "cluster") {
        //     // Find the max value from all selected datasets
        //     const maxValues = this.yValue.map(yValue => {
        //         return max(this.data.map(row => row[yValue] || 0));
        //     });

        //     this.maxValue = ceil(max(maxValues) / 10) * 10;
        // } else {
        //     // For other chart types (e.g., vertical, line), take the max of the selected Y-value column
        //     this.maxValue = ceil(
        //         max(this.data.map(row => row[this.yValue] || 0)) / 10
        //     ) * 10; // Round up to the nearest multiple of 10
        // }

        // Calculate the scaler to fit the chart height
        this.scaler = this.chartHeight / this.maxValue;



        // const toggleButton = document.getElementById("toggleOrientation");
        // toggleButton.addEventListener("click", this.toggleOrientation.bind(this));

        this.axisColour = "black";
        this.barColour = "black";
        this.axisTextColour = "black";
        this.axisTickTextColour = "black";
        this.axisTickColor = "black";
        this.chartTickLinesColor = "black";
        this.barColours = ["#FF5733", "#33FF57", "#3357FF", "#F0E68C"]; // Example color set
    }

    render() {
        const barRender = new BarRender(this);  // Pass the current chart instance to BarRender
        barRender.renderBars();  // Call renderBars on the instance

        console.log("Rendering Bars");

        const axisRender = new AxisRender(this);
        axisRender.renderAxis();

        console.log("Rendering Axis");

        const tickRender = new TickRender(this);
        tickRender.renderTick();

        console.log("Rendering Tick");

        const labelRender = new LabelRender(this);
        labelRender.renderLabels();

        console.log("Rendering Labels");


        const lineRender = new LineRender(this);
        lineRender.renderLabels();

        console.log("Rendering Labels");


        const legendRender = new LegendRender(this);
        legendRender.renderLegends();

        console.log("Rendering Legends");


        // this.axisRenderer.renderAxes();
        // this.labelRenderer.renderLabels();
    }





    // toggleOrientation() {
    //     // Switch the orientation
    //     this.orientation = this.orientation === "vertical" ? "horizontal" : "vertical";
    //     this.renderBars();  // Re-render after toggling orientation
    // }


    // renderBars() {
    //     const isChecked = document.getElementById("toggleOrientation").checked;
    
    //     // Force the chart to render as horizontal if the checkbox is checked
    //     console.log(`isChecked: ${isChecked}`);
    //     if (isChecked === true) {
    //         this.renderHorizontalBars();
    //         console.log("Rendering horizontal bars");
    //         return;
    //     }
    
    //     // Otherwise, use the default orientation logic
    //     switch (this.orientation) {
    //         case 'vertical':
    //             this.renderVerticalGraph();
    //             break;
    //         case 'horizontal':
    //             this.renderHorizontalBars();
    //             break;
    //         case 'stacked':
    //             this.renderStackedBars();
    //             break;
    //         case 'fullGraph':
    //             this.renderFullGraphBars();
    //             break;
    //         case 'line':
    //             this.renderLineChart();
    //             break;
    //         default:
    //             console.error(`Unknown chart type: ${this.orientation}`);
    //             break;
    //     }
    // }
    
    // renderVerticalBars() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     scale(1, -1);
    //     translate(this.margin, 0);
    //     console.log("Rendering vertical bars");
    //     for (let i = 0; i < this.data.length; i++) {
    //         let jump = (this.barWidth + this.gap) * i;
    //         console.log(`Rendering bar at index ${i} with height: ${this.data[i][this.yValue] * this.scaler}`);
    //         fill(this.barColour);
    //         noStroke();
    //         rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0, 0, 5, 5);
    //     }
    //     pop();
    // }


    // renderHorizontalBars() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     translate(0, -this.margin);
    //     for (let i = 0; i < this.data.length; i++) {
    //         let jump = (this.barWidth + this.gap) * i;
    //         fill(this.barColour);
    //         noStroke();
    //         let barHeight = this.barWidth;
    //         let barWidth = this.data[i][this.yValue] * this.scaler;
    //         rect(0, -jump - this.margin, barWidth, barHeight, 0, 5, 0, 0);
    //     }
    //     pop();
    // }

    // renderBars() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);

    //     push();
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         ///////////////////////////Vertical Bar Chart//////////////////////////////////////////////////////////
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         if (this.orientation === 'vertical') {
    //             scale(1, -1); // Invert the y axis
        
    //             translate(this.margin, 0);
    //             for (let i = 0; i < this.data.length; i++) {
    //                 let jump = (this.barWidth + this.gap) * i;
    //                 fill(this.barColour);
    //                 noStroke();
    //                 // console.log(`Index: ${i}, Female Value: ${this.barWidth}, Scaled Height: ${this.scaler} ${this.maxValue}`);  // Debugging

    //                 rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0,0,5,5);
    //             }
    //         }

    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         ///////////////////////////Horizontal Bar Chart//////////////////////////////////////////////////////////
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         else if (this.orientation === 'horizontal') {
    //             translate(0, -this.margin); // Move the chart up by the margin
    //             for (let i = 0; i < this.data.length; i++) {
    //                 let jump = (this.barWidth + this.gap) * i;
    //                 fill(this.barColour);
    //                 noStroke();
    //                 let barHeight = this.barWidth;
    //                 let barWidth = this.data[i][this.yValue] * this.scaler;
    //                 rect(0, -jump - this.margin , barWidth, barHeight, 0, 5, 0, 0);
    //             }
    //         }

    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         ///////////////////////////Stacked Bar Chart //////////////////////////////////////////////////////////
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         else if (this.orientation === 'stacked') {
    //             push();
    //             noFill();
    //             stroke(this.axisColour);
    //             strokeWeight(this.axisThickness);
    //             line(0, 0, 0, this.chartHeight);  // Y-axis
    //             line(0, 0, this.chartWidth, 0);   // X-axis

    //             translate(this.margin, 0); // Apply margin for bars

    //             for (let i = 0; i < this.data.length; i++) {
    //                 let xPos = (this.barWidth + this.gap) * i;
    //                 let stackedHeight = 0; // Track the cumulative height for stacking
                    
    //                 for (let j = 0; j < this.yValue.length; j++) {
    //                     fill(this.barColour); 
    //                     noStroke();
    //                     push();
    //                     let barHeight = this.data[i][this.yValue[j]] * this.scaler;
                        
    //                     push();
    //                     rect(xPos, stackedHeight, this.barWidth, barHeight, 0, 0, 5, 5);
    //                     stackedHeight += barHeight; // Move up for the next segment
    //                 }
    //                 push();

    //                 pop();
    //             }

    //             pop();

    //         }

    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         ///////////////////////////100% Chart //////////////////////////////////////////////////////////
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         else if (this.orientation === 'fullGraph') {
    //             scale(1, -1);
    //             translate(this.margin, 0);

    //             let itemPercentage = 0;

    //             for (let i = 0; i < this.data.length; i++) {
    //                 let jump = (this.barWidth + this.gap) * i;
    //                 let firstValue = this.data[i]["Female"];
    //                 let secondValue = this.data[i]["Male"];

    //                 let total = firstValue + secondValue;


    //                 let newScaler = this.scaler/100;
                    
    //                 let malepercent = (secondValue / total) * 100;
    //                 let femalepercent = (firstValue / total) * 100;


    //                 let femaleHeight = femalepercent * this.scaler;
    //                 let maleHeight = malepercent * this.scaler;

    //                 let test = total * this.scaler;


    //                 rect(jump , femaleHeight, this.barWidth, test);


    //                 translate(jump, 0 )

    //                 rect(0 , maleHeight, this.barWidth, test);



    //                 console.log(`Index: , Female Value: ${this.scaler}, newValue:  ${this.maxValue} test ${this.scaler}`);
    //                 console.log(malepercent)  // Debugging
    //                 console.log(maleHeight)  // Debugging
    //                 console.log(femalepercent)  // Debugging
    //                 console.log(femaleHeight)  // Debugging


    //             }
    //         }



    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         /////////////////////////// Line Chart ////////////////////////////////////////////////////////////////
    //         ///////////////////////////////////////////////////////////////////////////////////////////////////////
    //         else if (this.orientation === 'line') {
    //             scale(1, -1);
    //             translate(this.margin,0)

    //             for(let i =0; i < this.data.length; i++) {
    //                 let jump = (this.barWidth + this.gap) * i;
    //                 let jump2 = (this.barWidth + this.gap)*(i+1);

    //                 let firstPoint = this.data[i][this.yValue] * this.scaler;
    //                 let secondPoint = this.data[i+1][this.yValue] * this.scaler;
    //                 stroke(this.barColour);
    //                 line(jump, firstPoint, jump2, secondPoint);
    //                 // console.log(`Index: ${i}, Female Value: ${this.data[i][this.yValue]}, Scaled Height: ${this.scaler} ${this.maxValue}`);  // Debugging

    //             }

    //         }
            

    //         // else if (this.orientation === 'grouped') {
    //         //     scale(1, -1);
    //         //     translate(this.margin, 0);

    //         //     let numCategories = this.yValue.length; // Number of groups (e.g., Male, Female)
    //         //     let totalGroupWidth = this.barWidth * numCategories + (this.gap * (numCategories - 1)); // Total width of one group
    //         //     let colors = ["pink", "blue", "green", "orange"]; 

    //         //     for (let i = 0; i < this.data.length; i++) {
    //         //         let baseX = (totalGroupWidth + this.gap) * i; // Position for each group

    //         //         for (let j = 0; j < numCategories; j++) {
    //         //             let category = this.yValue[j];
    //         //             let value = this.data[i][category] * this.scaler;

    //         //             let barX = baseX + (this.barWidth + this.gap) * j; // Offset bars in a group

    //         //             fill(colors[j % colors.length]); // Cycle through colors
    //         //             noStroke();
    //         //             rect(barX, 0, this.barWidth, value, 5, 5, 0, 0);
    //         //         }
    //         //     }
    //         // } //For class tommorow
    //     pop();
    //     pop();
    //     }


    // renderVerticalAxis() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     noFill();
    //     stroke(this.axisColour);
    //     strokeWeight(this.axisThickness);
    //     line(0, 0, 0, -this.chartHeight);
    //     line(0, 0, this.chartWidth, 0);
    //     pop();
    //     console.log("Rendering vertical axis");
    // }

    // renderAxis() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     noFill();
    //     stroke(this.axisColour);
    //     strokeWeight(this.axisThickness);

    //     if (this.orientation === 'vertical' || this.orientation === 'stacked' || this.orientation === 'line') {
    //         line(0, 0, 0, -this.chartHeight);
    //         line(0, 0, this.chartWidth, 0);
    //     } else if (this.orientation === 'horizontal') {
    //         line(0, 0, 0, -this.chartWidth);
    //         line(0, 0, this.chartHeight, 0);
    //     }
    //     pop();
    // }

    // renderLabels() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     push();
    //     translate(this.margin, 0);
    //     for (let i = 0; i < this.data.length; i++) {
    //         let jump = (this.barWidth + this.gap) * i;

    //         // X-axis labels
    //         // fill(this.axisTextColour);
    //         // textAlign(LEFT, CENTER);
    //         // textSize(10);
    //         push();
    //         if (this.orientation === 'vertical' || this.orientation === 'stacked'|| this.orientation === 'line') {
    //             translate(jump + (this.barWidth / 2), 10);
    //             fill(this.axisTextColour);
    //             textAlign(LEFT, CENTER);
    //             noStroke();

    //             textSize(10);
    //             rotate(45);
    //             text(this.data[i][this.xValue], 0, 0);
    //         } else if (this.orientation === 'horizontal') {
    //             let jump = (this.barWidth + this.gap) * i;
    //             translate(-this.margin -this.gap, -jump - this.margin -this.gap);
    //             fill(this.axisTextColour);
    //             textAlign(RIGHT, CENTER);
    //             noStroke();
    //             textSize(10);
    //             rotate(0);
    //             text(this.data[i][this.xValue], 0, 0);
    //         }
    //         pop();
    //     }
    //     pop();
    //     pop();
    // }

    // renderTicks() {
    //     push();
    //     translate(this.chartPosX, this.chartPosY);
    //     noFill();

    //     let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis

    //     // Changing the look of the y axis.
    //     fill(this.axisTickTextColour);
    //     textAlign(RIGHT, CENTER);
    //     textSize(12); // Size of text on y axis

    //     if(this.orientation === 'vertical' || this.orientation === 'stacked') {
    //         for (let i = 0; i <= this.maxValue; i += stepSize) {
    //             let yPos = -i * this.scaler;

    //             stroke(this.axisTickColor);
    //             strokeWeight(1);
    //             line(0, yPos, -10, yPos);
                
    
    //             // Draw Y-axis numbers making sure they are all rounded to their nearest 10
    //             noStroke();
    //             text(i, -15, yPos); 
    //         }
    //     } else if(this.orientation === 'horizontal') {
    //         let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Always use increments of 50 for the y axis
    //         for(let i = 0; i <= this.maxValue; i += stepSize) {
    //             let xPos = i * this.scaler;

    //             if (i != 0) {
    //                 stroke(this.axisTickColor);
    //                 strokeWeight(1);
    //                 line(xPos, 0, xPos, this.gap);
    //             }
    
    //             // Draw Y-axis numbers making sure they are all rounded to their nearest 10
    //             noStroke();
    //             text(i, xPos + this.gap, 15); 
    //         }
    //     }

    //     // Looking to display the numbers and the lines on the y axis.
        
    //     pop();
    // }

    renderTickLines() {
        push();
        translate(this.chartPosX, this.chartPosY);
        noFill();

        let stepSize = ceil((this.maxValue / this.tickNum) / 50) * 50; // Number of divisions


        if(this.orientation === 'vertical' || this.orientation === 'stacked') {
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