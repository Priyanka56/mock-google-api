
import * as winston from 'winston';
export class Logger {    
    public logger: any;
    // define the custom settings for each transport (file, console)
    public options = {
        file: {
            level: 'info',
            filename: 'maps.log',
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        },
    };

    constructor() {
         this.logger = winston.createLogger({
            transports: [
                new winston.transports.File(this.options.file),
                new winston.transports.Console(this.options.console)
            ],
            exitOnError: false, // do not exit on handled exceptions
        });
    }
}