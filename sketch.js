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
    createCanvas(800, 600);
    angleMode(DEGREES);
    noLoop();
    cleanData();


    // charts.push(new BarChart({
    //     data:cleanedData,
    //     XValue: "Age_Group",
    //     yValue: "Female",
    //     tickNum: 5,
    //     chartHeight: 200,
    //     barWidth: 200,
    //     margin: 10,
    //     axisThickness: 15,
    //     chartPosX: 2,
    //     chartPosY: 450,
    //     orientation: "bar"
    // }
    // ));

    // charts[0].render();


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
        // chart.renderBars();
        chart.render();

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
        cleanedData[i].Female = parseInt(cleanedData[i].Female) || 0;
        cleanedData[i].Male = parseInt(cleanedData[i].Male) || 0;
        cleanedData[i].Total = parseInt(cleanedData[i].Total)   || 0;
    } 
}

function getSelectedValues() {
    // Step 1: Select all checked checkboxes with the name 'YAxis'
    const selectedValues = Array.from( // Array is a built in javascript object that provides methods to work with arrays
        document.querySelectorAll('input[name="YAxis"]:checked') // checking what i wanna put on the Y axis
    )
    // Step 2: Map the NodeList of checkboxes to an array of their 'value' attributes
    // Nodelist is a array like collection of Docutment object model nodes It represents a list of elements (or other node types) in the document, allowing you to access and interact with multiple DOM nodes at once.
    .map(checkbox => checkbox.value);

    // Step 3: Check if no checkboxes were selected
    if (selectedValues.length === 0) {
        console.warn("No datasets selected for Y-Axis. Defaulting to a placeholder value.");
    } else {
        // Step 4: Log the selected values for debugging purposes
        console.log("Selected Y-Axis Values:", selectedValues);
    }

    // Step 5: Return the array of selected values
    return selectedValues;
}

let chartOrientation = "vertical"; // Initial orientation

// This function will toggle the orientation when the checkbox is clicked
// function toggleOrientation() {
//     // Check if the checkbox for horizontal orientation is checked
//     const isHorizontal = document.getElementById("toggleOrientation").checked;

//     // Set the chart orientation based on checkbox state
//     chartOrientation = isHorizontal ? "horizontal" : "vertical"; 
//     console.log("Orientation toggled to:", chartOrientation); // For debugging
// }

// // Attach event listener once when the page loads (only adds once)
// const toggleButton = document.getElementById("toggleOrientation");
// toggleButton.addEventListener("change", toggleOrientation);  // Change to 'change' event for checkbox state


function generateChart() {
    const yAxisData = getSelectedValues(); // What data is selected
    const barWidth = parseInt(document.getElementById("barWidth").value);
    const margin = parseInt(document.getElementById("margin").value);
    const chartHeight = parseInt(document.getElementById("chartHeight").value);
    const axisThickness = parseInt(document.getElementById("axisThickness").value);
    const tickNum = parseInt(document.getElementById("tickNum").value);
    const XPos = parseInt(document.getElementById("XPos").value);
    const YPos = parseInt(document.getElementById("YPos").value);
    const isChecked = document.getElementById("toggleOrientation").checked;

    // Validation for stacked charts
    if (Array.isArray(yAxisData) && yAxisData.length === 1 && chartOrientation === 'stacked') {
        alert("Error: A stacked bar chart requires at least two datasets.");
        console.log("Error: A stacked bar chart requires at least two datasets.");
        return;
    }

    // Clear the canvas before rendering a new chart
    clear(); 
    charts = []; // Reset the chart array to avoid overlaying old charts

    // Create a new chart instance with the updated orientation
    const newChart = new Chart({
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
        orientation: chartOrientation, // Use the updated orientation here
        isChecked: isChecked
    });

    charts.push(newChart); // Add the new chart to the array
    redraw(); // Re-render the chart with the updated orientation
}
