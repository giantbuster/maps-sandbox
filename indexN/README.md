StreetViewGallery
=================
By: Jefferson Lam
Last Updated: January 24nd, 2014

Special Thanks To:
    Google
    CodingDojo : http://codingdojo.com/
    Brian Folts : http://www.brianfolts.com/driver/
    The Folks behind HyperLapse : http://hyperlapse.tllabs.io/


//Tasks
//=====

//DONE: Add scrolling functionality for viewing images
//DONE: Remove current pointer upon searching again
//DONE: Functional progress bar
//DONE: Show loading message after searching for route
//DONE: Show loading screen before displaying streetviews and reading input
//DONE: Split up finding route/find street views buttons

//DONE: Remove duplicate street views before calculating headings


//FRONT-END:
    //TODO: Make it possible to click and slide progress bar to move between images
    //TODO: Two maps: A big map for searching routes, and a minimap for showing current image location.

//BACK-END:
    //TODO: Put everything back into streetviewgrabber.js, rather than being dispersed everywhere.
    //TODO: Segment entire route into equidistant segments, and grab an image from each 
    //      segment, rather than grabbing all images at the start of the route.
    //TODO: Set first pointer upon load
    //TODO: Clean up code. OOP-ify stuff. Less free-floating functions that kinda grab everything from everywhere.