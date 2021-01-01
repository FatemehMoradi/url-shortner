import {
    Authorized,
    CurrentUser,
    Get,
    JsonController, Param, QueryParam,
} from 'routing-controllers';
import {AppRole} from "../common/enums/appRole.enum";
import {ViewService} from "../services/view.service";
// import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';


// @OpenAPI({ security: [{ basicAuth: [] }] })
@JsonController('/analytic')
export class AnalyticController {
    constructor(private viewService: ViewService) {
    }

    @Authorized([AppRole.CHECK_BEARER])
    @Get('/views/:requestedUrl/all')
    public async getViews(@Param("requestedUrl") url: string, @QueryParam("time") time?: string, @CurrentUser() user?: any): Promise<any> {
        return await this.viewService.allViewCount(url, user.userId, time)
    }

    @Authorized([AppRole.CHECK_BEARER])
    @Get('/views/:requestedUrl/platform')
    public async getViewsByPlatform(@Param("requestedUrl") url: string, @QueryParam("time") time?: string, @CurrentUser() user?: any): Promise<any> {
        return await this.viewService.viewCountByPlatform(url, user.userId, time)
    }

    @Authorized([AppRole.CHECK_BEARER])
    @Get('/views/:requestedUrl/browser')
    public async getViewsByBrowser(@Param("requestedUrl") url: string, @QueryParam("time") time?: string, @CurrentUser() user?: any): Promise<any> {
        return await this.viewService.viewCountByBrowser(url, user.userId, time)
    }
}
