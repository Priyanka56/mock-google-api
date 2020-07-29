
import express from 'express';
import { DAOClass } from './dbScripts';
import { GoogleMaps } from './maps';
import { Logger } from './logger';
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
    let apiKey = req.query.key;
    let response = {};
    let dbRecord = await db.getDirections(origin, destination);
    if (dbRecord) {
        response = dbRecord;
    }
    else {
        await googleMaps.getDirection(origin, destination, apiKey).then((res: any) => {
            response = res.data;
        });
        await db.insertDirectionData(origin, destination, response)
    }
    loggerApi.logger.info(response);
    res.send(response);
});

app.listen(3128);