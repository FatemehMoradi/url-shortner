
import {User} from "../models/user";
import {UserDto} from "../serializers/user.dto";

export class UserRepository {

    async findByUsername(username: string): Promise<UserDto> {
        const user = await User.findOne({username});
        console.log(user);
        return user;
    }

    async findByUserId(userId: string): Promise<UserDto> {
        const user = await User.findOne({userId});
        console.log(user);
        return user;
    }

    async createUser(userData: UserDto): Promise<UserDto> {
        console.log('create User : ', userData);
        const user = new User(userData);
        await user.save();
        console.log('new user', user);
        return user.toJSON();
    }
}
