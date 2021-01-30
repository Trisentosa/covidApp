if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');

//helmet
const helmet = require("helmet");
app.use(helmet({ contentSecurityPolicy: false }));

//ExpressError
const ExpressError = require('./utilities/ExpressError.js')
const catchAsync = require('./utilities/catchAsync.js')

//novelcovid config
const covid = require('novelcovid');
covid.settings({
    baseUrl: 'https://disease.sh'
})

//mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

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

app.get('/', catchAsync(async(req,res)=>{
    const countriesLong = await covid.countries();
    let countries = [];
    countriesLong.forEach((country)=>{
        countries.push(new popupCountries(country.country,country.cases,country.deaths,country.countryInfo.flag))
        })
    res.render('index',{countries});    
}))

app.get('/:country',catchAsync(async(req,res)=>{
    const{country} = req.params;
    const userDefault = {
        days: 30,
        type: 'New Cases'
    }
    const countryData = await covid.countries({ country: country });
    if (countryData.message === "Country not found or doesn't have any cases"){
        res.redirect('/');
    }
    const historicalData = await covid.historical.countries({ country: country, days:userDefault.days});
    res.render('detail',{countryData, historicalData, user:userDefault})
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!!!', 404));
})

app.use((err, req, res, next) => {
    const { message = 'Something Went Wrong', status = 500 } = err;
    res.status(status).send(message);
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listeing on port ${port}`)
})
