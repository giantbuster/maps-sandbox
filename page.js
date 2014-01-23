var imgOptions = {
    width: 640,
    height: 640,
    fov: 90,
    pitch: 25,
    key: 'AIzaSyDlPz-ZPQjYceZvOJInQzWbIHB2EkRWDJY'
}

var streetView = new StreetViewGallery('streetview-images', imgOptions);

var markerArray = [];
var currImage = 0;

function calcRoute(){
    // console.log(streetView);
    streetView.findRoute(document.getElementById('start').value, document.getElementById('end').value);
}

var googleMap;
//Initializes Google Maps and Directions
function initialize() {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var sanFrancisco = new google.maps.LatLng(37.774950000000004, -122.41929);
    var mapOptions = {
        zoom: 10,
        center: sanFrancisco
    }
    googleMap = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    directionsDisplay.setMap(googleMap);
}

//initialize the map
google.maps.event.addDomListener(window, 'load', initialize);

//Read key input for changing images
$( window ).keyup(function(e) {
    if (e.keyCode == 38 || e.keyCode == 40) {
        var curr = $(".current-image");
        //Move up
        if (e.keyCode==38){
            if ( curr.prev().length ){
                markerArray[currImage--].setMap(null);
                markerArray[currImage].setMap(googleMap);
                // googleMap.setCenter(markerArray[currImage].getPosition());
                curr.removeClass("current-image");
                curr.prev().addClass("current-image");
            } 
        //Move down
        } else if (e.keyCode==40){
            if ( curr.next().length ){
                markerArray[currImage++].setMap(null);
                markerArray[currImage].setMap(googleMap);
                // googleMap.setCenter(markerArray[currImage].getPosition());
                curr.removeClass("current-image");
                curr.next().addClass("current-image");
            } 
        }
    }
});