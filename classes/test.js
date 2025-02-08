class BarChart {
    constructor(_data, _xValue, _yValue, _chartHeight, _chartWidth, _barWidth, _margin , _axisThickness, _chartPosX, _chartPosY) {
        this.data = _data;
        this.xValue = _xValue;
        this.yValue = _yValue;
        this.chartHeight = _chartHeight;
        this.chartWidth = _chartWidth;
        this.barWidth = _barWidth;
        this.margin = _margin;
        
        this.axisThickness = _axisThickness;
        this.chartPosX = _chartPosX;
        this.chartPosY = _chartPosY;

        this.gap = (this.chartWidth - (this.data.length * this.barWidth) - (this.margin * 2))/(this.data.length - 1);
        this.scaler = this.chartHeight / (max(this.data.map(row => row[this.yValue]))); //When there is [with this.yValue] this is bracket notation it will convert "Female" to .Female

        this.axisColour = color(0, 0, 0);
        this.barColour = color(0, 0, 255);
        this.axisTextColour = color(125);
    }

    render() {
        push();
            translate(this.chartPosX,this.chartPosY);
            noFill()
            stroke(this.axisColour);
            strokeWeight(this.axisThickness);
            line(0,0,0,-this.chartHeight);
            line(0,0,this.chartWidth,0);
            push();
                translate(this.margin,0);
                for(let i =0; i < this.data.length; i++) {
                    let jump = (this.barWidth + this.gap)*i;
                    fill(this.barColour);
                    noStroke();
                    rect(jump,0,this.barWidth,-this.data[i][this.yValue] * this.scaler);
                    
                    fill(this.axisTextColour);
                    noStroke();
                    textAlign(LEFT,CENTER);
                    textSize(10)    
                    push();
                    translate(jump + (this.barWidth/2),10);
                    rotate(90);
                    // text(ageGroups[i],0,0); instead.
                    text(this.data[i][this.xValue] ,0,0);
                    pop();
                }
            pop();
        pop();
    }
}