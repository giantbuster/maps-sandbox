//routefinder.js

//Searches for routes between pointA and pointB

//Usage:
// var routeFinder = new RouteFinder();
// var routes = routeFinder.findRoute(origin, destination);
// if (routes.length > 0){
	// do something
// } else {
	// console.log('No results found');
// }

//NOT IMPLEMENTED
function RouteFinder(googleMap){
	//Searches for directions between two points
    var directionsService = new google.maps.DirectionsService();

    //Displays the route between two points
    var directionsDisplay = new google.maps.DirectionsRenderer();

    this.findRoute = function(origin, destination) {
        var start = origin;
        var end = destination;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setMap(googleMap);
            }
        });
    }
}