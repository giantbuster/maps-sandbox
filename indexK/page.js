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
    var sanFrancisco = new google.maps.LatLng(37.774950000000004, -122.41929);
    var mapOptions = {
        zoom: 10,
        center: sanFrancisco
    }
    googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(googleMap);
}

//Read key input for changing images
$( window ).keyup(function(e) {
    if (e.keyCode == 38 || e.keyCode == 40) {
        var curr = $(".current-image");
        //Move up
        if (e.keyCode==38){
            if ( curr.prev().length ){
                streetVG.removeMarker(streetVG.currIndex());
                streetVG.decIndex();
                streetVG.setMarker(streetVG.currIndex(), googleMap);
                curr.removeClass("current-image");
                curr.prev().addClass("current-image");
            } 
        //Move down
        } else if (e.keyCode==40){
            if ( curr.next().length ){
                streetVG.removeMarker(streetVG.currIndex());
                streetVG.incIndex();
                streetVG.setMarker(streetVG.currIndex(), googleMap);
                curr.removeClass("current-image");
                curr.next().addClass("current-image");
            } 
        }
    }
});

function calcRoute(){
    streetVG.findRoute(document.getElementById('start').value, document.getElementById('end').value);
}