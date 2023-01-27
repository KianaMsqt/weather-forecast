$( '#search-button' ).on( 'click', function( e ) {
    e.preventDefault();
    
    var inputQuery = $( '#search-input' ).val().trim(),
        apiKey = "52a07063d5727308908d9b356e188a05",
        lat,
        long,
        queryURL;

    // Retrieve geographical coordinates for the given city name
    // TODO: get lat and long, using inputQuery
    queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=" + apiKey;
    $.ajax( {
        url: "http://api.openweathermap.org/geo/1.0/direct?q=" + inputQuery +  "&limit=1&appid=" + apiKey,
        method: "GET"
    } ).then( function( response ) {
        console.log( response )
    } );

    // TODO: Get 5 days forecast
    // $.ajax( {
    //     url: queryURL,
    //     method: "GET"
    // } ).then( function( response ) {
    //     console.log( response )
    // } );

} )

// TODO: Declare a function to delete recent results and call it before requesting for search
