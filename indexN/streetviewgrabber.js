//streetviewgrabber.js

//Class: StreetViewGrabber
//========================
//Finds a route, and then finds all street view images along the route.
//If route is found, it will create an array of objects, containing
//the latLng and appropriate heading.

function StreetViewGrabber(imgOptions, divID){
    //imgOptions are the image options for generating image URLs.
    //Requires width, height, fov, pitch, and key
    this.imgOptions = imgOptions;
    this.divID = divID;

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
        setSearchingRouteVisibility(true);
        setSearchingRouteMsg('Finding route...');
        setTimeout(function(){
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    console.log(response);
                    directionsDisplay.setMap(searchMap);
                    directionsDisplay.setDirections(response);
                    path = response.routes[0].overview_path;
                    setSearchingRouteMsg('Route found');
                    setSVButtonDisabled(false);
                } else {
                    setSearchingRouteMsg('No route found');
                    setSVButtonDisabled(true);
                }
            });
        }, 250);
    }

    this.findStreetViews = function(){
        //front-end
        setSearchingRouteVisibility(false);
        setLoadingScreenVisibility(true);
        setSVButtonDisabled(true);

        //back-end
        resetStreetViews();
        findStreetViews(path);
    }

    //resetStreetViews()
    //==================
    //On form submit, resets images and variables
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
        svpArray = createStreetViewPoints(pArray);
        
        setPageHeight(svpArray.length);
        displayImages(svpArray);
    }

    function createStreetViewPoints(pArray){
        var tmpArray = [];
        var heading = 0;
        for (var i = 0; i<pArray.length; i++){
            var latLng = pArray[i].location.latLng;
            //If we're not on the last element, calculate new heading
            if (pArray[i+1] != undefined) heading = getHeading(pArray[i], pArray[i+1]);
            var svp = new StreetViewPoint(latLng, heading, imgOptions);
            tmpArray[i] = svp;
        }
        return tmpArray;
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

    function displayImages(svpArray){
        clearImages();
        var imgArray = buildImgTags(svpArray);
        loadImages(imgArray);
    }

    function clearImages(){
        document.getElementById(divID).innerHTML = "";
    }

    function buildImgTags(svpArray){
        var imgArray = [];
        for (var i = 0; i<svpArray.length; i++){
            var img = '<img class="streetview" src="'+svpArray[i].src+'"/>';
            imgArray[i] = img;
        }
        return imgArray;
    }

    function loadImages(imgArray){
        setImagesVisibility(false);
        
        //put the img tags onto the page
        for (var i = 0; i < imgArray.length; i++){
            document.getElementById(divID).innerHTML += imgArray[i];
        }
        document.getElementById(divID).firstChild.className += " current-image"

        var imgs = $("#"+divID+" > img").not(function() { return this.complete; });
        var count = imgs.length;

        //Check if any images need to be loaded
        if (count) {
            //Wait for them to load
            console.log('Loading...');
            imgs.load(function() {
                count--;
                if (!count) {
                    console.log('Done loading!');
                    setLoadingScreenVisibility(false);
                    setImagesVisibility(true);
                }
            });
        //If count is 0 to begin with, all images were already done loading
        } else {
            console.log('No loading needed');
            setImagesVisibility(true)
        }
    }

    function setPageHeight(numImages){
        pageHeight = window.innerHeight + (numImages * sensitivity) - 1;
        document.getElementById('container').style.height = pageHeight+"px";
    }

    function setSearchingRouteVisibility(bool){
        $("#searching-route").css('visibility', bool ? 'visible' : 'hidden');
    }

    function setSearchingRouteMsg(msg){
        $("#searching-route").html('<span>'+msg+'</span>');
    }

    function setLoadingScreenVisibility(bool){
        $("#loading-images").css('visibility', bool ? 'visible' : 'hidden');
    }

    function setImagesVisibility(bool){
        $("#"+divID).css('visibility', bool ? 'visible' : 'hidden');
    }

    function setSVButtonDisabled(bool){
        $("#street-view-button").prop('disabled', bool);
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
        svpArray[index].marker.setMap(null);
    }

    //displayMarker()
    //===========
    //Displays marker of specified index into specified map
    this.displayMarker = function(index, map){
        svpArray[index].marker.setMap(map);
    }
};