//initialize the map
var googleMap;
google.maps.event.addDomListener(window, 'load', initializeMap);

//initialize streetViewGallery
var streetVG;
initializeStreetViewGallery();

//Initialize StreetViewGallery with needed image options, API key, and div ID
function initializeStreetViewGallery(){
    var imgOptions = {
        width: 640,
        height: 640,
        fov: 90,
        pitch: 25,
        key: 'AIzaSyDlPz-ZPQjYceZvOJInQzWbIHB2EkRWDJY'
    }
    streetVG = new StreetViewGallery('streetview-images', imgOptions);
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

$( window ).resize(function() {
    console.log('Resize detected');
});

var sensitivity = 200;
var displayedImage = 0;
$(window).scroll(function(){
    //Set page height for number of images grabbed. 
    //TODO: Only do this on a new search, not every time page is scrolled.
    var numImages = streetVG.numImages();
    var height = $(window).height() + (numImages * sensitivity);
    $('#container').css("height", height);

    //Calculate distance from top
    var distance = $(document).scrollTop();
    var containerHeight = $('#container').css("height");

    //Calculate percentage
    var percentage = distance/(height - $(window).height()) * 100;
    if (percentage>100) percentage = 100;
    if (percentage<0) percentage = 0;
    console.log('distance: ', distance);
    console.log('height: ', height);
    console.log('Percentage: ', percentage);

    //Move progressbar
    $('.circle').css('left', percentage+'%');

    //Find image for current distance
    var currImage = Math.floor(distance/sensitivity) + 1;
    if (currImage<1) currImage = 1;
    if (currImage>numImages) currImage=numImages;
    

    //Update current image
    if (currImage != displayedImage){
        $( "#streetview-images > div").removeClass("current-image");
        $( "#streetview-images > div:nth-child("+currImage+")" ).addClass("current-image");
        streetVG.removeMarker(displayedImage-1);
        streetVG.setMarker(currImage-1, googleMap);
        displayedImage = currImage;
    }
});

$(document).ready(function() {
    $('.slider-tab > .tab').on('click', function() {
        $('#panel').slideToggle(300);
    });
});


// $(window).click(function() {
//     console.log('here');
//     var $marginLefty = $("#panel");
//     $marginLefty.animate({
//         marginLeft: parseInt($marginLefty.css('margin-left'),10) == 0 ? $marginLefty.outerWidth() : 0
//     });
// });

function calcRoute(){
    streetVG.findRoute(document.getElementById('start').value, document.getElementById('end').value);
}