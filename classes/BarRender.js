class BarRender extends Chart{
    constructor(chart) {
        super(chart);  // Pass the chart instance to the parent class (Chart)
        console.log("BarRender created with", chart);

    }



    renderBars() {
        console.log("renderBars data:", this.data);


        const isChecked = document.getElementById("toggleOrientation").checked;
    
        // Force the chart to render as horizontal if the checkbox is checked
        console.log(`isChecked: ${isChecked}`);
        if (isChecked === true) {
            this.renderHorizontalBars();
            console.log("Rendering horizontal bars");
            return;
        }


        console.log("renderBars data:", this.data); // shows an array


        console.log("Calling sliceAndDiceTreemap with:", this.data, this.chartPosX, this.chartPosY, this.chartWidth, this.chartHeight);


        console.log("Rendering chart with orientation:", this.orientation);

    
        console.log("Chart orientation on creation:", this.orientation);

        // Otherwise, use the default orientation logic
        switch (this.orientation) {
            case 'vertical':
                this.renderVerticalBars();
                break;
            case 'stacked':
                let chartPosX = this.chartPosX;
                let chartPosY = this.chartPosY;
                let chartWidth = this.chartWidth;
                let chartHeight = this.chartHeight;
                let barWidth = this.barWidth;
                let gap = this.gap;


                this.stackedBarChartByRank(cleanedData, chartPosX, chartPosY, chartWidth, chartHeight, barWidth, gap);
              break;
            case 'cluster':
                this.renderClusteredBars();
                break;
            case 'fullGraph':

                this.render100PercentChartByRegion(this.chartPosX, this.chartPosY,this.chartWidth,this.chartHeight);
                break;
            case 'treeMap':

                // let groupedData = this.groupSmallItems(this.data, 0.01); // group items < 1% of total


                let sortedData = this.data.sort((a, b) => b.population - a.population);

                let rectangles = [];
                let treemapWidth = 800;
                let treemapHeight = 600




                this.rowTreemap(this.data, this.chartPosX, this.chartPosY, treemapWidth,treemapHeight, rectangles);
                // this.findMaxWidth(row, rowHeight, scale, totalWidth); 
                this.adjustTreemapToFit(rectangles, this.chartPosX, this.chartPosY, treemapWidth, treemapHeight);

                this.drawTreemap(rectangles);
                break;
            case 'line':
                this.renderLineChart();
                break;
            default:
                console.error(`Unknown chart type: ${this.orientation}`);
                break;
        }
    }
    
  renderVerticalBars() {
      push();
      translate(this.chartPosX, this.chartPosY);
      scale(1, -1);
      translate(this.margin, 0);
      console.log("Rendering vertical bars");
      for (let i = 0; i < this.data.length; i++) {
          let jump = (this.barWidth + this.gap) * i;
          console.log(`Rendering bar at index ${i} with height: ${this.data[i][this.yValue] * this.scaler}`);
          console.log(`Scaler: ${this.scaler}`);
          fill(this.barColour);
          noStroke();
          rect(jump, 0, this.barWidth, this.data[i][this.yValue] * this.scaler, 0, 0, 5, 5); 
      }
      pop();
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

  groupDataByRegion(data) {
    let regions = {};
    for (let item of data) {
      // Ensure region is trimmed, etc.
      let region = item.region.trim();
      if (!regions[region]) {
        regions[region] = {
          totalPop: 0,
          items: []
        };
      }
      regions[region].items.push(item);
      regions[region].totalPop += item.population;
    }
    return regions;
  }

  calculateMaxValue() {
    // Group data by region
    let regions = this.groupDataByRegion(this.data);
    let maxVal = 0;
    
    // Iterate over each region
    for (let region in regions) {
      // For each region, we assume you've already aggregated the top items and computed totalPop
      let regionTotal = regions[region].totalPop;
      if (regionTotal > maxVal) {
        maxVal = regionTotal;
      }
    }
    this.MaxValue = maxVal; // Save it on the instance
    return maxVal;
  }

  calculateBarX(baseX, gap, barWidth, index) {
    return baseX + gap + index * (barWidth + gap);
  }

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

  stackedBarChartByRank(data, chartPosX, chartPosY, chartWidth, chartHeight, gapBetweenBars, colWidth) {
    // 1. Group data by region.
    let regions = {};  
    data.forEach(item => {
      // Use a default value if Region is missing.
      let region = (item.Region !== undefined && item.Region !== null) ? item.Region.trim() : "Unknown";
      if (!regions[region]) {
        regions[region] = [];
      }
      regions[region].push(item);
    });
    let regionNames = Object.keys(regions);
    
    // 2. For each region, sort items descending by Total and create a 4-element array:
    //    [ highest, second highest, third highest, other (sum of remainder) ]
    let regionRankValues = {};
    regionNames.forEach(region => {
      // Sort descending by Total population.
      let items = regions[region].sort((a, b) => b.Total - a.Total);
      let rankValues = [];
      // Highest, second, third
      for (let r = 0; r < 3; r++) {
        rankValues[r] = (r < items.length) ? items[r].Total : 0;
      }
      // Other: sum of items from index 3 onward.
      let other = 0;
      for (let r = 3; r < items.length; r++) {
        other += items[r].Total;
      }
      rankValues[3] = other;
      regionRankValues[region] = rankValues;
    });
    
    // 3. Create an array for each rank (4 columns):
    // For rank i, build an array of objects: { region, value }
    let numRanks = 4;
    let rankData = [];
    for (let r = 0; r < numRanks; r++) {
      rankData[r] = [];
      regionNames.forEach(region => {
        let value = regionRankValues[region][r] || 0;
        rankData[r].push({ region, value });
      });
    }
    
    // 4. Compute the total value for each rank column.
    let rankTotals = rankData.map(col => col.reduce((sum, d) => sum + d.value, 0));
    
    // 5. Find the maximum total among the columns for scaling.
    let maxRankTotal = Math.max(...rankTotals);
    
    // 6. Set horizontal spacing for the rank columns.
    let gap = gapBetweenBars || 20;
    let columnWidth = colWidth || 40;
    let totalColumnsWidth = numRanks * columnWidth + (numRanks + 1) * gap;
    
    // Optionally, center the columns in chartWidth:
    let startX = chartPosX + (chartWidth - totalColumnsWidth) / 2;
    
    // 7. Draw Y-axis and X-axis.
    push();
      stroke(0);
      strokeWeight(2);
      line(startX, chartPosY, startX, chartPosY + chartHeight);
      line(startX, chartPosY + chartHeight, startX + totalColumnsWidth, chartPosY + chartHeight);
    pop();
    
    // 8. Define a color palette for regions.
    let regionColors = {};
    let presetColors = [
      color(255, 99, 132),
      color(54, 162, 235),
      color(255, 206, 86),
      color(75, 192, 192),
      color(153, 102, 255),
      color(255, 159, 64)
    ];
    // Use sorted region names for consistency.
    regionNames.sort();
    regionNames.forEach((region, idx) => {
      regionColors[region] = presetColors[idx % presetColors.length];
    });
    
    // 9. Draw each rank column.
    for (let r = 0; r < numRanks; r++) {
      // x-position for this column.
      let colX = startX + gap + r * (columnWidth + gap);
      // Scale so that maxRankTotal maps to chartHeight.
      let scaleFactor = chartHeight / maxRankTotal;
      
      // For each region in this column, sort alphabetically for consistent order.
      let colData = rankData[r].sort((a, b) => a.region.localeCompare(b.region));
      
      let currentY = chartPosY + chartHeight; // bottom of chart
      for (let d of colData) {
        let segHeight = d.value * scaleFactor;
        fill(regionColors[d.region]);
        noStroke();
        rect(colX, currentY - segHeight, columnWidth, segHeight);
        // Optionally, label the segment if tall enough.
        if (segHeight > 15) {
          fill(0);
          textSize(10);
          textAlign(CENTER, CENTER);
          let pctString = (d.value / rankTotals[r] * 100).toFixed(1) + "%";
          text(d.region + " " + pctString, colX + columnWidth / 2, currentY - segHeight / 2);
        }
        currentY -= segHeight;
      }
      
      // Label the column below with the rank.
      fill(0);
      textSize(12);
      textAlign(CENTER, TOP);
      let rankLabel = (r < 3) ? "Rank " + (r + 1) : "Other";
      push();
        translate(colX + columnWidth / 2, chartPosY + chartHeight + 5);
        rotate(radians(45));
        text(rankLabel, 0, 0);
      pop();
    }
    
    // Optionally, you can add Y-axis tick labels here.
  }
  
  


  // y = this.chartPosY x = this.chartPosX
  render100PercentChartByRegion(x, y, chartWidth, chartHeight) {
    // 1) Draw axes (optional)
    push();
    stroke(0);
    strokeWeight(2);
    // Y-axis
    line(x, y, x, y + chartHeight);
    // X-axis
    line(x, y + chartHeight, x + chartWidth, y + chartHeight);
    pop();
  
    // 2) (Optional) draw Y-axis labels or ticks if needed, using your LabelRender or TickRender.
    // let labelRender = new LabelRender(this);
    // labelRender.drawYAxisLabels(x, y, chartHeight);
  
    // 3) Group data by region
    let regions = this.groupDataByRegion(this.data);
    let regionNames = Object.keys(regions);
    let numRegions = regionNames.length;
  
    // 4) Calculate total world population
    let worldTotal = this.data.reduce((sum, d) => sum + d.population, 0);
  
    // 5) Determine bar spacing
    let gap = 50;
    let barWidth = (chartWidth - (numRegions + 1) * gap) / numRegions;
  
    // We'll store an array of label objects for each region
    let regionLabels = [];
  
    // 6) Loop over each region to draw its 100% stacked bar
    for (let i = 0; i < numRegions; i++) {
      let regionName = regionNames[i];          // e.g., "Northern Africa"
      let regionData = regions[regionName];
  
      // Sort countries descending by population
      regionData.items.sort((a, b) => b.population - a.population);
  
      // If more than 3 countries, keep top 3 and aggregate the rest as "Other"
      regionData.items.sort((a, b) => b.population - a.population);

      // If there are more than 3 countries, keep the top 3 and aggregate the rest as "Other"
      if (regionData.items.length > 3) {
        let topItems = regionData.items.slice(0, 3);
        let otherPop = regionData.items.slice(3).reduce((sum, item) => sum + item.population, 0);
        topItems.push({ country: "Other", population: otherPop });
        regionData.items = topItems;
        regionData.totalPop = topItems.reduce((sum, item) => sum + item.population, 0);
      }

      
  
      let totalPop = regionData.totalPop;
      // e.g. "48.9%"
      let regionPct = ((totalPop / worldTotal) * 100).toFixed(1) + "%";
  
      // 7) Compute bar position
      let barX = x + gap + i * (barWidth + gap);
      let currentY = y + chartHeight;  // bottom of the bar
  
      // (Optional) Outline the bar
      stroke(0);
      noFill();
      rect(barX, y, barWidth, chartHeight);
  
      // 8) Draw each country's segment from bottom up
      noStroke();
      for (let item of regionData.items) {
        let fraction = item.population / totalPop;
        let segHeight = fraction * chartHeight;
  
        fill(random(100,255), random(100,255), random(100,255));
        rect(barX, currentY - segHeight, barWidth, segHeight);
  
        // If tall enough, label inside the bar
        if (segHeight > 20) {
          fill(0);
          textSize(10);
          textAlign(CENTER, CENTER);
          let pctString = (fraction * 100).toFixed(1) + "%";
          text(item.country + " " + pctString, barX + barWidth / 2, currentY - segHeight / 2);
        }
        currentY -= segHeight;
      }
  
      // 9) Build a label object for the region, placed below the bar
      // Use a string for text, not an object
      regionLabels.push({
        text: `${regionName} (${regionPct})`, // <-- this is a STRING
        x: barX + barWidth / 2,
        y: y + chartHeight + 20, // 20 px below the bar
        angle: 45                // rotate 45 degrees
      });
    }
  
    // 10) Store region labels on the instance so LabelRender can use them
    this.chartRegionLabels = regionLabels;

    console.log("sdfsdfsfsfsdfs")
    console.log(this.chartRegionLabels)
  
    // If you want to draw them immediately, create LabelRender and call a method:
    let labelRender = new LabelRender(this);
    labelRender.drawRegionLabels(this.chartRegionLabels);
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
              noStroke();
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

  rowTreemap(data, x, y, totalWidth, totalHeight, rectangles) {
    // Calculate total population, overall area, and scale factor
    let totalPop = data.reduce((sum, d) => sum + d.population, 0);
    let area = totalWidth * totalHeight;
    let scale = area / totalPop;
    
    let currentY = y;
    let row = [];
    let rowSum = 0;
    let currentUsedWidth = 0;  // track used width in current row
    const MIN_ROW_HEIGHT = 35; // minimum row height for readability
    const maxItemsPerRow = 4;  // optional: force new row after 4 items
    
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      
      // Estimate this item’s width if it were added to the current row
      let tentativeRowSum = rowSum + item.population;
      let tentativeRowArea = tentativeRowSum * scale;
      let tentativeRowHeight = tentativeRowArea / totalWidth;
      // Clamp the height to ensure readability
      tentativeRowHeight = Math.max(tentativeRowHeight, MIN_ROW_HEIGHT);
      
      // Calculate the width of this item if placed in the current row:
      let itemArea = item.population * scale;
      let itemWidth = itemArea / tentativeRowHeight;
      
      // If adding this item would exceed the totalWidth OR we have too many items:
      if (currentUsedWidth + itemWidth > totalWidth || row.length >= maxItemsPerRow) {
        // Finalize current row: adjust widths so that the row exactly fills totalWidth
        this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, rectangles, MIN_ROW_HEIGHT);
        
        // Move to the next row: update vertical position based on the finalized row height.
        // We assume finalizeRow returns the actual row height.
        let finalizedRowHeight = this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, [], MIN_ROW_HEIGHT);
        currentY += finalizedRowHeight;
        
        // Reset row and width accumulator
        row = [];
        rowSum = 0;
        currentUsedWidth = 0;
      }
      
      // Add the item to the current row
      row.push(item);
      rowSum += item.population;
      // Recompute current row height with updated rowSum
      let rowArea = rowSum * scale;
      let rowHeight = rowArea / totalWidth;
      rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT);
      // And update used width based on row's current height
      // (Recalculate width for each item in the row; for simplicity, we add the new item’s width)
      currentUsedWidth += itemArea / rowHeight;
    }
    
    // Finalize any leftover items in the last row
    if (row.length > 0) {
      this.finalizeRow(row, rowSum, x, currentY, totalWidth, scale, rectangles, MIN_ROW_HEIGHT);
    }
  }
  
  // A helper function to layout a row and distribute leftover width so that row exactly fills totalWidth.
  // It returns the row's height.
  finalizeRow(row, rowSum, x, y, totalWidth, scale, rectangles, MIN_ROW_HEIGHT) {
    // Compute the area and initial row height
    let rowArea = rowSum * scale;
    let rowHeight = rowArea / totalWidth;
    rowHeight = Math.max(rowHeight, MIN_ROW_HEIGHT);
    
    // Compute each item's width using the clamped row height
    let rowRects = [];
    let usedWidth = 0;
    for (let item of row) {
      let itemArea = item.population * scale;
      let itemWidth = itemArea / rowHeight;
      rowRects.push({ x: 0, y: y, w: itemWidth, h: rowHeight, country: item.country, population: item.population });
      usedWidth += itemWidth;
    }
    
    // Distribute any leftover space proportionally so that the sum equals totalWidth
    let leftover = totalWidth - usedWidth;
    if (leftover > 0 && rowRects.length > 0) {
      for (let rect of rowRects) {
        let proportion = rect.w / usedWidth;
        rect.w += leftover * proportion;
      }
    }
    
    // Set x positions for the row
    let currentX = x;
    for (let rect of rowRects) {
      rect.x = currentX;
      currentX += rect.w;
    }
    
    // If a destination array is provided, push these rectangles into it
    if (rectangles) {
      rectangles.push(...rowRects);
    }
    
    return rowHeight;
  }
    
      
      // layoutRow places each item in the row side by side and returns the row height.
  layoutRow(row, rowSum, x, y, totalWidth, scale, rectangles) {
    let rowArea = rowSum * scale;
    let rowHeight = rowArea / totalWidth;
    
    // Enforce a minimum row height of 35px
    const MIN_HEIGHT = 35;
    // Optionally, enforce a maximum row height (if desired)
    const MAX_HEIGHT = 100; // adjust as needed
    
    // Clamp the rowHeight to be within [MIN_HEIGHT, MAX_HEIGHT]
    rowHeight = Math.max(rowHeight, MIN_HEIGHT);
    rowHeight = Math.min(rowHeight, MAX_HEIGHT);
    
    let currentX = x;
    let rowRects = [];
    let usedWidth = 0;
    
    // First pass: compute each item's width
    for (let item of row) {
      let itemArea = item.population * scale;
      let itemWidth = itemArea / rowHeight;
      rowRects.push({
        x: 0, // placeholder; we'll set x in a second pass
        y: y,
        w: itemWidth,
        h: rowHeight,
        country: item.country,
        population: item.population
      });
      usedWidth += itemWidth;
    }
    
    // Distribute leftover horizontal space to fill totalWidth exactly
    let leftover = totalWidth - usedWidth;
    if (leftover > 0 && rowRects.length > 0) {
      for (let rect of rowRects) {
        let proportion = rect.w / usedWidth;
        rect.w += leftover * proportion;
      }
    }
    
    // Second pass: fix the x positions so they line up exactly
    let fixX = x;
    for (let rect of rowRects) {
      rect.x = fixX;
      fixX += rect.w;
      rectangles.push(rect);
    }
    
    return rowHeight;
  }
    
  
  adjustTreemapToFit(rectangles, x, y, targetWidth, targetHeight) {
    // Compute the current bounding box of all rectangles
    let maxX = 0, maxY = 0;
    for (let rect of rectangles) {
      maxX = Math.max(maxX, rect.x + rect.w);
      maxY = Math.max(maxY, rect.y + rect.h);
    }
    let currentWidth = maxX - x;
    let currentHeight = maxY - y;
    let scaleX = targetWidth / currentWidth;
    let scaleY = targetHeight / currentHeight;
    
    // Choose a uniform scale factor (e.g., the smaller one)
    let scaleFactor = Math.min(scaleX, scaleY);
    
    for (let rect of rectangles) {
      rect.x = x + (rect.x - x) * scaleFactor;
      rect.y = y + (rect.y - y) * scaleFactor;
      rect.w *= scaleFactor;
      rect.h *= scaleFactor;
    }

    console.log(`The max is this woiwowowowow ${maxX}`)
  }
  
    

  // groupSmallItems(data, thresholdFraction = 0.01) {
  //     // 1) Calculate total population
  //     let totalPop = data.reduce((sum, d) => sum + d.population, 0);
    
  //     // 2) Determine threshold
  //     let threshold = totalPop * thresholdFraction; // e.g., 1% of total
    
  //     // 3) Separate big vs. small items
  //     let mainItems = [];
  //     let smallItemsSum = 0;
    
  //     for (let item of data) {
  //       if (item.population < threshold) {
  //         // add to the 'Other' bucket
  //         smallItemsSum += item.population;
  //       } else {
  //         // keep it as is
  //         mainItems.push(item);
  //       }
  //     }
    
  //     // 4) If we have small items, create a single "Other" item
  //     if (smallItemsSum > 0) {
  //       mainItems.push({
  //         country: "Other",
  //         population: smallItemsSum
  //       });
  //     }
    
  //     // 5) Return the new array
  //     return mainItems;
  //   }
    
  
  // Helper function: calculates the "worst" aspect ratio of the row
  worstAspectRatio(row, rowSum, shortSide, scale) {
    let rowArea = rowSum * scale;
    let minPop = Infinity, maxPop = -Infinity;
    for (let item of row) {
      if (item.population < minPop) minPop = item.population;
      if (item.population > maxPop) maxPop = item.population;
    }
  
    let s = shortSide;
    let r1 = (s * s * maxPop) / rowArea;
    let r2 = (s * s * minPop) / rowArea;
    return Math.max(r1, r2);
  }



      
    // sliceAndDiceTreemap(data, x, y, w, h, rectangles) {
    //     // Base case: if no data left, just return
    //     if (data.length === 0) return;
      
    //     // If there's only 1 item, fill the entire region
    //     if (data.length === 1) {
    //       rectangles.push({
    //         x, y, w, h,
    //         country: data[0].country,
    //         population: data[0].population
    //       });
    //       return;
    //     }
      
    //     // Calculate the total area (in pixels) of this treemap region
    //     // and total population of the data slice
    //     let totalPop = data.reduce((sum, d) => sum + d.population, 0);
    //     let totalArea = w * h;
    //     // Each "1 population unit" corresponds to this many pixels
    //     let scale = totalArea / totalPop;
      
    //     // We'll build rows from top to bottom
    //     let currentRow = [];
    //     let currentRowSum = 0;
      
    //     let remaining = data.slice(); // Copy so we can pop from it
      
    //     // Start placing rows
    //     let currentY = y;
    //     let remainingHeight = h;
      
    //     while (remaining.length > 0) {
    //       // Start a new row with the first item
    //       currentRow = [remaining.shift()];
    //       currentRowSum = currentRow[0].population;
      
    //       // Keep adding items to the row while it doesn't get "too skinny"
    //       let done = false;
    //       while (!done && remaining.length > 0) {
    //         // Check if adding the next item would make the row aspect ratio worse
    //         let nextItem = remaining[0];
    //         let testRow = currentRow.concat([nextItem]);
    //         let testSum = currentRowSum + nextItem.population;
      
    //         // If the aspect ratio gets worse, stop. Otherwise, add the item to the row.
    //         if (this.worseAspectRatio(currentRow, currentRowSum, testRow, testSum, w, scale)) {
    //           done = true; 
    //         } else {
    //           // Accept the next item
    //           currentRow.push(nextItem);
    //           currentRowSum = testSum;
    //           remaining.shift();
    //         }
    //       }
      
    //       // Now we have our row. Compute the row height:
    //       // rowArea = (currentRowSum * scale) in pixels
    //       // rowHeight = rowArea / total width
    //       let rowArea = currentRowSum * scale;
    //       let rowHeight = rowArea / w;
      
    //       // Place each item in this row
    //       let currentX = x;
    //       for (let item of currentRow) {
    //         let itemArea = item.population * scale;
    //         let itemWidth = itemArea / rowHeight; // width = area / height
      
    //         rectangles.push({
    //           x: currentX,
    //           y: currentY,
    //           w: itemWidth,
    //           h: rowHeight,
    //           country: item.country,
    //           population: item.population
    //         });
      
    //         currentX += itemWidth;
    //       }
      
    //       // Move down for the next row
    //       currentY += rowHeight;
    //       remainingHeight -= rowHeight;
      
    //       // If there's no space left, stop
    //       if (remainingHeight <= 0) break;
    //     }
    // }
      
    // A simple "aspect ratio check" for the row-based approach
    // The logic: if the row with the new item is more "squashed" than the old row, we say it's "worse" 

    
    // Find the maximum item width if each item has area = (pop * scale) and rowHeight = ...
    findMaxWidth(row, rowHeight, scale, totalWidth) {
      let maxW = 0;
      for (let item of row) {
        let itemArea = item.population * scale;
        let itemWidth = itemArea / rowHeight;
        if (itemWidth > maxW) maxW = itemWidth;
      }
      return maxW;
    }
      
    

    drawTreemap(rectangles) {
      for (let r of rectangles) {
        fill(random(100, 255), random(100, 255), random(100, 255));
        stroke(0);
        rect(r.x, r.y, r.w, r.h);
    
        fill(0);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(
          r.country + "\n" + formatPopulation(r.population),
          r.x + r.w / 2,
          r.y + r.h / 2
        );
      }
    }
}
