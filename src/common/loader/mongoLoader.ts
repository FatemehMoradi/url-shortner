import {env} from "../../env";
import {connect, connection} from "mongoose";
import {Logger} from "../services/logger";

const log = new Logger();

let mongoUrl = "mongodb://" + env.mongo.username + ":" + env.mongo.password + "@" + env.mongo.host + ":" + env.mongo.port + "/" + env.mongo.database;
if (!env.mongo.username || !env.mongo.password) {
    mongoUrl = "mongodb://" + env.mongo.host + ":" + env.mongo.port + "/" + env.mongo.database;
}
export const initMongo = async () => {
    await connect(mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
    });
    const db = connection;
    db.on('error', (err) => {
        log.error('db connection error... ', err);
        throw  err
    });
    db.once('open', () => {
        log.debug('db opened...');
    });
};

