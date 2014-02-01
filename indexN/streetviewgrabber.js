//streetviewgrabber.js

//Class: StreetViewGrabber
//========================
//Finds a route, and then finds all street view images along the route.
//If route is found, it will create an array of objects, containing
//the latLng and appropriate heading.

function StreetViewGrabber(imgOptions){
    //imgOptions are the image options for generating image URLs.
    //Requires width, height, fov, pitch, and key
    this.imgOptions = imgOptions;

    var RADIUS = 10;
    var LIMIT = 5;
    var directionsService = new google.maps.DirectionsService();
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var webService = new google.maps.StreetViewService();
    var svpArray = [];
    var path;

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
        directionsDisplay.setMap(null);
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);
                directionsDisplay.setMap(searchMap);
                directionsDisplay.setDirections(response);
                path = response.routes[0].overview_path;
                $("#searching-route").html("<span>Route found</span>");
                $("#street-view-button").prop('disabled', false);
            } else {
                $("#searching-route").html("<span>No route found</span>");
                $("#street-view-button").prop('disabled', true);
            }
        });
    }

    this.findStreetViews = function(){
        resetStreetViews();
        $("#searching-route").css('visibility', 'hidden');
        $("#loading-images").css('visibility', 'visible');
        findStreetViews(path);
    }

    //resetStreetViews()
    //==================
    //On form submit, resets images and variables
    //TODO: Needs to be rewritten after code is more modularized.
    function resetStreetViews(){
        for (var i = 0; i < svpArray.length; i++) {
            svpArray[i].marker.setMap(null);
        }
        svpArray = [];
    }

    //findStreetViews()
    //=================
    //Given an array of points, goes through them and finds panoramic images
    function findStreetViews(pointsArray){
        var paLength = pointsArray.length;
        var currentIteration = 0;
        var panoArray = [];
        for (var i = 0; i < (paLength > LIMIT ? LIMIT : paLength); i++){
            findPanorama(pointsArray[i], i, paLength, panoArray, currentIteration);
        }
        
        //findPanorama()
        //==============
        //Find a single panoramic image at a point, and puts it into the specified index.
        //If no result is found, it puts null into the array.
        function findPanorama(point, index, paLength, panoArray){
            webService.getPanoramaByLocation(point, RADIUS, function(result, status){
                console.log('index', index);
                currentIteration++;
                panoArray[index] = result;
                if (currentIteration == (paLength > LIMIT ? LIMIT : paLength)){
                    parsePanoramaArray(panoArray);
                }
            });
        }
    }

    //parsePanoramaArray()
    //====================
    //Given an array of Panorama points, remove any null or repeated 
    //elements, and then creates an array of StreetViewPoints
    function parsePanoramaArray(pArray){
        trimNull(pArray);
        removeRepeats(pArray);
        createStreetViewPoints(pArray);
        
        //global function
        updatePage(svpArray);
    }

    function createStreetViewPoints(pArray){
        var heading = 0;
        for (var i = 0; i<pArray.length; i++){
            var latLng = pArray[i].location.latLng;
            //If we're not on the last element, calculate new heading
            if (pArray[i+1] != undefined) heading = getHeading(pArray[i], pArray[i+1]);
            var svp = new StreetViewPoint(latLng, heading, imgOptions);
            svpArray[i] = svp;
        }
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


    //========================================
    //----------------------------------------
    //Public functions for controlling image gallery
    //----------------------------------------
    //========================================

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
        svpArray[index].marker.setMap(null);
    }

    //displayMarker()
    //===========
    //Displays marker of specified index into specified map
    this.displayMarker = function(index, map){
        svpArray[index].marker.setMap(map);
    }
};