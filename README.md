# Image categorization using Object Detection in TensorFlow.js

This is a simple use case for Object Detection using TensorFlow.js. It uses the TensorFlow.js pre-trained COCO-SSD model for detecting objects in a set of images and categorizing them based on user input. 

This app let's the user to 
- Browse & select a set of images that are then displayed on the screen. The images are within the browser and not uploaded to any server. 
- Enter a filter criteria - a list of words describing the objects based on which the images need to be filtered / categorized
- These filter criteria are matched against the predicted object's class
- The images that match the filter criteria are highlighted

Learn more details about this project in this [blog post](https://handsondeeplearning.com/object-detection-using-tensorflow-js/). 

## Run the project 
This project uses Parcel build tool to bundle the package. Use the below command to run the code, which would open up a browser and display the index.html page.

It is tested with the latest version of node (v16.9.1) as of 9/21/2021 

```
npm run dev
```

## Project Contents

This project consists of the following three files. 

### index.html

The UI of this app. It loads the custom JS file (script.js) belonging to this app.

```HTML
<script src="./script.js" defer></script>
```

### style.css

Stylesheet required for the elements on the web page.

```HTML
<link rel="stylesheet" href="./style.css">
```

### script.js

Javascript file that provides functionality to this app. This file loads the TensorFlow.js and COCO-SSD models as below.

```
import '@tensorflow/tfjs';
import * as cocoSsd from "@tensorflow-models/coco-ssd";

var model;
cocoSsd.load().then(cocoSsdModel => {
  model = cocoSsdModel;
});
```
