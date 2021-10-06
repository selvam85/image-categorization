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

//Display the preview of all the selected images. 5 images per row in the table.
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
    
    //Get the filter criteria entered by the user and split them by comma
    const filterConditionArr = filterCriteria.value.split(",").map(item => item.trim());
    console.log("Filter Condition: ", filterConditionArr);

    //Get all the image elements that were created to display the selected images
    let imgElements = document.getElementsByClassName("imgToFilter");

    //Check if the COCO-SSD model is loaded
    if(model) {
        //Invoke model.detect on each image using an async function and collect the array of Promises returned
        const promises = Array.prototype.map.call(imgElements, async img => {
            const predictions = await model.detect(img);
            return predictions;
        });
    
        //Get the o/p array of predictions for all images after waiting for all Promises to fulfill.
        const predictionsArr = await Promise.all(promises);
        console.log("Predictions Array: ", predictionsArr);
        
        //Loop through the array of predictions (predictions for all images)
        predictionsArr.forEach(function(predictions, index) {
            let matched = false;
            //Loop through the predictions array for a single image
            for(let prediction of predictions) {
                //If any of the filter criteria matches with a detected object class, set matched to true
                if(filterConditionArr.includes(prediction.class)) {
                    matched = true;
                    break;
                }
            }

            if(matched) {
                //Highlight the image, if there is a match between the filter criteria and the objects present in the image
                console.log("img_" + index + " matched");
                document.getElementById("img_" + index).classList.add("saturate");
                document.getElementById("img_" + index).classList.remove("dim");
            } else {
                //Shade out the images, if the filter criteria didn't match with any of the objects present in the image
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
