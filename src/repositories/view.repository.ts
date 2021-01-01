import {View} from "../models/view";
import {ViewDto} from "../serializers/view.dto";

export class ViewRepository {

    static async createView(viewData: ViewDto): Promise<ViewDto> {
        console.log('create View : ', viewData);
        const view = new View(viewData);
        await view.save();
        return view.toJSON();
    }


    static async getViewCountByCondition(condition: { url: string, userIp?: string, os?: string, browser?: string, createdAt?: any }) {
        const count = await View.countDocuments(condition);
        console.log('condition is: ', condition, 'count is: ', count);
        return count
    }

    static async aggregateByPlatform(condition: { url: string, userIp?: string, browser?: string }) {
        const result = await View.aggregate([
            {$match: condition},
            {
                $group: {
                    _id: {platform: "$os"},
                    count: {$sum: 1}
                }
            }
        ]);
        console.log(result);
        return result
    }

    static async aggregateByBrowser(condition: { url: string, userIp?: string, os?: string }) {
        const result = await View.aggregate([
            {$match: condition},
            {
                $group: {
                    _id: {platform: "$browser"},
                    count: {$sum: 1}
                }
            }
        ]);
        console.log(result);
        return result
    }
}
