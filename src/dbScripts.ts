import mongoose from "mongoose";
export class DAOClass {

    public directionModel: any = {};
    public distanceMatrixModel:any = {};
    public addressModel:any = {};
    public latLngModel:any = {};
    public db: any;
    constructor() {
        
        // make a connection 
        mongoose.connect('mongodb+srv://omni:2H7KEn8oJWlnXcDb@cluster0-qt6ov.mongodb.net/google-api-db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log("connected to database");
        }).catch((err) => {
            console.log("Connection Error", err);
        });

        this.db = mongoose.connection;
        this.db.once('open', () => {
            // define Schema 
            let directionSchema = new mongoose.Schema({
                _id: Object,
                origin: String,
                destination: String,
                response: Object
            });
            // compile schema to model
            this.directionModel = mongoose.model('directions', directionSchema);
            let distanceMatrixSchema = new mongoose.Schema({
                _id: Object,
                origins: String,
                destinations: String,
                response: Object
            });
            // compile schema to model
            this.distanceMatrixModel = mongoose.model('distanceMatrix', distanceMatrixSchema);
            let addressSchema = new mongoose.Schema({
                _id: Object,
                address: String,
                response: Object
            });
            this.addressModel = mongoose.model('address', addressSchema);
            let latLngSchema = new mongoose.Schema({
                _id: Object,
                latlng: String,
                response: Object
            });
            this.latLngModel = mongoose.model('geo-coordinates', latLngSchema);
        });

    }

    public getDirections(origin: any, destination: any) {
        return this.directionModel.findOne(
            { origin, destination });
    }

    async insertDirectionData(origin: any, destination: any, response: Object) {
        var returnData = null;
        this.directionModel.collection.insertOne({ origin, destination, response })
            .then((docs: any) => {
                console.log("single record is inserted into db", docs.ops);
                returnData = docs.ops;
            },
                (err: any) => {
                    returnData = err;
                });
        return returnData;
    }
    
    async insertDistanceMatrix(origins: any, destinations: any, response: Object) {
        var returnData = null;
        this.distanceMatrixModel.collection.insertOne({ origins, destinations, response })
            .then((docs: any) => {
                console.log("single record is inserted into db distanceMatrix", docs.ops);
                returnData = docs.ops;
            },
                (err: any) => {
                    returnData = err;
                });
        return returnData;
    }

    public getDistanceMatrix(origins: any, destinations: any) {
        return this.distanceMatrixModel.findOne(
            { origins, destinations});
    }
    public getCoordinates(address: any) {
        return this.addressModel.findOne(
            { address});
    }
    
    async insertAddress(address: any, response: Object) {
        var returnData = null;
        this.addressModel.collection.insertOne({ address, response })
            .then((docs: any) => {
                console.log("single record is inserted into db distanceMatrix", docs.ops);
                returnData = docs.ops;
            },
                (err: any) => {
                    returnData = err;
                });
        return returnData;
    }

    public getAddressFromCoordinates(latlng: any) {
        return this.latLngModel.findOne(
            { latlng});
    }
    
    async insertLatLng(latlng: any, response: Object) {
        var returnData = null;
        this.latLngModel.collection.insertOne({ latlng, response })
            .then((docs: any) => {
                console.log("single record is inserted into db geocode", docs.ops);
                returnData = docs.ops;
            },
            (err: any) => {
                returnData = err;
            });
        return returnData;
    }
}