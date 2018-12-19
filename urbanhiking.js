// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoidmlkYXNoZW4iLCJhIjoiY2pscHRlMjdmMGVodzNrcm16ZG50Y2h5MCJ9.Geptc9bTEduKQp3Jtcfavg'; 

var map = new mapboxgl.Map({
	container: 'map', 
    center: [-122.410,37.794], 
    zoom: 12, 
	style: 'mapbox://styles/vidashen/cjoegu4c21ubw2rjyz0px4kbi', 
	customAttribution: 'DataSF (https://data.sfgov.org/)', 
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});



// Legend
var layers = [ // an array of the possible values you want to show in your legend
    'Wide (12 ft)',
    'Comfortable (10 ft)',
    'Chill (8 ft)',
    'Limited(6 ft)',
    'Unwelcomed (0 ft)'
];

var colors = [ // an array of the color values for each legend item
    '#4170b7',
    '#7dd0de',
    '#6ebe46',
    '#f3af1c',
    '#ef4647'
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 

    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. 

        var parks = map.queryRenderedFeatures(e.point, {    
            layers: ['recreation-and-parks-faciliti-16tbnc']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<h4><strong>' + parks[0].properties.map_label + '</strong></h4><p>' + parks[0].properties.address);

        } else {    // what shows up in the info window if you are NOT hovering over a park

            $('#info-window-body').html('<p>Hover over a <strong>park</strong> to learn more right now!!</p>');
            
        }

    });

    // POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) {   // Event listener to do some code when user clicks on the map

      var stops = map.queryRenderedFeatures(e.point, {  // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['bart-busstation-3u9peq']    // replace this with the name of the layer from the Mapbox Studio layers panel
    });

      // if the layer is empty, this if statement will exit the function (no popups created) -- this is a failsafe to avoid non-functioning popups
      if (stops.length == 0) {
        return;
    }


    // Initiate the popup
    var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
    });

    // Set the popup location based on each feature
      popup.setLngLat(stops[0].geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>BART Station: ' + '</h3><p>' + stops[0].properties.STATION + '</p>');
            // stops[0].properties.stop_id will become the title of the popup (<h3> element)
            // stops[0].properties.stop_name will become the body of the popup


        // popup.setHTML('<p>' + stops[0].properties.stop_name + '</p>')
        

      // Add the popup to the map 
      popup.addTo(map);  // replace "map" with the name of the variable in line 4, if different
  });

// 11.01 starts here----------------------------------------------

// SHOW/HIDE LAYERS
    
    var layers = [  
        ['urban-bird-refuge-cm2gm9', 'Bird Refuge'],     
        ['recreation-and-parks-faciliti-16tbnc', 'Urban Parks'], 
        ['arterial-streets-of-san-franc-18eylp', 'Arterial Street'],     
        ['bart-busroute-4miaaj', 'Bart Route'],
    ]; 

    
    // functions to perform when map loads
    map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1]  + "</a>");
        }

        // show/hide layers when button is clicked, it's a everntlistener because you have"on"
        $("#layers-control>a").on('click', function(e) {

                var clickedLayer = e.target.id;
                e.preventDefault();
                e.stopPropagation();

                var visibility = map.getLayoutProperty(clickedLayer, 'visibility');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#getlayoutproperty
                console.log(visibility);

                if (visibility === 'visible') {
                    map.setLayoutProperty(clickedLayer, 'visibility', 'none');  // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                    $(e.target).removeClass('active');
                } else {
                    $(e.target).addClass('active');
                    map.setLayoutProperty(clickedLayer, 'visibility', 'visible'); // see https://www.mapbox.com/mapbox-gl-js/api/#map#setlayoutproperty
                }
        });
    });



// SCROLL TO ZOOM THROUGH SITES
    
    var chapters = {
        'sf-downtown': {
            name: "SF Downtown",
            description: "The Financial District is the city’s business center. Among the skyscrapers that dominate the skyline is the striking, spire-topped Transamerica Pyramid building. There is a wealth of happy-hour hot spots and elegant date-night destinations, including the classic Tadich Grill, the city’s oldest restaurant. The Jackson Square Historic District features remnants of the Barbary Coast, a 19th-century red-light district.",
            imagepath: "img/SF Downtown.jpg",
            bearing: -26.17,
            center: [ -122.417, 37.781],
            zoom: 14,
            pitch: 57.50
        },
        'golden-gate': {
            name: "Golden Gate",
            description: "The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide (1.6 km) strait connecting San Francisco Bay and the Pacific Ocean. The structure links the American city of San Francisco, California – the northern tip of the San Francisco Peninsula – to Marin County, carrying both U.S. Route 101 and California State Route 1 across the strait. The bridge is one of the most internationally recognized symbols of San Francisco, California, and the United States. It has been declared one of the Wonders of the Modern World by the American Society of Civil Engineers.",
            imagepath: "img/Golden Gate.jpg",
            bearing: -40.57,
            center: [ -122.471, 37.808],
            zoom: 14.5,
            pitch: 60.00
        },
        'lands-end': {
            name: "Lands End",
            description: "Lands End is a park in San Francisco within the Golden Gate National Recreation Area. It is a rocky and windswept shoreline at the mouth of the Golden Gate, situated between the Sutro District and Lincoln Park and abutting Fort Miley Military Reservation. A memorial to the USS San Francisco stands in the park.",
            imagepath: "img/Lands End.jpg",
            bearing: -31.40,
            center: [ -122.498, 37.782],
            zoom: 14,
            pitch: 60.00
        },
        'fishermans-wharf': {
            name: "Fisherman's Wharf",
            description: "Fisherman’s Wharf, on the northern waterfront, is one of the city's busiest tourist areas. Souvenir shops and stalls selling crab and clam chowder in sourdough bread bowls appear at every turn, as do postcard views of the bay, Golden Gate and Alcatraz. There’s also a colony of sea lions to see and historic ships to tour. At Ghirardelli Square, boutiques and eateries reside in the famed former chocolate factory.",
            imagepath: "img/Wharf.jpg",
            bearing: -36.57,
            center: [ -122.418, 37.807],
            zoom: 15.32,
            pitch: 60.00
        }
    };


    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        console.log(key);
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h4>" + chapters[key]['name'] + "</h4><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
    }


    $("#chapters").scroll(function(e) {

        var chapterNames = Object.keys(chapters);

        for (var i = 0; i < chapterNames.length; i++) {

            var chapterName = chapterNames[i];
            var chapterElem = $("#" + chapterName);

            if (chapterElem.length) {

                if (checkInView($("#chapters"), chapterElem, true)) {
                    setActiveChapter(chapterName);
                    $("#" + chapterName).addClass('active');

                    break;

                } else {
                    $("#" + chapterName).removeClass('active');
                }
            }
        }
    });

    var activeChapterName = '';
    
    function setActiveChapter(chapterName) {
        if (chapterName === activeChapterName) return;

        map.flyTo(chapters[chapterName]);

        activeChapterName = chapterName;
    }

    function checkInView(container, elem, partial) {
        var contHeight = container.height();
        var contTop = container.scrollTop();
        var contBottom = contTop + contHeight ;

        var elemTop = $(elem).offset().top - container.offset().top;
        var elemBottom = elemTop + $(elem).height();


        var isTotal = (elemTop >= 0 && elemBottom <=contHeight);
        var isPart = ((elemTop < 0 && elemBottom > 0 ) || (elemTop > 0 && elemTop <= container.height())) && partial ;

        return  isTotal  || isPart ;
    }



    //-------------------------------------

// Timeline labels using d3

    var width = 1000;
    var height = 25;
    var marginLeft = 15;
    var marginRight = 15;

    var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    
    // Append SVG 
    var svg = d3.select("#timeline-labels")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

    // Create scale
    var scale = d3.scaleLinear()
                  .domain([d3.min(data), d3.max(data)])
                  .range([marginLeft, width-marginRight]); 

    // Add scales to axis
    var x_axis = d3.axisBottom()
                   .scale(scale)
                   // .tickFormat(d3.format("d"));  // Formats number as a date, e.g. 2008 instead of 2,008 

    //Append group and insert axis
    svg.append("g")
       .call(x_axis);

// Timeline map filter (timeline of building permit issue dates)
    
    // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
    map.on('load', function () {

        // Get all data from a layer using queryRenderedFeatures
        var permits = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
            layers: ["mta-path width"]
        });

        var permitDatesArray = [];
        var permitYearsArray = [];

        // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
        for (i=0; i<permits.length; i++) {
            var permitDate = permits[i].properties.width_min;
            // The format of the date in this layer is a long string in the format "2012-10-19T04:00:00.000Z", and we are just looking for the 4-digit year, so the following line will trim each value in the array to just the first 4 characters.
            var permitYear = permitDate.substring(0, 1);
            


            permitDatesArray.push(permitDate);    // Replace "AppliedDat" with the field you want to use for the timeline slider
            permitYearsArray.push(permitYear);
        }
        console.log(permitDate);

        // Create event listener for when the slider with id="timeslider" is moved
        $("#timeslider").change(function(e) {
            var year = this.value; 
            var indices = [];

            // Find the indices in the permitDatesArray array where the year from the time slider matches the year of the permit application
            var matches = permitDatesArray.filter(function(item, i){
                if (item.indexOf(year) >= 0) {
                    indices.push(i);
                }
            });

            // create filter 
            var newFilters = ["any"];
            
            for (i=0; i<indices.length; i++) {
                var filter = ["==","width_min", permitDatesArray[indices[i]]];
                newFilters.push(filter);
            }

            map.setFilter("mta-path width", newFilters);
        });


// // Timeline map filter (timeline of building permit issue dates)
    
//     // Create array of  dates from Mapbox layer (in this case, Charlottesville Building Permit application dates)
//     map.on('load', function () {

//         // Get all data from a layer using queryRenderedFeatures
//         var permits = map.queryRenderedFeatures(null, { // when you send "null" as the first argument, queryRenderedFeatures will return ALL of the features in the specified layers
//             layers: ["mta-path width"]
//         });

//         var width_minArray= [];
//         // var permitYearsArray = [];

//         // push the values for a certain property to the variable declared above (e.g. push the permit dates to a permit date array)
//         for (i=0; i<permits.length; i++) {
//             var width_min = permits[i].properties.width_min;
//             // // The format of the date in this layer is a long string in the format "2012-10-19T04:00:00.000Z", and we are just looking for the 4-digit year, so the following line will trim each value in the array to just the first 4 characters.
//             // var permitYear = permitDate.substring(0, 4);
            
//             width_min.push(width_min);    // Replace "AppliedDat" with the field you want to use for the timeline slider
//             // permitYearsArray.push(permitYear);
//         }

//         // Create event listener for when the slider with id="timeslider" is moved
//         $("#timeslider").change(function(e) {
//             var width = this.value; 
//             var indices = [];

//             // Find the indices in the permitDatesArray array where the year from the time slider matches the year of the permit application
//             var matches = width_min.filter(function(item, i){
//                 if (item.indexOf(width) >= 0) {
//                     indices.push(i);
//                 }
//             });

//             // create filter 
//             var newFilters = ["any"];
            
//             for (i=0; i<indices.length; i++) {
//                 var filter = ["==","width_min", width_min[indices[i]]];
//                 newFilters.push(filter);
//             }

//             map.setFilter("mta-path width", newFilters);
//         });

    });
