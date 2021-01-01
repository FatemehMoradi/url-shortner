import {Service} from 'typedi';
import {UrlRepository} from '../repositories/url.repository';
import {CreateUrlDto} from "../serializers/createUrl.dto";
import {UrlResponseDto} from "../serializers/urlResponse.dto";
import {Logger} from '../common/services/logger';
import {RedisService} from "../common/services/redis.service";
import {UserDto} from "../serializers/user.dto";
import {ErrorMessages} from "../common/enums/errorMessages.enum";
import {ViewService} from "./view.service";
import {UrlDto} from "../serializers/url.dto";

const log = new Logger(__filename);


@Service()
export class UrlService {
    constructor(
        private urlRepository: UrlRepository,
        private redisMemory: RedisService,
        private viewService: ViewService,
    ) {
    }

    async findByShortUrl(url: string): Promise<UrlDto> {
        return await this.urlRepository.findByShortUrl(url);
    }

    async findByCondition(condition: { shortUrl?: string, userId?: string, originalUrl?: string }): Promise<UrlDto> {
        return await this.urlRepository.findByCondition(condition);
    }

    async create(urlData: CreateUrlDto, userData: UserDto): Promise<UrlResponseDto> {

        try {
            const {originalUrl, requestedString} = urlData;
            const userId = userData.userId;

            let shortUrl;
            log.debug('requestedString : ', requestedString);
            if (requestedString) {
                const existingAlias = await this.urlRepository.findByShortUrl(requestedString);

                log.debug('existing Alias', existingAlias);
                if (existingAlias) {

                    if (existingAlias.originalUrl === originalUrl && existingAlias.userId === userId) {
                        return {
                            originalUrl,
                            shortUrl: requestedString,
                        }
                    } else {
                        // create similar
                        shortUrl = requestedString + UrlService.generateShortUrl(2);
                    }
                } else {
                    shortUrl = requestedString
                }

            } else {
                shortUrl = UrlService.generateShortUrl(3);
            }


            const newUrlData = {
                originalUrl,
                shortUrl,
                userId,
                active: true,
            };
            log.debug('----------', newUrlData);
            const response = await this.urlRepository.createUrl(newUrlData);
            return {
                originalUrl,
                shortUrl,
            }
        } catch (e) {
            throw ErrorMessages.UNKNOWN_ERROR;
        }
    }

    async redirectUrl(requestedUrl: string, viewData: { isMobile: boolean, browserName: string, osName: string, userIp: string }): Promise<string> {
        try {
            let originalUrl: string = await this.redisMemory.getFromRedis(requestedUrl) as string;

            log.debug('originalUrl from redis : ', originalUrl);
            if (!originalUrl) {
                log.debug('originalUrl IS NOT IN redis');
                const urlData = await this.urlRepository.findByShortUrl(requestedUrl);
                if (!urlData) {
                    throw ErrorMessages.URL_NOT_FOUND;
                }
                originalUrl = urlData.originalUrl;
                this.redisMemory.setInRedisWithExTime(requestedUrl, originalUrl, 2.628e+6);
            }
            // todo : send event to rabbit
            this.saveView(requestedUrl, viewData);
            return originalUrl
        } catch (e) {
            throw e;
        }
    }

    async saveView(requestedUrl: string, viewData: { isMobile: boolean, browserName: string, osName: string, userIp: string }) {
        const view = {
            userIp: viewData.userIp,
            url: requestedUrl,
            browser: viewData.browserName,
            os: viewData.isMobile ? 'Mobile' : 'Desktop',
        };
        this.viewService.createView(view)
    }

    static generateShortUrl(length) {
        // todo: improve it (hash)
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // return `${Math.random() * 10 * length}`
        // return new Array(length).fill(true).map(
        //     () => characterSet[Math.floor(Math.random() * characterSet.length)]
        // ).join("");
    }
}
