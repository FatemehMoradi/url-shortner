import {Service} from 'typedi';
import {Logger} from '../common/services/logger';
import {ErrorMessages} from "../common/enums/errorMessages.enum";
import {ViewDto} from "../serializers/view.dto";
import {ViewRepository} from "../repositories/view.repository";
import {UrlService} from "./url.service";

const log = new Logger(__filename);


@Service()
export class ViewService {
    constructor(
        private viewRepository: ViewRepository,
        private urlService: UrlService,
    ) {
    }

    async createView(viewData: ViewDto): Promise<any> {
        try {
            const response = await ViewRepository.createView(viewData);
        } catch (e) {
            throw ErrorMessages.UNKNOWN_ERROR;
        }
    }

    async allViewCount(url: string, userId: string, time?: string) {
        const fetchedUrl = await this.urlService.findByCondition({shortUrl: url, userId});
        if (!fetchedUrl) {
            throw ErrorMessages.URL_NOT_FOUND;
        }

        let condition: any = {url};
        if (time) {
            const createdAt = ViewService.createTimeCondition(time);
            if (createdAt) condition.createdAt = createdAt
        }
        const result = await ViewRepository.getViewCountByCondition(condition);
        return {result}
    }

    async viewCountByPlatform(url: string, userId: string, time?: string) {
        const fetchedUrl = await this.urlService.findByCondition({shortUrl: url, userId});
        if (!fetchedUrl) {
            throw ErrorMessages.URL_NOT_FOUND;
        }

        let condition: any = {url};
        if (time) {
            const createdAt = ViewService.createTimeCondition(time);
            if (createdAt) condition.createdAt = createdAt
        }
        const result = await ViewRepository.aggregateByPlatform(condition);
        return {result}
    }

    async viewCountByBrowser(url: string, userId: string, time?: string) {
        const fetchedUrl = await this.urlService.findByCondition({shortUrl: url, userId});
        if (!fetchedUrl) {
            throw ErrorMessages.URL_NOT_FOUND;
        }

        let condition: any = {url};
        if (time) {
            const createdAt = ViewService.createTimeCondition(time);
            if (createdAt) condition.createdAt = createdAt
        }
        const result = await ViewRepository.aggregateByBrowser(condition);
        return {result}
    }


    static createTimeCondition(time: string) {
        const today = new Date();
        let priorDate;

        switch (time) {
            case 'day':
                priorDate = new Date().setDate(today.getDate() - 1);
                break;
            case 'week':
                priorDate = new Date().setDate(today.getDate() - 7);
                break;
            case 'month':
                priorDate = new Date().setDate(today.getDate() - 30);
                break;
            default:
                return undefined
        }
        return  {$gte: new Date(priorDate)};
    }
}
