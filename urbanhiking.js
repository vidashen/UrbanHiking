// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoidmlkYXNoZW4iLCJhIjoiY2pscHRlMjdmMGVodzNrcm16ZG50Y2h5MCJ9.Geptc9bTEduKQp3Jtcfavg'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-122.410,37.794], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 12, // set the default zoom programatically
	style: 'mapbox://styles/vidashen/cjoegu4c21ubw2rjyz0px4kbi', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'DataSF (https://data.sfgov.org/)', // Custom text used to attribute data source(s)
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
    '<3',
    '3-5',
    '6-7',
    '8-110',
    '>10'
];

var colors = [ // an array of the color values for each legend item
    '#FFEA2C',
    '#EFD800',
    '#CCB800',
    '#B7A500',
    '#8E7D00'
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
            layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel). For more info on queryRenderedFeatures, see the example at https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/. Documentation at https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures.
        });
              
        if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state

            $('#info-window-body').html('<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><img class="park-image" src="img/' + parks[0].properties.PARKNAME + '.jpg">');

        } else {    // what shows up in the info window if you are NOT hovering over a building

            $('#info-window-body').html('<p>Not hovering over a <strong>building</strong> right now.</p>');
            
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
// See example at https://www.mapbox.com/mapbox-gl-js/example/toggle-layers/
    
    var layers = [  // an array of the layers you want to include in the layers control (layers to turn off and on)

        // [layerMachineName, layerDisplayName]
        // layerMachineName is the layer name as written in your Mapbox Studio map layers panel
        // layerDisplayName is the way you want the layer's name to appear in the layers control on the website
        ['urban-bird-refuge-cm2gm9', 'Bird Refuge'],     //
        ['recreation-and-parks-faciliti-16tbnc', 'Urban Parks'], //layer [1][1] is Parks
        ['arterial-streets-of-san-franc-18eylp', 'Arterial Street'],     
        ['bart-busroute-4miaaj', 'Bart Route'],
    ]; 
    
    // functions to perform when map loads
    map.on('load', function () {
        
        for (i=0; i<layers.length; i++) {

            // add a button for each layer
            $("#layers-control").append("<a href='#' class='active button-default' id='" + layers[i][0] + "'>" + layers[i][1] + "</a>");
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
    
    // A JavaScript object containing all of the data for each site "chapter" (the sites to zoom to while scrolling)
    var chapters = {
        'darden-towe': {
            name: "Darden Towe Park",
            description: "Ut nisl quam, fringilla efficitur elementum in, congue vel mi. Nullam consequat pharetra nibh, non accumsan nisl cursus sed. Pellentesque at ex lacus. Ut fringilla nunc id leo maximus ullamcorper. Donec volutpat placerat accumsan. Nulla id luctus diam. Aliquam tincidunt pulvinar mattis. Donec tempor, massa vel vehicula feugiat, diam sem suscipit nisi, eu tempor turpis lorem ac ipsum. Proin quis lectus mattis enim luctus faucibus sit amet vel metus. Etiam luctus nunc eget velit vestibulum posuere. Maecenas enim velit, elementum a suscipit vel, bibendum in odio. Nunc porta, eros nec vehicula pretium, tellus sapien fermentum risus, a pulvinar elit libero ut nisi. Nunc interdum lacus eu ornare dapibus. Suspendisse vitae diam eu turpis venenatis tempor. Ut sodales vel ex finibus facilisis. Nunc hendrerit, augue eget vulputate pellentesque, nibh erat imperdiet justo, id iaculis risus sem commodo urna.",
            imagepath: "img/Darden Towe.jpg",
            bearing: 0,
            center: [ -78.450021, 38.042260],
            zoom: 15.20,
            pitch: 60
        },
        'mcguffey-park': {
            name: "McGuffey Park",
            description: "Aliquam mollis consequat libero, at egestas mi facilisis in. Maecenas sed porta arcu, nec mattis ligula. Sed a porta arcu. Aliquam vel nulla ac orci volutpat ullamcorper. Duis quis auctor urna. Duis id felis vel velit sagittis bibendum. Praesent rutrum velit vel est iaculis, et viverra sapien placerat. Suspendisse potenti. In interdum eu lorem ac cursus. Integer pulvinar lacus nec metus consequat vehicula. Aliquam efficitur vitae neque sed aliquam. Fusce interdum tempor neque vel interdum. Praesent dapibus sollicitudin arcu id finibus. Mauris risus magna, egestas in tristique et, egestas id arcu. Proin leo urna, sollicitudin non mattis in, tempor non nisi. Praesent commodo nibh sit amet dapibus egestas.",
            imagepath: "img/McGuffey Park.jpg",
            bearing: 0,
            center: [ -78.481707, 38.033021],
            zoom: 17.18,
            pitch: 0
        },
        'mcintire-park': {
            name: "McIntire Park",
            description: "Fusce iaculis nulla ut augue posuere, sit amet vestibulum quam elementum. Integer quis varius sem. Mauris fermentum tempus congue. Nulla facilisi. Vestibulum congue cursus tempor. Sed sit amet venenatis magna. Duis fermentum ligula eget auctor eleifend. Aenean ullamcorper arcu et diam pharetra, a pretium lectus porttitor. Donec non lacinia est. Nullam nec felis turpis. Curabitur hendrerit porta dolor, vitae vehicula est dictum id. Ut sollicitudin lectus est, et egestas felis tempus eu. Sed at dictum ex. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam et diam rutrum orci placerat euismod quis vitae dui. Praesent aliquam, quam ac suscipit laoreet, metus nulla mattis justo, et egestas lectus eros ac nulla.",
            imagepath: "img/McIntire Park.jpg",
            bearing: 20,
            center: [ -78.475470, 38.047131],
            zoom: 15,
            pitch: 50
        },
        'rivanna-river': {
            name: "Rivanna River",
            description: "Aenean rutrum finibus ex, quis mollis ante eleifend in. Vestibulum faucibus augue tellus, ac auctor tellus maximus sit amet. Nulla quis rutrum felis. Nullam a facilisis mi, in pretium orci. Vestibulum tempus odio et accumsan lacinia. Duis tempus, dolor sit amet tristique tempus, nisl neque tristique lacus, quis viverra est risus id quam. Donec condimentum massa vitae dui consectetur vehicula. Vivamus interdum nisi sed blandit fermentum. Proin a magna et est varius euismod non quis turpis. Cras rhoncus, nulla non faucibus vestibulum, felis nunc finibus nisi, dictum sollicitudin nibh leo non lorem. Donec ut nulla id nunc elementum luctus. Fusce sed justo ac metus pretium auctor ut eget magna. Vestibulum rhoncus nibh sit amet varius tincidunt.",
            imagepath: "img/Rivanna River.jpg",
            bearing: 0,
            center: [ -78.458309, 38.034810],
            zoom: 16.13,
            pitch: 25
        }
    };

    console.log(chapters['darden-towe']['name']);
    console.log(Object.keys(chapters)[0]);

    // Add the chapters to the #chapters div on the webpage
    for (var key in chapters) {
        var newChapter = $("<div class='chapter' id='" + key + "'></div>").appendTo("#chapters");
        var chapterHTML = $("<h2>" + chapters[key]['name'] + "</h2><img src='" + chapters[key]['imagepath'] + "'><p>" + chapters[key]['description'] + "</p>").appendTo(newChapter);
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
