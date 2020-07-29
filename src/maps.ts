import { mapAPIKey } from "./config/map-api.config";
import { Client } from "@googlemaps/google-maps-services-js";

export class GoogleMaps {
    public mapClient: any;
    constructor() {
        this.mapClient = new Client({});
    }

    public getDirection(origin: any, destination: any, mapKey?: any):any {
        return this.mapClient.directions({
            params: {
                origin,
                destination,
                key: mapKey ? mapKey : mapAPIKey
            },
        });
    }
}