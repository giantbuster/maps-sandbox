//page.js
//Creates all needed JavaScript objects

//initialize the map
var searchMap;
google.maps.event.addDomListener(window, 'load', initializeSearchMap);
var miniMap;
google.maps.event.addDomListener(window, 'load', initializeMiniMap);

//initialize the street view grabber
var streetVG;
initializeStreetViewGrabber();

//initialize the image handler
// var imageHandler = new imageHandler('streetview-images');

//Initialize StreetViewGallery with needed image options, API key, and div ID
function initializeStreetViewGrabber(){
    var imgOptions = {
        width: 640,
        height: 640,
        fov: 90,
        pitch: 25,
        key: 'AIzaSyDlPz-ZPQjYceZvOJInQzWbIHB2EkRWDJY'
    }
    streetVG = new StreetViewGrabber(imgOptions, 'streetview-images');
}

// var sanFrancisco = new google.maps.LatLng(37.774950000000004, -122.41929);
//Initializes Google Maps and Directions
function initializeSearchMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var manhattan = new google.maps.LatLng(40.756319,-73.98468);
    var mapOptions = {
        zoom: 11,
        center: manhattan,
        streetViewControl: false
    }
    searchMap = new google.maps.Map(document.getElementById("search-map"), mapOptions);
    directionsDisplay.setMap(searchMap);
}

function initializeMiniMap() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var manhattan = new google.maps.LatLng(40.756319,-73.98468);
    var mapOptions = {
        zoom: 11,
        center: manhattan,
        streetViewControl: false,
        mapTypeControl: false
    }
    miniMap = new google.maps.Map(document.getElementById("minimap"), mapOptions);
    directionsDisplay.setMap(miniMap);
}

function handleRouteSearch(){
    streetVG.findRoute(document.getElementById('start').value, document.getElementById('end').value);
}

function handleStreetViewSearch(){
    streetVG.findStreetViews();
    togglePanel();
    $(window).scrollTop(0);

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