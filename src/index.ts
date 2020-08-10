
import express from 'express';
import { DAOClass } from './dbScripts';
import { GoogleMaps } from './maps';
import { Logger } from './logger';
let app = express();
const dotenv = require('dotenv').config();
console.log("enviroment variable are", dotenv);
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
var db = new DAOClass();
var googleMaps = new GoogleMaps();  
var loggerApi = new Logger();
// Get directions for origin and destination
app.get('/maps/api/directions/json?', async (req, res, next) => {
    let origin = req.query.origin;
    let destination = req.query.destination;
    let apiKey = dotenv.parsed.key;
    let response = {};
    let dbRecord = await db.getDirections(origin, destination);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
         await googleMaps.getDirection(origin, destination, apiKey).then(async(res:any) => {
            console.log(res.data);
            if(res.data.status=='REQUEST_DENIED'){
                response = {
                    message: "Please provide the valid api key"
                };
            }
            else {
                response = res.data;
                console.log("db record not found",response);
                response?await db.insertDirectionData(origin, destination, response):null ;
            }
        }).catch((error:any)=>{
            response= error;
        });
        console.log("db record not found",response);
       
    }
    loggerApi.logger.info(response);
    res.send(response);
});

// Get distance matrix
app.get('/maps/api/distancematrix/json?', async (req, res, next) => {
    let origins = req.query.origins;
    let destinations = req.query.destinations;
    let apiKey = dotenv.parsed.key;
    let response = {};
    let dbRecord = await db.getDistanceMatrix(origins, destinations);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
         await googleMaps.getDistanceMatrix(origins, destinations, apiKey)
         .then(async(res:any) => {
            if(res.data.status=='REQUEST_DENIED'){
                response = {
                    message: "Please provide the valid api key"
                };
            }
            else {
                response = res.data;
                console.log("db record not found",response);
                response && response!={}?await db.insertDistanceMatrix(origins, destinations, response):null ;
            }
        }).catch((error:any)=>{
            console.log("error",error);
            response = {};
        });
        
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
    let apiKey = dotenv.parsed.key;
    console.log("key is",apiKey);
    let response:any = {};
    let dbRecord = latlng?await db.getAddressFromCoordinates(latlng):await db.getCoordinates(address);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
        let responsePromise = latlng?googleMaps.getAddressfromCoordinates(latlng, apiKey): googleMaps.getGeoCoordinates(address, apiKey);
        await responsePromise
         .then(async(res:any) => {
            console.log(res.data.status);
            if(res.data.status=='REQUEST_DENIED'){
                response = {
                    message: "Please provide the valid api key"
                };
            }
            else {
                response = res.data;
                console.log("db record not found",response);
                response && response!={} && latlng ?await db.insertLatLng(latlng, response): await db.insertAddress(address, response);
            }
        }).catch((error:any)=>{
            console.log("error",error);
            response = {};
        });
    }
    loggerApi.logger.info(response);
    response.key = apiKey
    res.send(response);
});
app.listen(dotenv.parsed.port | 3128);