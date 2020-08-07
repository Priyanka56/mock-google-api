
import express from 'express';
import { DAOClass } from './dbScripts';
import { GoogleMaps } from './maps';
import { Logger } from './logger';
import { mapAPIKey } from "./config/map-api.config";
let app = express();
const dotenv = require('dotenv').config();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
var db = new DAOClass();
var googleMaps = new GoogleMaps();  
var loggerApi = new Logger();
// Get directions for origin and destination
app.get('/maps/api/directions/json?', async (req, res, next) => {
    let origin = req.query.origin;
    let destination = req.query.destination;
    let apiKey = dotenv.key;
    let response = {};
    let dbRecord = await db.getDirections(origin, destination);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
         await googleMaps.getDirection(origin, destination, apiKey).then((res:any) => {
            response = res.data;
        }).catch((error:any)=>{
            response= error;
        });
        console.log("db record not found",response);
        response?await db.insertDirectionData(origin, destination, response):null ;
    }
    loggerApi.logger.info(response);
    res.send(response);
});

// Get distance matrix
app.get('/maps/api/distancematrix/json?', async (req, res, next) => {
    let origins = req.query.origins;
    let destinations = req.query.destinations;
    let apiKey = dotenv.key;
    let response = {};
    let dbRecord = await db.getDistanceMatrix(origins, destinations);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
         await googleMaps.getDistanceMatrix(origins, destinations, apiKey)
         .then((res:any) => {
            console.log(res.data);
            response = res.data;
        }).catch((error:any)=>{
            console.log("error",error);
            response = {};
        });
        console.log("db record not found",response);
        response && response!={}?await db.insertDistanceMatrix(origins, destinations, response):null ;
    }
    loggerApi.logger.info(response);
    res.send(response);
});

// Get address from lat lng
app.get('/maps/api/geocode/json', async (req, res, next) => {
    console.log("environment variable", dotenv);
    let latlng = req.query.latlng;
    let address = req.query.address;
    let locationType = req.query.location_type;
    let resultType = req.query.result_type;
    let apiKey = dotenv.key;
    let response:any = {};
    let dbRecord = latlng?await db.getAddressFromCoordinates(latlng):await db.getCoordinates(address);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
        let responsePromise = latlng?googleMaps.getAddressfromCoordinates(latlng, apiKey): googleMaps.getGeoCoordinates(address, apiKey);
        await responsePromise
         .then((res:any) => {
            console.log(res.data);
            response = res.data;
        }).catch((error:any)=>{
            console.log("error",error);
            response = {};
        });
        console.log("db record not found",response);
        response && response!={} && latlng ?await db.insertLatLng(latlng, response): await db.insertAddress(address, response);
    }
    loggerApi.logger.info(response);
    response.key = apiKey
    res.send(response);
});

app.listen(dotenv.PORT);