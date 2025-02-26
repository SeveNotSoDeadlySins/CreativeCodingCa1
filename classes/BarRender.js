// BarRender class extends the Chart class, handling all bar rendering logic.
class BarRender extends Chart {
  constructor(chart) {
    super(chart);  // Call the Chart (parent) constructor, passing in the chart instance.
    console.log("BarRender created with", chart);
  }

  /**
   * Main renderBars method. It decides which type of chart to render based on the orientation.
   */
  renderBars() {
    console.log("renderBars data:", this.data);

    // Check whether the orientation toggle is checked (e.g., to force horizontal orientation).
    const isChecked = document.getElementById("toggleOrientation").checked;
    console.log(`isChecked: ${isChecked}`);
    if (isChecked === true) {
      this.renderHorizontalBars();
      console.log("Rendering horizontal bars");
      return;
    }

    console.log("renderBars data:", this.data); // Log the data array.
    console.log("Calling sliceAndDiceTreemap with:", this.data, this.chartPosX, this.chartPosY, this.chartWidth, this.chartHeight);
    console.log("Rendering chart with orientation:", this.orientation);
    console.log("Chart orientation on creation:", this.orientation);

    // Switch based on chart orientation.
    switch (this.orientation) {
      case 'vertical':
        // Render a vertical bar chart.
        this.renderVerticalBars();
        break;
      case 'stacked':
        {
          // Set local variables for chart dimensions and spacing.
          let chartPosX = this.chartPosX;
          let chartPosY = this.chartPosY;
          let chartWidth = this.chartWidth;
          let chartHeight = this.chartHeight;
          let barWidth = this.barWidth;
          let gap = this.gap;

          // (Optional) Set additional properties if needed.
          this.barchartPosX = -400;
          this.barchartPosY = 100;
          // Render a stacked bar chart by region.
          this.stackedBarChart(this.data, chartPosX, chartPosY, chartWidth, chartHeight, gap, barWidth);
        }
        break;
      case 'cluster':
        // Render clustered bars.
        this.renderClusteredBars();
        break;
      case 'fullGraph':
        // Render a 100% stacked chart by region.
        this.render100PercentChartByRegion(this.chartPosX, this.chartPosY, this.chartWidth, this.chartHeight);
        break;
      case 'treeMap':
        {
          // Sort the data by population in descending order.
          let sortedData = this.data.sort((a, b) => b.population - a.population);
          let rectangles = [];
          let treemapWidth = 800;
          let treemapHeight = 600;
          // Build a treemap layout.
          this.rowTreemap(this.data, this.chartPosX, this.chartPosY, treemapWidth, treemapHeight, rectangles);
          // Adjust treemap to fit within given dimensions.
          this.adjustTreemapToFit(rectangles, this.chartPosX, this.chartPosY, treemapWidth, treemapHeight);
          // Draw the treemap.
          this.drawTreemap(rectangles);
        }
        break;
      default:
        console.error(`Unknown chart type: ${this.orientation}`);
        break;
    }
  }

  /**
   * Render a vertical bar chart.
   * Inverts the y-axis so that bars extend upward.
   * Also draws a title above the chart.
   */
  renderVerticalBars() {
    //Title
    push();
      textAlign(CENTER, CENTER);
      textSize(16);
      fill(0);
      // Place title above the chart. Adjust y-offset as needed.
      text("Vertical Bar Graph", this.chartPosX + this.chartWidth / 2, this.chartPosY + 60);
    pop();
    push();
      // Translate to chart position.
      translate(this.chartPosX, this.chartPosY);
      // Invert y-axis so that positive values extend upward.
      scale(1, -1);
      // Translate further by the left margin.
      translate(this.margin, 0);
      console.log("Rendering vertical bars");
      // Draw the bars.
      for (let i = 0; i < this.data.length; i++) {
          // Calculate x-offset for the bar.
          let jump = (this.barWidth + this.gap) * i;
          console.log(`Rendering bar at index ${i} with height: ${this.data[i][this.yValue] * this.scaler}`);
          console.log(`Scaler: ${this.scaler}`);
          fill(this.barColour);
          noStroke();
          // Draw the bar. Bars have rounded top corners (last 2 parameters).
          rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0, 0, 5, 5);
      }
    pop();
  }

  /**
   * Render a horizontal bar chart.
   * Translates the chart and draws bars with width proportional to the data value.
   */
  renderHorizontalBars() {
    push();
      // Translate to chart's position.
      translate(this.chartPosX, this.chartPosY);
      // Adjust by margin.
      translate(0, -this.margin);
      // Set bar height as a fixed value (based on this.barWidth).
      let barHeight = this.barWidth;
      // Loop through each data item.
      for (let i = 0; i < this.data.length; i++) {
          // Calculate vertical jump for the bar position.
          let jump = (barHeight + this.gap) * (i + 1);
          // Calculate the bar width based on the data value.
          let barWidth = this.data[i][this.yValue] * this.scaler;
          console.log(`barWidth: ${barWidth}, jump: ${jump}, barHeight: ${barHeight}`);
          console.log(`Rendering bar at index ${i} with width: ${barWidth}`);
          fill(this.barColour);
          // Draw the rectangle.
          rect(0, -jump, barWidth, barHeight);
      }
    pop();
  }

  /**
   * Group data by region.
   * Returns an object where each key is a region name and its value is an object
   * containing the total population and an array of data items.
   */
  groupDataByRegion(data) {
    let regions = {};
    for (let item of data) {
      // Trim region string.
      let reg = item.region.trim();
      if (!regions[reg]) {
        regions[reg] = {
          totalPop: 0,
          items: []
        };
      }
      // Add the item and update the region's total population.
      regions[reg].items.push(item);
      regions[reg].totalPop += item.population;
    }
    return regions;
  }

  /**
   * Calculate the maximum total population across all regions.
   * Saves the maximum on the instance (this.MaxValue) and returns it.
   */
  calculateMaxValue() {
    let regions = this.groupDataByRegion(this.data);
    let maxVal = 0;
    for (let region in regions) {
      let regionTotal = regions[region].totalPop;
      if (regionTotal > maxVal) {
        maxVal = regionTotal;
      }
    }
    this.MaxValue = maxVal;
    return maxVal;
  }


  /**
   * Aggregate region data by keeping the top N items and summing the rest as "Other".
   * Returns the modified regionData.
   */
  aggregateRegionData(regionData, topN = 5) {
    regionData.items.sort((a, b) => b.population - a.population);
    if (regionData.items.length > topN) {
      let topItems = regionData.items.slice(0, topN);
      let otherPop = regionData.items.slice(topN).reduce((sum, item) => sum + item.population, 0);
      topItems.push({ country: "Other", population: otherPop });
      regionData.items = topItems;
      regionData.totalPop = topItems.reduce((sum, item) => sum + item.population, 0);
    }
    return regionData;
  }

  /**
   * Find the maximum total population among all regions.
   */
  findMaxRegionPop(regions) {
    let maxPop = 0;
    for (let regionName in regions) {
      let regionData = regions[regionName];
      if (regionData.totalPop > maxPop) {
        maxPop = regionData.totalPop;
      }
    }
    return maxPop;
  }

  /**
   * Draw a stacked bar chart that groups data by region.
   * For each region, it sorts items by population, keeps the top three, and aggregates the rest as "Other".
   * Then it creates 4 columns (for top1, top2, top3, and Other) that are stacked vertically.
   */
  stackedBarChart(data, chartX, chartY, chartWidth, chartHeight, gapBetweenCols, colWidth) {
    // --- 1. Group data by region.
    let regions = {};  
    data.forEach(item => {
      let reg = (item.region !== undefined && item.region !== null) ? item.region.trim() : "Unknown";
      if (!regions[reg]) {
        regions[reg] = [];
      }
      regions[reg].push(item);
    });
    let regionNames = Object.keys(regions);
    
    // --- 2. For each region, sort items descending by population and build a 4-element array:
    // [ highest, second highest, third highest, other (sum of remainder) ]
    let regionRankValues = {};
    regionNames.forEach(reg => {
      let items = regions[reg].sort((a, b) => b.population - a.population);
      let rankValues = [];
      for (let r = 0; r < 3; r++) {
        rankValues[r] = (r < items.length) ? items[r].population : 0;
      }
      let other = 0;
      for (let r = 3; r < items.length; r++) {
        other += items[r].population;
      }
      rankValues[3] = other;
      regionRankValues[reg] = rankValues;
    });
    
    // --- 3. Create an array for each rank (4 columns):
    let numRanks = 4;
    let rankData = [];
    for (let r = 0; r < numRanks; r++) {
      rankData[r] = [];
      regionNames.forEach(reg => {
        let value = regionRankValues[reg][r] || 0;
        rankData[r].push({ region: reg, value });
      });
    }
    
    // --- 4. Compute total value for each rank column.
    let rankTotals = rankData.map(col => col.reduce((sum, d) => sum + d.value, 0));
    
    // --- 5. Find the maximum total among the columns for scaling.
    let maxRankTotal = Math.max(...rankTotals);
    if (maxRankTotal === 0) {
      console.error("No data to render.");
      return;
    }
    
    // --- 6. Set horizontal spacing for the rank columns.
    let colGap = gapBetweenCols || 20;
    let columnWidth = colWidth || 40;
    let totalColumnsWidth = numRanks * columnWidth + (numRanks + 1) * colGap;
    let startX = chartX + (chartWidth - totalColumnsWidth) / 2;
    
    // --- 7. Draw axes.
    push();
      stroke(0);
      strokeWeight(2);
      line(startX, chartY, startX, chartY + chartHeight);
      line(startX, chartY + chartHeight, startX + totalColumnsWidth, chartY + chartHeight);
    pop();
    
    // --- 8. Draw Y-axis tick labels.
    let numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      let tickValue = (i / numTicks) * maxRankTotal;
      let tickY = chartY + chartHeight - (tickValue / maxRankTotal) * chartHeight;
      stroke(0);
      line(startX - 5, tickY, startX, tickY);
      noStroke();
      fill(0);
      textAlign(RIGHT, CENTER);
      text(tickValue.toFixed(0), startX - 10, tickY);
    }
    
    // --- 9. Create a color mapping for regions.
    let regionColors = {};
    let presetColors = [
      color(255, 99, 132),   // red
      color(54, 162, 235),   // blue
      color(75, 192, 192),   // green
      color(153, 102, 255),  // purple
      color(255, 159, 64),   // orange
      color(200, 200, 0)     // yellow
    ];
    regionNames.sort();
    regionNames.forEach((reg, idx) => {
      regionColors[reg] = presetColors[idx % presetColors.length];
    });
    
    // --- 10. Draw each rank column.
    for (let r = 0; r < numRanks; r++) {
      let colX = startX + colGap + r * (columnWidth + colGap);
      let scaleFactor = chartHeight / maxRankTotal;
      let colData = rankData[r].sort((a, b) => a.region.localeCompare(b.region));
      
      let currentY = chartY + chartHeight;
      for (let d of colData) {
        let segHeight = d.value * scaleFactor;
        // Use the color specific to the region.
        fill(regionColors[d.region]);
        noStroke();
        rect(colX, currentY - segHeight, columnWidth, segHeight);

        currentY -= segHeight;
      }

      // Draw the chart title above the entire chart.
      // This could be moved elsewhere if desired.
      let titleY = chartY + chartHeight + 40;
      textAlign(CENTER, TOP);
      text("Population per Region Comparison", chartX + chartWidth / 2, titleY);
      
      // Label the column below with the rank (rotated by 45 degrees).
      fill(0);
      textSize(12);
      textAlign(CENTER, TOP);
      let rankLabel = (r < 3) ? "Rank " + (r + 1) : "Other";
      push();
        translate(colX + columnWidth / 2, chartY + chartHeight + 5);
        rotate(45);
        text(rankLabel, 10, 10);
      pop();
    }
    
    // --- 11. Draw a legend to the left of the chart.
    // Position legend 50px to the left of startX.
    let legendX = startX - 320;
    let legendY = chartY;
    let boxSize = 15;
    let legendSpacing = 25;
    push();
      textSize(12);
      textAlign(LEFT, CENTER);
      for (let reg of regionNames) {
        fill(regionColors[reg]);
        noStroke();
        rect(legendX, legendY, boxSize, boxSize);
        
        fill(0);
        text(reg, legendX + boxSize + 5, legendY + boxSize / 2);
        
        legendY += legendSpacing;
      }
    pop();
  }
  

  /**
   * Render a 100% stacked chart by region.
   * For each region, it groups countries, sorts by population, aggregates the top 3 and "Other",
   * then draws a full-height bar that represents 100% for that region.
   */
  render100PercentChartByRegion(chartX, chartY, chartWidth, chartHeight) {
    // --- 1) Draw axes.
    push();
      stroke(0);
      strokeWeight(2);
      line(chartX, chartY, chartX, chartY + chartHeight); // Y-axis
      line(chartX, chartY + chartHeight, chartX + chartWidth, chartY + chartHeight); // X-axis
    pop();
    
    // --- 2) Group data by region.
    let regions = this.groupDataByRegion(this.data);
    let regionNames = Object.keys(regions);
    let numberOfRegions = regionNames.length;
    
    // --- 3) Compute total world population.
    let totalWorldPopulation = this.data.reduce((sum, d) => sum + d.population, 0);
    
    // --- 4) Determine spacing between region bars.
    let barGap = 50;
    let regionBarWidth = (chartWidth - (numberOfRegions + 1) * barGap) / numberOfRegions;
    
    // --- 5) Prepare an array for region labels.
    let regionLabelArray = [];
    
    // --- 6) Loop over each region to draw its 100% stacked bar.
    for (let regionIndex = 0; regionIndex < numberOfRegions; regionIndex++) {
      let regionName = regionNames[regionIndex];
      let regionInfo = regions[regionName];
      
      // Sort the countries in the region by population (largest first)
      regionInfo.items.sort((a, b) => b.population - a.population);
      
      // If more than 3 countries, keep top 3 and aggregate the rest as "Other"
      if (regionInfo.items.length > 3) {
        let topCountries = regionInfo.items.slice(0, 3);
        let otherPopulation = regionInfo.items.slice(3).reduce((sum, country) => sum + country.population, 0);
        topCountries.push({ country: "Other", population: otherPopulation });
        regionInfo.items = topCountries;
        regionInfo.totalPop = topCountries.reduce((sum, country) => sum + country.population, 0);
      }
      
      let totalRegionPopulation = regionInfo.totalPop;
      let regionPercentage = ((totalRegionPopulation / totalWorldPopulation) * 100).toFixed(1) + "%";
      
      // --- 7) Compute the x-position for this region’s bar.
      let regionBarX = chartX + barGap + regionIndex * (regionBarWidth + barGap);
      let segmentBottomY = chartY + chartHeight;  // Bottom of the bar
    
      // --- 8) (Optional) Outline the bar.
      stroke(0);
      noFill();
      rect(regionBarX, chartY, regionBarWidth, chartHeight);
    
      // --- 9) Draw each country's segment from bottom up.
      noStroke();
      for (let countryData of regionInfo.items) {
        let fraction = countryData.population / totalRegionPopulation;
        let segmentHeight = fraction * chartHeight;
        
        // Draw the segment with a random color.
        fill(random(100, 255), random(100, 255), random(100, 255));
        rect(regionBarX, segmentBottomY - segmentHeight, regionBarWidth, segmentHeight);
        
        // If tall enough, label inside the segment.
        if (segmentHeight > 20) {
          fill(0);
          textSize(10);
          textAlign(CENTER, CENTER);
          let percentageString = (fraction * 100).toFixed(1) + "%";
          text(countryData.country + " " + percentageString, regionBarX + regionBarWidth / 2, segmentBottomY - segmentHeight / 2);
        }
        segmentBottomY -= segmentHeight;
      }
      
      // --- 10) Build a label object for the region.
      regionLabelArray.push({
        text: `${regionName} (${regionPercentage})`,
        x: regionBarX + regionBarWidth / 2,
        y: chartY + chartHeight + 20,  // 20 px below the bar
        angle: 45                      // rotate 45 degrees
      });
    }
    
    // --- 11) Store region labels on the instance for later use.
    this.chartRegionLabels = regionLabelArray;
    console.log("Region labels:", this.chartRegionLabels);
    
    // --- 12) Draw region labels using LabelRender.
    let labelRender = new LabelRender(this);
    labelRender.drawRegionLabels(this.chartRegionLabels);
  }
  
  /**
   * Render clustered bars.
   * For each data row, it draws a cluster of bars for each dataset (e.g., Male, Female).
   */
  renderClusteredBars() {
    push();
      translate(this.chartPosX, this.chartPosY); // Move to chart position
      scale(1, -1); // Flip the y-axis for upward-growing bars
  
      // Adjust for margin.
      translate(this.margin, 0);
  
      // Loop through each data row (each category).
      for (let i = 0; i < this.data.length; i++) {
          push(); // Create a new transformation context for each category
  
          // Calculate the starting x position for the cluster.
          let clusterXPos = (this.barWidth * this.yValue.length + this.gap) * i;
          
          // Loop through each dataset in yValue.
          for (let j = 0; j < this.yValue.length; j++) {
              // Calculate the bar width for this dataset.
              let barWidthVal = this.data[i][this.yValue[j]] * this.scaler;
              console.log(`Rendering cluster bar at index ${i}, dataset: ${this.yValue[j]}, value: ${this.data[i][this.yValue[j]]} with width: ${barWidthVal}`);
              console.log(`Scaler: ${this.scaler}`);
  
              // Set the fill color cycling through barColours.
              noStroke();
              fill(this.barColours[j % this.barColours.length]);
  
              // Calculate x-position for this bar in the cluster.
              let barPositionX = clusterXPos + j * this.barWidth;
              console.log(`Position for Bar ${j}: ${barPositionX}`);
  
              // Draw the vertical bar for this dataset.
              rect(barPositionX, 0, this.barWidth, barWidthVal);
          }
  
          pop(); // End transformation for this category.
      }
    pop(); // End the chart position transformation.
  }

  /**
   * Construct a treemap layout (row-based) for the data.
   * The data is divided into rows, each row's items are laid out horizontally,
   * and any leftover items are pushed into a new row.
   * The rectangles array is populated with objects containing position and dimensions.
   */
  rowTreemap(data, x, y, totalWidth, totalHeight, rectangles) {
    let totalPop = data.reduce((sum, d) => sum + d.population, 0);
    let area = totalWidth * totalHeight;
    let scale = area / totalPop;
    
    let currentY = y;
    let row = [];
    let rowSum = 0;
    let currentUsedWidth = 0;  // Track the used width in the current row.
    const MIN_ROW_HEIGHT = 35; // Minimum row height for readability.
    const maxItemsPerRow = 4;  // force a new row after 4 items.
    
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      
      // Estimate the row if this item is added.
      let tentativeRowSum = rowSum + item.population;
      let tentativeRowArea = tentativeRowSum * scale;
      let tentativeRowHeight = tentativeRowArea / totalWidth;
      tentativeRowHeight = Math.max(tentativeRowHeight, MIN_ROW_HEIGHT);
      
      // Estimate the width of this item in the current row.
      let itemArea = item.population * scale;
      let itemWidth = itemArea / tentativeRowHeight;
      
      // If adding this item would exceed totalWidth or too many items, finalize the row.
      if (currentUsedWidth + itemWidth > totalWidth || row.length >= maxItemsPerRow) {
        this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, rectangles, MIN_ROW_HEIGHT);
        let finalizedRowHeight = this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, [], MIN_ROW_HEIGHT);
        currentY += finalizedRowHeight;
        row = [];
        rowSum = 0;
        currentUsedWidth = 0;
      }
      
      // Add item to the row.
      row.push(item);
      rowSum += item.population;
      let rowArea = rowSum * scale;
      let rowHeight = rowArea / totalWidth;
      rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT);
      currentUsedWidth += itemArea / rowHeight;
    }
    
    // Finalize any leftover items.
    if (row.length > 0) {
      this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, rectangles, MIN_ROW_HEIGHT);
    }
  }

  /**
   * Helper function to layout a row in the treemap.
   * It adjusts widths so the row exactly fills totalWidth and returns the row's height.
   */
  finalizeRow(row, rowSum, x, y, totalWidth, scale, rectangles, MIN_ROW_HEIGHT) {
    let rowArea = rowSum * scale;
    let rowHeight = rowArea / totalWidth;
    rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT);
    
    // Compute widths for each item in the row.
    let rowRects = [];
    let usedWidth = 0;
    for (let item of row) {
      let itemArea = item.population * scale;
      let itemWidth = itemArea / rowHeight;
      rowRects.push({ x: 0, y: y, w: itemWidth, h: rowHeight, country: item.country, population: item.population });
      usedWidth += itemWidth;
    }
    
    // Distribute any leftover width proportionally.
    let leftover = totalWidth - usedWidth;
    if (leftover > 0 && rowRects.length > 0) {
      for (let rect of rowRects) {
        let proportion = rect.w / usedWidth;
        rect.w += leftover * proportion;
      }
    }
    
    // Set x-positions for each rectangle.
    let currentX = x;
    for (let rect of rowRects) {
      rect.x = currentX;
      currentX += rect.w;
      if (rectangles) {
        rectangles.push(rect);
      }
    }
    
    return rowHeight;
  }
    
  /**
   * Another helper function to layout a row (alternate implementation).
   * This version clamps the row height between a minimum and maximum.
   */
  layoutRow(row, rowSum, x, y, totalWidth, scale, rectangles) {
    let rowArea = rowSum * scale;
    let rowHeight = rowArea / totalWidth;
    
    // Enforce a minimum and maximum row height.
    const MIN_HEIGHT = 35;
    const MAX_HEIGHT = 100; // Adjust as needed.
    rowHeight = Math.max(rowHeight, MIN_HEIGHT);
    rowHeight = Math.min(rowHeight, MAX_HEIGHT);
    
    let currentX = x;
    let rowRects = [];
    let usedWidth = 0;
    
    // Compute each item's width.
    for (let item of row) {
      let itemArea = item.population * scale;
      let itemWidth = itemArea / rowHeight;
      rowRects.push({
        x: 0, // placeholder
        y: y, //y is equal to chartPosY
        w: itemWidth,
        h: rowHeight,
        country: item.country,
        population: item.population
      });
      usedWidth += itemWidth;
    }
    
    // Distribute leftover horizontal space.
    let leftover = totalWidth - usedWidth;
    if (leftover > 0 && rowRects.length > 0) {
      for (let rect of rowRects) {
        let proportion = rect.w / usedWidth;
        rect.w += leftover * proportion;
      }
    }
    
    // Fix the x positions.
    let fixX = x;
    for (let rect of rowRects) {
      rect.x = fixX;
      fixX += rect.w;
      rectangles.push(rect);
    }
    
    return rowHeight;
  }
    
  /**
   * Adjusts the treemap rectangles so they fit within the target dimensions.
   */
  adjustTreemapToFit(rectangles, x, y, targetWidth, targetHeight) {
    // Compute current bounding box.
    let maxX = 0, maxY = 0;
    for (let rect of rectangles) {
      maxX = Math.max(maxX, rect.x + rect.w);
      maxY = Math.max(maxY, rect.y + rect.h);
    }
    let currentWidth = maxX - x;
    let currentHeight = maxY - y;
    let scaleX = targetWidth / currentWidth;
    let scaleY = targetHeight / currentHeight;
    
    // Use the smaller scale factor uniformly.
    let scaleFactor = Math.min(scaleX, scaleY);
    
    for (let rect of rectangles) {
      rect.x = x + (rect.x - x) * scaleFactor;
      rect.y = y + (rect.y - y) * scaleFactor;
      rect.w *= scaleFactor;
      rect.h *= scaleFactor;
    }
  
    console.log(`Adjusted treemap: max X = ${maxX}`);
  }

  drawTreemap(rectangles) {
    for (let r of rectangles) {
      // Draw each rectangle with a random color.
      fill(random(100, 255), random(100, 255), random(100, 255));
      stroke(0);
      rect(r.x, r.y, r.w, r.h);
  
      // Draw a label in the center of the rectangle.
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(r.country + "\n" + formatPopulation(r.population), r.x + r.w / 2, r.y + r.h / 2);
    }
  }
  

  
  // End of BarRender class.
}
