function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function addColor(nums){

    if(nums > 90000){
        return 'danger1';
    }else if(nums> 45000){
        return 'danger2';
    }else if(nums > 15000){
        return 'danger3';
    }else{
        return 'danger4';
    }
}
mapboxgl.accessToken = 'pk.eyJ1IjoiaGFwcHl0cmkiLCJhIjoiY2tqbmExdTc4MGJjMzJ2cHI5amNpMHRrNCJ9.0VgYVKFUIpjkY3gghI6jng';
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    center: [0, 0],
    zoom: 2
});

map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
    }), 'top-right'
);

map.addControl(new mapboxgl.NavigationControl(),'top-left');

countries.forEach((country) => {
    // create DOM element for the marker
    let el = document.createElement('div');
    el.classList.add('marker');
    console.log(country.cases)
    el.classList.add(addColor(country.cases));

    mapboxClient.geocoding
        .forwardGeocode({
            query: country.name,
            autocomplete: false,
            limit: 1
        })
        .send()
        .then(function (response) {
            if (
                response &&
                response.body &&
                response.body.features &&
                response.body.features.length
            ) {
                var feature = response.body.features[0];
                new mapboxgl.Marker(el)
                    .setLngLat(feature.center)
                    .setPopup(new mapboxgl.Popup().setHTML(
                        `<div class='row'>
                         <h4 class='col'>${country.name}</h4>
                         <img src="${country.flag}" class="flag col" alt="...">
                         </div>
                         <h5>Cases: ${numberWithCommas(country.cases)}</h5>
                         <h5>Deaths: ${numberWithCommas(country.deaths)}</h5>
                         <a class='btn btn-success' href="/${country.name}">View</a>`
                        ))
                    .addTo(map)
            }
        });
})
