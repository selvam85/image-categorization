import '@tensorflow/tfjs';
import * as mobilenet from "@tensorflow-models/mobilenet";

const chooseFiles = document.getElementById("chooseFiles");
const columnHeaders = document.getElementById("columnHeaders");
const tableBody = document.getElementById("tableBody");
const classifyImagesButton = document.getElementById("classifyImages");
const imagesPerRow = 3;

var model;
mobilenet.load().then(mobileNetModel => {
    model = mobileNetModel;
});

function main() {
    let header;
    let row = columnHeaders.insertRow();
    
    for(let i = 0; i < imagesPerRow; i++) {
        header = row.insertCell();
        header.style.width = (100 / imagesPerRow) + "%";
    }
}

chooseFiles.onchange = () => {
    clearAllRows();
    displayImages();
}

function displayImages() {
    
    let row;

    Array.prototype.forEach.call(chooseFiles.files, function(file, index) {
        let cell;    
        let image;
        
        //Create a new row for every column index value "0" as it is the first element in the new row.    
        let columnIndex = index % imagesPerRow;
        if (columnIndex === 0) {
            row = tableBody.insertRow(Math.ceil(index / imagesPerRow));
        }

        image = document.createElement("img");
        image.id = "img_" + index;
        image.style.width = "100%";
        image.style.height = "auto";
        cell = row.insertCell(columnIndex);
        cell.appendChild(image);

        image.src = URL.createObjectURL(file);
    });

    classifyImagesButton.disabled = false;
}

//Clear all the rows in the table each time when the user selects a new set of files
function clearAllRows() {
    const previewTable = document.getElementById("previewTable");
    while(previewTable.rows.length > 0) {
        previewTable.deleteRow(0);
    }
}

classifyImagesButton.onclick = () => {
    let imgToClassify = document.getElementById("img_0");
    if(model) {
        model.classify(imgToClassify).then(predictions => {
            console.log("Predictions: ");
            console.log(predictions);
        });
    } else {
        console.log("Model is not loaded yet");
    }
}

main();