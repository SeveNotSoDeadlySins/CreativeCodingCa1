class Chart {
    constructor(obj) {
        this.data = obj.data; //All of the data that is taken from the CSV file
        this.xValue = obj.xValue || "Country";
        this.yValue = obj.yValue || "NEAR EAST"; // What rows that selected for the Yaxis i.e Male, Female for the sample data
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


        // Calculate the scaler to fit the chart height
        this.scaler = this.chartHeight / this.maxValue;



        // const toggleButton = document.getElementById("toggleOrientation");
        // toggleButton.addEventListener("click", this.toggleOrientation.bind(this));

        this.axisColour = color(88, 93, 97);
        this.barColour = color(5, 91, 166);
        this.axisTextColour = "black";
        this.axisTickTextColour = color(0,0,0);
        this.axisTickColor = color(132, 139, 144);
        this.chartTickLinesColor = color(132, 139, 144);
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
