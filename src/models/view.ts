import mongoose, {Schema, Document} from 'mongoose';
import {ViewDto} from "../serializers/view.dto";

const viewSchema = new Schema(
    {
        userIp: {type: String, required: true},
        url: {type: String, required: true},
        browser: {type: String, required: true},
        os: {type: String, required: true},
    },
    {
        timestamps: true,
    },
);

const View = mongoose.model<ViewDto & Document>('view', viewSchema);

export {View, viewSchema};
