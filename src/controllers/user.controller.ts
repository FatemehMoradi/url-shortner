import {Body, JsonController, Post} from "routing-controllers";
import {validate} from "../common/validators/validate";
import {UserService} from "../services/user.service";
import {UserLoginDto} from "../serializers/userLogin.dto";
import {UserSignUpDto} from "../serializers/userSignUp.dto";


@JsonController("/user")
export class SupportController {
    constructor(
        private userService: UserService
    ) {
    }

    @Post('/signUp')
    public async signUp(@Body() body: UserSignUpDto): Promise<any> {
        await validate(body);
        return await this.userService.signUp(body);
    }

    @Post('/login')
    public async Login(@Body() body: UserLoginDto): Promise<any> {
        await validate(body);
        return this.userService.login(body);
    }
}
