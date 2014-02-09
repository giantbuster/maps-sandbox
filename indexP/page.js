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

//scroller.js
//===========
//Reads scroll input and parses it accordingly.
//Changes images, changes markers on google map, updates progress bar.
var scrollable = false;
var sensitivity = 200;
var pageHeight;

// $(document).ready(function() {
    var windowHeight = $(window).height();
    var scrollDistance;
    var scrollPercentage;
    var numImages;
    var displayedImage = 1;
    var currImage = 1;

    $(window).resize(function() {
        //Set page height for number of images grabbed. 
        numImages = streetVG.numImages();
        windowHeight = $(window).height();
        //subtract 1 to make make sure currImage calculation doesn't exceed numImages
        pageHeight = windowHeight + (numImages * sensitivity) - 1;
        $('#container').css("height", pageHeight);
    });

    $(window).scroll(function(){
        if (scrollable){
            scrollDistance = getScrollDistance();
            scrollPercentage = getScrollPercentage();
            moveTracker(scrollPercentage);

            //Find image for current distance
            currImage = getCurrImage();

            //Update current image
            if (currImage != displayedImage){
                updateDisplayedImage(currImage);
                updateMarker(currImage, displayedImage);
                displayedImage = currImage;
            }
        }
    });

    function getScrollDistance(){
        //maybe constrain this scroll distance so that we don't have to do
        //constrain checks in the percentage and currImage
        var dist = $(document).scrollTop();
        if (dist<0){
            dist = 0;
        } else if (dist>pageHeight - windowHeight) {
            dist = pageHeight - windowHeight;
        }
        return dist;
    }

    function getScrollPercentage(){
        var percentage = scrollDistance/(pageHeight - windowHeight) * 100;
        if (percentage>100){
            percentage = 100;
        } else if (percentage<0){
            percentage = 0;
        }
        return percentage;
    }

    function moveTracker(percentage){
        $('.tracker').css('left', percentage+'%');
    }

    function getCurrImage(){
        //currImage and numImages are 1-indexed.
        var currImg = Math.floor(scrollDistance/sensitivity) + 1;
        if (currImg<1) {
            currImg = 1;
        } else if (currImg>numImages){
            currImg = numImages;
        }
        return currImg;
    }

    function updateDisplayedImage(currImg){
        $("#streetview-images > img").removeClass("current-image");
        $("#streetview-images > img:nth-child("+currImg+")" ).addClass("current-image");
    }

    function updateMarker(currImg, displayedImg){
        streetVG.removeMarker(displayedImg-1);
        streetVG.displayMarker(currImg-1, miniMap);
    }
// });