const express = require('express');
const app = express();
const path = require('path');

//novelcovid config
const covid = require('novelcovid');
covid.settings({
    baseUrl: 'https://disease.sh'
})

//mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoiaGFwcHl0cmkiLCJhIjoiY2tqbmExdTc4MGJjMzJ2cHI5amNpMHRrNCJ9.0VgYVKFUIpjkY3gghI6jng'
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: MAPBOX_TOKEN });

//EJS
app.set('view engine', 'ejs')  //tell we're using ejs
app.set('views', path.join(__dirname, 'views'))//so we can access it outside this directory

//ejs-mate setup
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

//Static files
app.use(express.static(path.join(__dirname, 'public')));

//classes and other imports
const popupCountries = require('./public/javascripts/popupCountries')

//Parsing 
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json

app.get('/dev',async(req,res)=>{
    const data = await covid.historical.countries({country:'Indonesia',date:15});
    res.send(data);
})

app.get('/', async(req,res)=>{
    const countriesLong = await covid.countries();
    let countries = [];
    countriesLong.forEach((country)=>{
        countries.push(new popupCountries(country.country,country.cases,country.deaths,country.countryInfo.flag))
        })
    res.render('index',{countries});    
})

app.get('/:country',async(req,res)=>{
    const{country} = req.params;
    const userDefault = {
        days: 30,
        type: 'New Cases'
    }
    const countryData = await covid.countries({ country: country });
    const historicalData = await covid.historical.countries({ country: country, days:userDefault.days});
    res.render('detail',{countryData, historicalData, user:userDefault})
})

app.listen(3000, () => {
    console.log(`Connected to port 3000`)
})


//  {
//     updated: 1611367466361,
//     country: 'Israel',
//     countryInfo: {
//       _id: 376,
//       iso2: 'IL',
//       iso3: 'ISR',
//       lat: 31.5,
//       long: 34.75,
//       flag: 'https://disease.sh/assets/img/flags/il.png'
//     },
//     cases: 589028,
//     todayCases: 0,
//     deaths: 4266,
//     todayDeaths: 0,
//     recovered: 504820,
//     todayRecovered: 0,
//     active: 79942,
//     critical: 1182,
//     casesPerOneMillion: 64042,
//     deathsPerOneMillion: 464,
//     tests: 9925207,
//     testsPerOneMillion: 1079110,
//     population: 9197590,
//     continent: 'Asia',
//     oneCasePerPeople: 16,
//     oneDeathPerPeople: 2156,
//     oneTestPerPeople: 1,
//     activePerOneMillion: 8691.62,
//     recoveredPerOneMillion: 54886.12,
//     criticalPerOneMillion: 128.51
//   }

