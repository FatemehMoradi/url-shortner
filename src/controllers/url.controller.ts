import {
    Authorized,
    Body, CurrentUser,
    Get,
    JsonController, Param,
    Post, Req, Res,
} from 'routing-controllers';
import {UrlService} from '../services/url.service';
import {CreateUrlDto} from "../serializers/createUrl.dto";
import {validate} from "../common/validators/validate";
import {UrlResponseDto} from "../serializers/urlResponse.dto";
import {AppRole} from "../common/enums/appRole.enum";
const browser = require('browser-detect');
// import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';


// @OpenAPI({ security: [{ basicAuth: [] }] })
@JsonController('/url')
export class UrlController {
    constructor(private urlService: UrlService) {
    }

    @Authorized([AppRole.CHECK_BEARER])
    @Post()
    public async create(@Body() body: CreateUrlDto, @CurrentUser() user?: any): Promise<UrlResponseDto> {
        await validate(body);
        return this.urlService.create(body, user);
    }

    @Get('/:requestedUrl')
    public async redirectUrl(@Param("requestedUrl") requestedUrl: string, @Req() request: any, @Res() response: any): Promise<any> {
        // {
        //     name: 'ie',
        //     version: '9.0',
        //     versionNumber: 9,
        //     mobile: false,
        //     os: 'Windows NT 10.0'
        // }
        const viewData = browser(request.headers['user-agent']);
        const userIp = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const originalUrl = await this.urlService.redirectUrl(requestedUrl, {
            isMobile: viewData.mobile,
            browserName: viewData.name,
            osName: viewData.os,
            userIp
        });
        response.redirect(originalUrl);
        return response;
    }
}
