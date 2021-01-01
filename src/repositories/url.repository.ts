import {UrlDto} from "../serializers/url.dto";
import {Url} from "../models/url";

export class UrlRepository {
    async findByShortUrl(shortUrl: string): Promise<UrlDto> {
        const url = await Url.findOne({shortUrl});
        console.log(url);
        return url;
    }

    async findByCondition(condition: { shortUrl?: string, userId?: string, originalUrl?: string }): Promise<UrlDto> {
        const url = await Url.findOne(condition);
        console.log(url);
        return url;
    }


    async createUrl(urlData: UrlDto): Promise<UrlDto> {
        const url = new Url(urlData);
        await url.save();
        return url.toJSON();
    }

}
