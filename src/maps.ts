import { mapAPIKey } from "./config/map-api.config";
import { Client, DirectionsRequest, DirectionsResponse, DistanceMatrixResponse } from "@googlemaps/google-maps-services-js";

export class GoogleMaps {

    public async getDirection(origin: any, destination: any, mapKey?: any):Promise<DirectionsResponse> {
        const mapClient = new Client({});
       return await mapClient.directions({
            params: {
                origin,
                destination,
                key: mapKey ? mapKey : mapAPIKey
            },
            timeout: 10000, 
        })
    }

    public async getDistanceMatrix(origins: any, destinations: any, mapKey?: any,units?:string):Promise<DistanceMatrixResponse> {
        const mapClient = new Client({});
       return await mapClient.distancematrix({
        params: {
                origins,
                destinations,
                key: mapKey ? mapKey : mapAPIKey
        }
        })
    }
}