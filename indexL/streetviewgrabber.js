//streetviewgrabber.js

//Class: StreetViewGrabber
//========================
//Finds a route, and then finds all street view images along the route.
//If route is found, it will create an array of objects, containing
//the latLng and appropriate heading.

function StreetViewGrabber(divID, imgOptions){
    //divID is where HTML elements will get displayed
    this.divID = divID;

    //imgOptions are the image options for generating the URL.
    //Requires width, height, fov, pitch, and key
    //TODO: Move to HTML helper
    this.imgOptions = imgOptions;

    //Used in webService when searching for panoramic images.
    var RADIUS = 10;
    
    //Used to limit API calls.
    //Will be left on 100 once equidistant route segmenting is implemented.
    var LIMIT = 5;

    //Searches for directions between two points
    var directionsService = new google.maps.DirectionsService();

    //Displays the route between two points
    var directionsDisplay = new google.maps.DirectionsRenderer();

    //Used for finding a panorama near a given point
    var webService = new google.maps.StreetViewService();
    
    //Array of StreetViewPoints, which contain a streetview's
    //URL and marker
    var svpArray = [];

    //findRoute(origin, destination)
    //==============================
    //Public function. Finds directions from pointA to pointB using Google Maps API,
    //pulls up street view images between pointA and pointB, generates HTML, and
    //displays it.
    this.findRoute = function(origin, destination) {
        var start = origin;
        var end = destination;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log('Directions response: ');
                console.log(response);
                resetStreetViews();
                directionsDisplay.setMap(googleMap);
                directionsDisplay.setDirections(response);
                findStreetViews(response.routes[0].overview_path);
            }
        });
    }

    //resetStreetViews()
    //==================
    //On form submit, resets images and variables
    //TODO: Needs to be rewritten after code is more modularized.
    function resetStreetViews(){
        document.getElementById(divID).innerHTML = "";
        directionsDisplay.setMap(null);
        svpArray = [];
    }

    //findStreetViews()
    //=================
    //Given an array of points, goes through them and finds panoramic images
    function findStreetViews(pointsArray){
        var currentIteration = 0;
        var panoArray = [];
        for (var i = 0; i < (pointsArray.length > LIMIT ? LIMIT : pointsArray.length); i++){
            findPanorama(pointsArray[i], i, pointsArray.length, panoArray, currentIteration);
        }

        //findPanorama()
        //==============
        //Find a single panoramic image at a point, and puts it into the specified index.
        //If no result is found, it puts null into the array.
        function findPanorama(point, index, pointsArrayLength, panoArray){
            webService.getPanoramaByLocation(point, RADIUS, function(result, status){
                currentIteration++;
                panoArray[index] = result;

                //If we're on the last iteration, parse the entire array
                if (currentIteration == (pointsArrayLength > LIMIT ? LIMIT : pointsArrayLength)){
                    parsePanoramaArray(panoArray);
                }
            });
        }
    }

    //parsePanoramaArray()
    //====================
    //Given an array of Panorama points, remove any null or repeated elements, 
    //and then stores in streetViewArray the panorama's location and calculated heading.
    function parsePanoramaArray(panoArray){
        trimNull(panoArray);
        removeRepeats(panoArray);

        var heading = 0;
        for (var i = 0; i<panoArray.length; i++){
            var latLng = panoArray[i].location.latLng;
            //If we're not on the last element, calculate new heading
            if (panoArray[i+1] != undefined){
                heading = getHeading(panoArray[i], panoArray[i+1]);
            }
            // var marker = createMarker(panoArray[i].location.latLng);
            var svp = new StreetViewPoint(latLng, heading, imgOptions);
            svpArray[i] = svp;
        }

        var htmlArray = testHTML(svpArray);
        testImg(htmlArray);


        // var htmlArray = getAllStreetViewHTML(svpArray);
        // displayHTML(htmlArray);
    }

    function testHTML(array){
        var tmp = [];
        for (var i = 0; i<array.length; i++){
            var img = '<img class="streetview" src="'+array[i].src+'"/>';
            console.log(img);
            tmp[i] = img;
        }
        console.log(tmp);
        return tmp;
    }

    function testImg(array){
        console.log('testImg', array);
        for (var i = 0; i < array.length; i++){
            document.getElementById("test").innerHTML += array[i];
        }
        //Insert CSS class for first streetview
        // document.getElementById("test").firstChild.className += ' current-image';
        // initializePage();
    }

    //trimNull()
    //==========
    //Removes null elements from an array
    function trimNull(array){
        for(var i = 0; i<array.length; i++) {
            if(array[i] == null) {
                array.splice(i--, 1);
            }
        }
        // console.log('Trimmed array: ');
        // console.log(array)
    }

    //removeRepeats()
    //===============
    //Removes repeated points from an array
    function removeRepeats(array){
        for(var i = 0; i<array.length; i++) {
            if(array[i] && array[i+1]){
                if(array[i].location.latLng.toString() == array[i+1].location.latLng.toString()){
                    console.log('Removing a repeated point: ', 
                                array[i].location.latLng.toString(),
                                ' and ',
                                array[i+1].location.latLng.toString());
                    array.splice(i--, 1);
                }
            }
        }
    }

    //getHeading()
    //============
    //Given two Google Map Points, calculates heading from pointA to pointB
    function getHeading(pointA, pointB){
        if (pointA && pointB){
            return google.maps.geometry.spherical.computeHeading(pointA.location.latLng, pointB.location.latLng);
        } else {
            //This should never run
            console.error('Cannot calculate heading for null point', pointA, pointB);
        }
    }

    //getStreetViewArray()
    //====================
    //Public function which returns the street view array.
    //Used in HTML helper once the array is populated with needed information
    //NOT IMPLEMENTED
    this.getStreetViewArray = function(){
        return svpArray;
    }
    //=================================================================
    //-----------------------------------------------------------------
    //Everything in the block below needs to be moved to the HTML helper
    //-----------------------------------------------------------------
    //=================================================================

    //getAllStreetViewHTML()
    //======================
    //Given an array of street view panorama points, creates an array 
    //of HTML with those street view images (div tags with image as background)
    function getAllStreetViewHTML(array){
        var htmlArray = [];
        for (var i = 0; i<array.length; i++){
            var div = divWithBackground(array[i].src);
            htmlArray[i] = div;
        }
        return htmlArray;
    }

    //divWithBackground()
    //===================
    //Given a url source, puts it in a div as the background image
    function divWithBackground(src){
        var div = '<div class="streetview" style="background-image: url(\''+src+'\');"></div>';
        return div;
    }

    //displayHTML()
    //=============
    //Given an array of HTML, adds the HTML into the specified ID
    function displayHTML(array){
        for (var i = 0; i < array.length; i++){
            document.getElementById(divID).innerHTML += array[i];
        }
        //Insert CSS class for first streetview
        document.getElementById(divID).firstChild.className += ' current-image';
        initializePage();
    }

    //Temporary function. 
    //DON'T RELY ON THIS THING
    //It really shouldn't be here. At all. This is changing
    //the page directly. This class shouldn't do that.
    //Plus it's using a few global variables. Ew.
    function initializePage(){
        //GLOBALS pageHeight and sensitivity. Initialized in inputreader.js.
        //gotta fix this... this is terrible style.
        pageHeight = window.innerHeight + (svpArray.length * sensitivity) - 1;
        document.getElementById('container').style.height = pageHeight+"px";
    }

    //========================================
    //----------------------------------------
    //Everything in the block below should be in the HTML helper (or some other class)
    //----------------------------------------
    //========================================

    //createMarker()
    //==============
    //Given a latLng, creates a marker (not on a map)
    function createMarker(latLng){
        var marker = new google.maps.Marker({
            position: latLng,
        });
        return marker;
    }

    //numImages()
    //===========
    //Returns length of streetViewArray; aka num of images displayed
    this.numImages = function(){
        return svpArray.length;
    }

    //removeMarker()
    //==============
    //Removes marker of specified index from map
    this.removeMarker = function(index){
        // console.log(svpArray);
        // console.log(index);
        svpArray[index].marker.setMap(null);
    }

    //displayMarker()
    //===========
    //Displays marker of specified index into specified map
    this.displayMarker = function(index, map){
        // console.log(svpArray);
        // console.log(index);
        svpArray[index].marker.setMap(map);
    }
};