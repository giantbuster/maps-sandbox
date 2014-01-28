//htmlhelper.js

// BEGIN CLASS DEFINITION
//======================
// Class: HTMLHelper
//=================
// Generates and displays HTML for a street view array
// ----------
// REQUIRED PARAMETERS
//      divID: String of HTML id where the images will be displayed
//      imgOptions: Object with options for streetview images.
//          Object properties:
//              width: (16 - 640)
//              height: (16 - 640)
//              fov: (10 - 120)
//              pitch: (-90 - 90) 
//                     Google API will take any number but anything outside of -90 - 90 is redundant
//              apiKey: (optional but recommended)
// ----------
// USAGE
//      var imgOptions = {
//            width: 640, 
//            height: 640, 
//            fov: 90, 
//            pitch: 25, 
//            apiKey: 'ThisIsNotARealKey-AGw931FsdfMnv538'
//      };
//      var htmlHelper = new HTMLHelper('streetview-images', imgOptions);
//      htmlHelper.displayHTML(streetViewArray);
// ----------

//NOT IMPLEMENTED
function HTMLHelper(divID, imgOptions){
    this.divID = divID;
    this.imgOptions = imgOptions;

    //generateDivWithImage()
    //======================
    //Generates a div with background image of a single streetView point
    function generateDivWithImage(point){
        var div = document.createElement("div");
        var src = buildImageSrc(point);
        div.style.backgroundImage="url("+src+")";
        return div;
    }

    //buildImageSrc()
    //===============
    //Generates the source URL for a single streetView point
    function buildImageSrc(point){
        var src = "http://maps.googleapis.com/maps/api/streetview?location="+
                    point.location.latLng.toUrlValue()+
                    "&heading="+
                    point.heading+
                    "&size="+
                    imgOptions.width+"x"+imgOptions.height+
                    "&fov="+
                    imgOptions.fov+
                    "&pitch="+
                    imgOptions.pitch+
                    "&sensor=false"+
                    imgOptions.hasOwnProperty(apiKey) ? "&key="+imgOptions.apiKey : "";
        return src;
    }

    //resetHTML()
    //===========
    //Clears the div of all images
    function resetHTML(){
        document.getElementById(divID).innerHTML = '';
    }

    //buildHTML()
    //=================
    //Given an array of streetViews, builds HTML and stores it in an array
    function buildHTML(streetViewArray){
        var htmlArray = [];
        for (var i = 0; i<streetViewArray.length; i++){
            htmlArray[i] = generateDivWithImage(streetViewArray[i], imgOptions);
        }
        return htmlArray;
    }

    //displayHTML()
    //=============
    //Given an array of streetViews, builds and displays all the street view images
    this.displayHTML = function(streetViewArray){
        if (streetViewArray.length==0){
            console.error('Array of streetViews is empty');
            return;
        } 
        resetHTML();
        var htmlArray = buildHTML(streetViewArray);
        for (var i = 0; i < htmlArray.length; i++){
            document.getElementById(divID).innerHTML += htmlArray[i];
        }

        //Insert CSS class for first streetview
        //BUG: By having this outside of the loop, this may be causing an issue
        //where while it's going through the loop, the first image is not displayed
        //on top.
        document.getElementById(divID).firstChild.className += 'current-image';
    }
}
//END CLASS DEFINITION
//=====================


//Given an array of HTML, adds the HTML into the specified ID
function displayHTML(array){
    for (var i = 0; i < array.length; i++){
        document.getElementById(divID).innerHTML += array[i];
    }
    //Insert CSS class for first streetview
    document.getElementById(divID).firstChild.className += 'current-image';
}

//Given an array of street view panorama points, creates an array 
//of HTML with those street view images (div tags with image as background)
function getAllStreetViewHTML(array){
    var htmlArray = [];
    for (var i = 0; i<array.length; i++){
        htmlArray[i] = generateStreetViewHTML(array[i]);
    }
    return htmlArray;
}

//Takes a single Google Maps Point and generates
//a div with the streetview image as its background.
function generateStreetViewHTML(point){
    var src = streetViewSrc(point);
    var html = divWithBackground(src);
    return html;
}

//Take a Google Maps Point for a street view image and 
//generates a URL for it, using location, heading, size, fov, pitch, and key. 
function streetViewSrc(point){
    var src = "http://maps.googleapis.com/maps/api/streetview?location="+
                point.location.latLng.toUrlValue()+
                "&heading="+
                point.heading+
                "&size="+
                imgOptions.width+"x"+imgOptions.height+
                "&fov="+
                imgOptions.fov+
                "&pitch="+
                imgOptions.pitch+
                "&sensor=false&key="+
                imgOptions.key;
    return src;
}

//Given a url source, puts it in a div as the background image
function divWithBackground(src){
    var div = '<div style="background-image: url(\''+src+'\');"></div>';
    return div;
}