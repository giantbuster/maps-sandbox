//page.js
//Creates all needed JavaScript objects

//initialize the map
var googleMap;
google.maps.event.addDomListener(window, 'load', initializeMap);

//initialize streetViewGallery
var streetVG;
initializeStreetViewGrabber();

//Initialize StreetViewGallery with needed image options, API key, and div ID
function initializeStreetViewGrabber(){
    var imgOptions = {
        width: 640,
        height: 640,
        fov: 90,
        pitch: 25,
        key: 'AIzaSyDlPz-ZPQjYceZvOJInQzWbIHB2EkRWDJY'
    }
    streetVG = new StreetViewGrabber('streetview-images', imgOptions);
}

//Initializes Google Maps and Directions
function initializeMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    // var sanFrancisco = new google.maps.LatLng(37.774950000000004, -122.41929);
    var manhattan = new google.maps.LatLng(40.756319,-73.98468);
    var mapOptions = {
        zoom: 11,
        center: manhattan,
        streetViewControl: false
    }
    googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(googleMap);
}

function calcRoute(){
    streetVG.findRoute(document.getElementById('start').value, 
                       document.getElementById('end').value);
}

function handleSubmit(){
    calcRoute();
    //if (calcRoute()) enable all the jquery stuff, update page, start reading input, etc
    // updatePage();
}

// function updatePage(){
//     showImages();
//     showMarkers();
//     showProgressBar();
// }