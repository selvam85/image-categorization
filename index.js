import '@tensorflow/tfjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";

const chooseFiles = document.getElementById("chooseFiles");
const tableBody = document.getElementById("tableBody");
const filterCriteria = document.getElementById("filterCriteria");
const filterImages = document.getElementById("filterImages");

const imagesPerRow = 5;

var model;
cocoSsd.load().then(cocoSsdModel => {
  model = cocoSsdModel;
});

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
        image.className = "imgToFilter";
        image.style.width = "100%";
        image.style.height = "auto";
        cell = row.insertCell(columnIndex);
        cell.appendChild(image);

        image.src = URL.createObjectURL(file);
    });

    filterImages.disabled = false;
}

filterImages.onclick = async () => {
    const filterConditionArr = filterCriteria.value.split(",").map(item => item.trim());
    console.log("Filter Condition: ", filterConditionArr);

    let imgElements = document.getElementsByClassName("imgToFilter");

    if(model) {
        const promises = Array.prototype.map.call(imgElements, async img => {
            const predictions = await model.detect(img);
            return predictions;
        });
    
        const predictionsArr = await Promise.all(promises);
        console.log("Predictions Array: ", predictionsArr);
        
        predictionsArr.forEach(function(predictions, index) {
            let matched = false;
            for(let prediction of predictions) {
                if(filterConditionArr.includes(prediction.class)) {
                    matched = true;
                    break;
                }
            }

            if(matched) {
                console.log("img_" + index + " matched");
                document.getElementById("img_" + index).classList.add("saturate");
                document.getElementById("img_" + index).classList.remove("dim");
            } else {
                console.log("img_" + index + " did not match");
                document.getElementById("img_" + index).classList.add("dim");
                document.getElementById("img_" + index).classList.remove("saturate");
            }
        });
    } else {
        console.log("Model is not loaded yet");
    }
}

//Clear all the rows in the table each time when the user selects a new set of files
function clearAllRows() {
    const previewTable = document.getElementById("previewTable");
    while(previewTable.rows.length > 0) {
        previewTable.deleteRow(0);
    }
}
