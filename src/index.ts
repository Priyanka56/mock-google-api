
import express from 'express';
import { DAOClass } from './dbScripts';
import { GoogleMaps } from './maps';
import { Logger } from './logger';
import { mapAPIKey } from "./config/map-api.config";
let app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
var db = new DAOClass();
var googleMaps = new GoogleMaps();
var loggerApi = new Logger();
// Get webhook associated with device
app.get('/maps/api/directions/json?', async (req, res, next) => {
    let origin = req.query.origin;
    let destination = req.query.destination;
    let apiKey = req.query.key?req.query.key:mapAPIKey;
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

// Get webhook associated with device
app.get('/maps/api/distancematrix/json?', async (req, res, next) => {
    let origins = req.query.origins;
    let destinations = req.query.destinations;
    let apiKey = req.query.key?req.query.key:mapAPIKey;
    let response = {};
    let dbRecord = await db.getDistanceMatrix(origins, destinations);
    if (dbRecord) {
        response = dbRecord;
        console.log("db record found",dbRecord);
    }
    else {
         await googleMaps.getDistanceMatrix(origins, destinations, apiKey).then((res:any) => {
            response = res.data;
        }).catch((error:any)=>{
            response= error;
        });
        console.log("db record not found",response);
        response?await db.insertDistanceMatrix(origins, destinations, response):null ;
    }
    loggerApi.logger.info(response);
    res.send(response);
});

app.listen(3128);