let table;
let cleanedData = [];

let charts = [];

let femaleScores;
let ageGroups;
let barColour;
function preload() {
    data = loadTable('data/Combined.csv', 'csv' , 'header');
}

// Only runs once.
function setup() {
    createCanvas(500, 500);
    angleMode(DEGREES);
    noLoop();
    cleanData();

    // charts.push(new BarChart(cleanedData,"Age_Group", "Female",5,200,200,10,15,2,50,450));


    // BarChart1 = {
    //     data: cleanedData,
    //     xValue: "Age_Group",
    //     yValue: "Male",
    //     tickNum: 6,
    //     chartHeight: 200,
    //     barWidth: 15,
    //     margin: 15,
    //     axisThickness: 5,
    //     chartPosX: 100,
    //     chartPosY: 250,
    //     orientation: "bar"
    // }

    // charts.push(new BarChart(BarChart1));


    // charts.push(new BarChart(cleanedData,"Age_Group", "Total",7,200,400,15,15,2,50,200));

    // femaleScores = cleanedData.map(row => row.Female)
    // ageGroups = cleanedData.map(row => row.Age_Group)
    // let filteredFemaleScores = femaleScores.filter(age => age > 3);
    // console.log(femaleScores,ageGroups);
    // console.log(filteredFemaleScores);
    // let bothtogether = cleanedData.filter(age => age.Female > 2 ).map(row => row.Female);
    // console.log(bothtogether);

    // gap = (chartWidth - (femaleScores.length * barWidth) - (margin * 2)) / (femaleScores.length - 1);
    // scaler = chartHeight / (max(femaleScores));

    // axisColour = color(0, 0, 0);
    // barColour = color(0, 0, 255);
    // axisTextColour = color(125);
}

// Will run over and over.
function draw() {
    background(252, 245, 243);

    charts.forEach(chart => {
        chart.setColors();
        chart.renderLabels();
        chart.renderTicks();
        chart.renderTickLines();
        chart.renderBars();
        chart.renderAxis();

    }) 
    // If i change the name of "renderBars" i have to change it here


    // push();
    // translate(300,300);
    // rotate(-45)
    // fill(255,0,0);
    // stroke(0,0,0);
    // rect(0,0,100,100); 
    // pop();

    // Push moves where 0,0 is to wherever the translate is going.
    // push();
    // translate(150,150);
    // rotate(30)
    // fill(0,255,0);
    // stroke(0,0,0);
    // rect(0,0,100,100);
    // pop();
    // Pop resets the 0,0 back to where it was orginally

    // let femaleAges = [];
    // [0,0,13,6,3] example output


    // Method 1 Using a loop
    // for(let i = 0; i < cleanedData.length; i++) {
    //     femaleAges.push(cleanedData[i].Female)
    //     console.log(femaleAges)
    // }

    // Method 2 Using a foreach with a normal function 
    // cleanedData.forEach(
    //     function(item) {
    //         femaleAges.push(item.Female);
    //     }
    // )

    // Method 3 using a for each with a arrow function
    // cleanedData.forEach(
    //     item => {femaleAges.push(item.Female)}
    // );

    // Method 4 doing it all at once with declaring the varible at the same time
    // let femaleAges = cleanedData.map(
    //     function(row) {
    //         return row.Female;
    //     }
    // )

    // Method 5 the best way doing it all in 1 line with a arrow function
    // let femaleScores = cleanedData.map(row => row.Female)

    // let ageGroups = cleanedData.map(row => row.Age_Group)

    // Because femaleAges is already an array of numbers u dont need a row.Female of anything like that. 
    // let filteredFemaleScores = femaleScores.filter(age => age > 3);



    // This is using filter and map together. So it can be all done in one line

    // push();
    // translate(chartPosX,chartPosY);
    // stroke(axisColour);
    // strokeWeight(axisThickness);
    // line(0,0,0,-chartHeight);
    // line(0,0,chartWidth,0);
    
    // push();
    // translate(margin,0);
    // for(let i =0; i < femaleScores.length; i++) {
    //     let jump = (barWidth + gap)*i;
    //     fill(barColour);
    //     noStroke();
    //     rect(jump,0,barWidth,-femaleScores[i] * scaler);
        
    //     textAlign(LEFT,CENTER);
    //     textSize(10)    
    //     push();
    //     // If i want a none 90 degree angle i do 
    //     // translate(jump + (barWidth/2),10);
    //     rotate(90);
    //     // text(ageGroups[i],0,0); instead.
    //     text(ageGroups[i] ,10, -(jump + (barWidth/2)));
    //     pop();
    // }
    // pop();
    // pop();
}

// class Friend {
//     constructor() {
//         this.name = "Tom";
//         this.number = 123;
//     }
// }


// class Friend {
//     constructor(_name, _number) {
//         this.name = _name;
//         this.number = _number;
//     }

//     report(){
//         console.log(this.name, this.number);
//         console.log(`Name: ${this.name}, Number: ${this.number}`);
//     }
// }

// let friends = [];
// friends.push(new Friend("Dave", 752))
// friends.push(new Friend("Tom", 123))

// console.log(friends)

function cleanData() {
    for(let i = 0; i < data.rows.length; i++) {
        let cleanerData =(data.rows[i].obj)
        cleanedData.push(cleanerData);
        cleanedData[i].Female = parseInt(cleanedData[i].Female)
        cleanedData[i].Male = parseInt(cleanedData[i].Male)
        cleanedData[i].Total = parseInt(cleanedData[i].Total)
    } 
}

function getSelectedValues() {
    // Get all checked checkboxes for 'YAxis'
    const selectedValues = Array.from(document.querySelectorAll('input[name="YAxis"]:checked')).map(checkbox => checkbox.value); // Get the value of each checked checkbox
    return selectedValues;
}


function generateChart() {
    const yAxisData =  getSelectedValues(); //What data is selected
    const barWidth = parseInt(document.getElementById("barWidth").value);
    const margin = parseInt(document.getElementById("margin").value);
    const chartHeight = parseInt(document.getElementById("chartHeight").value);
    const axisThickness = parseInt(document.getElementById("axisThickness").value);
    const tickNum = parseInt(document.getElementById("tickNum").value);
    const XPos = parseInt(document.getElementById("XPos").value);
    const YPos = parseInt(document.getElementById("YPos").value);
    const chartOrientation = document.getElementById("chartOrientation").value;

    if (Array.isArray(yAxisData) && yAxisData.length === 1 && chartOrientation === 'stacked') {
        alert("Error: A stacked bar chart requires at least two datasets.");
        console.log("Error: A stacked bar chart requires at least two datasets.");
        return; 
    }

    clear();

    charts = []; //If i wasnt more then 1 chart get rid of this line.

    // Checking if theres more then 1 set of data selected and if it is over 1 it will make a Grouped bar chart
    if (Array.isArray(yAxisData) && yAxisData.length > 1 && chartOrientation === "bar") {
        // Grouped bar chart not finished yet
        yAxisData.forEach((dataset, index) => {
            let xOffset = index * (barWidth + margin); // Offset bars so they don't overlap
            
            let newChart = new BarChart({
                data: cleanedData,
                xValue: 'Age_Group',
                yValue: dataset,
                tickNum: tickNum,
                chartHeight: chartHeight,
                barWidth: barWidth,
                margin: margin,
                axisThickness: axisThickness,
                chartPosX: XPos + xOffset,
                chartPosY: YPos,
                orientation: chartOrientation
            });
    
            charts.push(newChart);
        });
    } else {
        // Single dataset 
        const newChart = new BarChart({
            data: cleanedData,
            xValue: 'Age_Group',
            yValue: yAxisData,
            tickNum: tickNum,
            chartHeight: chartHeight,
            barWidth: barWidth,
            margin: margin,
            axisThickness: axisThickness,
            chartPosX: XPos,
            chartPosY: YPos,
            orientation: chartOrientation
        });
    
        charts.push(newChart);
    }
    

    redraw()
}