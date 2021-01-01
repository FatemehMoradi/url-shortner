import mongoose, {Schema, Document} from 'mongoose';
import {UrlDto} from '../serializers/url.dto';

const urlSchema = new Schema(
    {
        originalUrl: {type: String, required: true},
        shortUrl: {type: String, required: true, unique: true},
        userId: {type: String, required: true},
        active: {type: Boolean, required: true},
    },
    {
        timestamps: true,
    },
);

const Url = mongoose.model<UrlDto & Document>('url', urlSchema);

export {Url, urlSchema};
