class LegendRender extends Chart{
    constructor(chart) {
        super(chart);  // Pass the chart instance to the parent class (Chart)
        console.log("BarRender created with", chart);

    }



    renderLegends() {
        console.log("Rendering chart with orientation:", this.orientation);

        console.log("Chart orientation on creation:", this.orientation);

        // Otherwise, use the default orientation logic
        switch (this.orientation) {
            // case 'stacked':
            //     this.renderStackedLegend();
            //     break;
            case 'cluster':
                this.renderClusteredLegend();
                break;
            case 'fullGraph':
                this.renderFullGraphLegend();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
    renderClusteredLegend() {
    let legendX = this.chartPosX - 150; // Shift the legend to the left of the chart (adjust -100 as needed)
    
    // Center the legend vertically relative to the chart
    let legendTotalHeight = this.yValue.length * 20; // Total height of the legend
    let legendY = this.chartPosY - (this.chartHeight / 2) + (legendTotalHeight / 2);

    let legendSpacing = 20; // Spacing between legend items

    for (let i = 0; i < this.yValue.length; i++) {
        // Draw the color box
        fill(this.barColours[i % this.barColours.length]);
        noStroke();
        rect(legendX, legendY + i * legendSpacing, 15, 15); // 15x15 color box

        // Draw the text label next to the color box
        fill("black");
        textSize(12);
        textAlign(LEFT, CENTER);
        text(this.yValue[i], legendX + 20, legendY + i * legendSpacing + 7.5);
    }
    }


    renderHorizontalBars() {
        push();
        translate(this.chartPosX, this.chartPosY); // Position the chart

        // Adjust for margin
        translate(0, -this.margin); 

        // Ensure the bar height is set appropriately (can use this.barWidth for a consistent bar height)
        let barHeight = this.barWidth;

        // Loop through the data
        for (let i = 0; i < this.data.length; i++) {
            // Calculate the spacing between bars
            let jump = (barHeight + this.gap) * (i + 1);

            // Calculate the bar width based on data value
            let barWidth = this.data[i][this.yValue] * this.scaler;
            console.log(`barWidth: ${barWidth}, jump: ${jump}, barHeight: ${barHeight}`);

            console.log(`Rendering bar at index ${i} with width: ${barWidth}`);

            fill(this.barColour); // Set bar color

            rect(0, -jump, barWidth, barHeight);

        }

        pop();
    }

    renderClusteredBars() {
        push();
        translate(this.chartPosX, this.chartPosY); // Position the chart
        scale(1, -1); // Flip the y-axis for better visualization
    
        // Adjust for margin (to create space at the top)
        translate(this.margin, 0);
    
        // Loop through the data (for each category)
        for (let i = 0; i < this.data.length; i++) {
            push(); // Create a new transformation context for each category
    
            // Calculate the position for the current cluster (group of bars)
            let clusterXPos = (this.barWidth * this.yValue.length + this.gap) * i; // Space between clusters (categories)
    
            // Loop through each selected Y-axis value and draw each corresponding bar for the cluster
            for (let j = 0; j < this.yValue.length; j++) {
                // Calculate the bar width based on data value and scaler
                let barWidth = this.data[i][this.yValue[j]] * this.scaler;
    
                // Debugging log
                console.log(`Rendering cluster bar at index ${i}, Y-axis: ${this.data[i][this.yValue[j]]} with width: ${barWidth}`);
                console.log(`Rendering Scaler ${this.scaler}`);
    
                // Set the color for the bar (cycle through a set of colors)
                fill(this.barColours[j % this.barColours.length]); // Use cycling colors
    
                // Calculate the position for each bar within the cluster (adjust the position based on index)
                let barPositionX = clusterXPos + j * this.barWidth; // Position each bar within the cluster without adding the gap here
    
                // Debugging position calculation
                console.log(`Position for Bar ${j}: ${barPositionX}`);
    
                // Draw the bar in the cluster (each bar for this category)
                rect(barPositionX, 0, this.barWidth, barWidth); // Vertical bars
            }
    
            pop(); // End the transformation context for this category
        }
    
        pop(); // End the chart position transformation context
    }
    
    renderFullGraphLegend() {
        console.log("Legend")
    }
}