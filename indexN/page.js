//page.js
//Creates all needed JavaScript objects

//initialize the map
var searchMap;
google.maps.event.addDomListener(window, 'load', initializeMap);

//initialize the street view grabber
var streetVG;
initializeStreetViewGrabber();

//initialize the image handler
var imageHandler = new imageHandler('streetview-images');

//Initialize StreetViewGallery with needed image options, API key, and div ID
function initializeStreetViewGrabber(){
    var imgOptions = {
        width: 640,
        height: 640,
        fov: 90,
        pitch: 25,
        key: 'AIzaSyDlPz-ZPQjYceZvOJInQzWbIHB2EkRWDJY'
    }
    streetVG = new StreetViewGrabber(imgOptions);
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
    searchMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(searchMap);
}

function handleRouteSearch(){
    $("#searching-route").css('visibility', 'visible');
    $("#searching-route").html('<span>Finding route...</span>');

    setTimeout(function(){
        streetVG.findRoute(document.getElementById('start').value, document.getElementById('end').value);
        }, 250);
}

function handleStreetViewSearch(){
    streetVG.findStreetViews();
}

function retrieveSVPArray(){
    console.log('Retrieving SVP Array...');
    
    var tmp = streetVG.returnArray();
    console.log('tmp', tmp);

    for (var i = 0; i<tmp.length;i++){
        console.log(tmp[i].src);
    }
}

function updatePage(svpArray){
    setPageHeight(svpArray.length);
    imageHandler.displayImages(svpArray);
}

function setPageHeight(numImages){
    pageHeight = window.innerHeight + (numImages * sensitivity) - 1;
    document.getElementById('container').style.height = pageHeight+"px";
}

$(document).ready(function() {
    $('.tab').on('click', function() {
        togglePanel();
    });
});

function togglePanel(){
    $('.panel-with-tab').animate({
        "right": parseInt($('.panel-with-tab').css('right'))==0 ? "-=270px" : "+=270px"
        }, 
        300
    );
}