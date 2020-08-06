import { mapAPIKey } from "./config/map-api.config";
import axios from 'axios';
import { Client, DirectionsResponse, DistanceMatrixResponse } from "@googlemaps/google-maps-services-js";

export class GoogleMaps {
    public async getDirection(origin: any, destination: any, mapKey?: any): Promise<DirectionsResponse> {
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


    public async  getDistanceMatrix(origins: any, destinations: any, mapKey?: any, units?: string): Promise<any> {
        return await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json?', {
            params: {
                origins, destinations, key: mapKey ? mapKey : mapAPIKey
            }
        })
    }

    public async  getGeoCoordinates(address: any, mapKey?: any): Promise<any> {
        return await axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
            params: {
                address, key: mapKey ? mapKey : mapAPIKey
            }
        })
    }

    public async  getAddressfromCoordinates(latlng: any,locationType?:any,resultType?:any, mapKey?: any): Promise<any> {
        return await axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
            params: {
                latlng, 
                location_type:locationType?locationType:undefined,
                result_type:resultType?resultType:undefined,
                key: mapKey
            }
        })
    }

}