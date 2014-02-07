//page.js
//Creates all needed JavaScript objects and reads button submissions

//initialize the map
var searchMap;
google.maps.event.addDomListener(window, 'load', initializeSearchMap);
var miniMap;
google.maps.event.addDomListener(window, 'load', initializeMiniMap);


var rendererOptions = {
    draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();

//initialize the street view grabber
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
    streetVG = new StreetViewGrabber(imgOptions, 'streetview-images');
}

// var sanFrancisco = new google.maps.LatLng(37.774950000000004, -122.41929);
//Initializes Google Maps and Directions
function initializeSearchMap() {

    var manhattan = new google.maps.LatLng(40.756319,-73.98468);
    var mapOptions = {
        zoom: 11,
        center: manhattan,
    }
    searchMap = new google.maps.Map(document.getElementById("search-map"), mapOptions);
    directionsDisplay.setMap(searchMap);

    google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
        streetVG.changeRoute(directionsDisplay.getDirections());
    });
}

function initializeMiniMap() {
    // var directionsDisplay = new google.maps.DirectionsRenderer();
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
    toggleMinimap();
    toggleMinimapHider();
    toggleProgressbar();
    // toggleScrollable();
    // $(window).scrollTop(0);
}

$(document).ready(function() {
    $('.tab').on('click', function() {
        togglePanel();
        toggleMinimap();
        toggleMinimapHider();
        toggleProgressbar();
        toggleScrollable();
    });

    $('#minimap-hider').on('click', function() {
        $('.minimap-container').animate({
            "right": parseInt($('.minimap-container').css('right'))== -271 ? "+=271px" : "-=271px"
            }, 
            300
        );
    });

    $('#about-btn').on('click', function() {
        toggleAbout();
        toggleApp();
        // toggleImgs();
    });
    $('#get-started').on('click', function() {
        toggleAbout();
        toggleApp();
        // toggleImgs();
    });
});

function togglePanel(){
    $('.panel-with-tab').animate({
        "left": parseInt($('.panel-with-tab').css('left'))==0 ? "-=570px" : "+=570px"
        }, 
        300
    );
}
function toggleMinimap(){
    if (parseInt($('.minimap-container').css('right')) == -270 ){
        $('.minimap-container').animate({
            "right": "+=270px"
            }, 
            300
        );
    } else if ( parseInt($('.minimap-container').css('right')) == 0 ){
        $('.minimap-container').animate({
            "right": "-=270px"
            }, 
            300
        );
    }
}



function toggleAbout(){
    $('#about-container').animate({
        "top": parseInt($('#about-container').css('top'))==0 ? "-=1080" : "+=1080"
        }, 
        300
    );
}

function toggleApp(){
    $('#app-container').animate({
        "top": parseInt($('#app-container').css('top'))==0 ? "+=1080" : "-=1080"
        }, 
        300
    );
}

function toggleProgressbar(){
    $('#progressbar').animate({
        "bottom": parseInt($('#progressbar').css('bottom'))==0 ? "-=50" : "+=50"
        }, 
        300
    );
}

function toggleScrollable(){
    scrollable = (scrollable == true ? false : true);
}

function toggleMinimapHider(){
    $('#minimap-hider').animate({
        "right": parseInt($('#minimap-hider').css('right'))==0 ? "-=50" : "+=50"
        }, 
        300
    );
}

function toggleImgs(){
    $('#streetview-images').animate({
        "top": parseInt($('#streetview-images').css('top'))==0 ? "+=1080" : "-=1080"
        }, 
        300
    );      
}