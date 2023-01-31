import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ILoginData } from '@shared/interfaces/loginData';
import { DatabaseService } from 'src/services/database/database.service';
import { Users } from 'src/services/database/entities';
import { compare, hash } from 'bcrypt';
import { UnauthorizedExeption } from 'src/controllers/exeptions/UnauthorizedExeption';
import { sign, verify } from 'jsonwebtoken';
import { AES, enc } from 'crypto-js';
import { AuthGateway } from 'src/gateways/auth.gateway';
import { IAgentData } from '@shared/interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly databaseService: DatabaseService, private readonly authGateway: AuthGateway) {}

    @Post('login')
    async login(@Body() userData: ILoginData, @Res({ passthrough: true }) response: Response) {
        if (await this.verifyAccount(userData)) {
            const user: Users = await this.databaseService.userCollection.getOneModel({
                name: userData.username,
            });

            if (user == null || !(await compare(userData.password, user.password))) throw new UnauthorizedExeption('Falsches Password');

            const jwt_token = sign({ data: user.uuid }, "F2cb0NwqggyP89TS1E0JSgz4KHyUFQ3l", {
                expiresIn: '48h',
            });

            const token = AES.encrypt(jwt_token, "g1fVH1pa9FfpwyzHyEXYJcgI9P0VBtBe").toString();
            response.cookie('login_token', token);

            return {
                token: token,
                info: user,
            };
        }

        throw new UnauthorizedExeption('Falscher Username');
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('login_token');
        return { message: 'Logout erfolgreich' };
    }

    @Post('verify')
    async verify(@Body() data: { token: string }) {
        const aes_token: string = AES.decrypt(data.token, "g1fVH1pa9FfpwyzHyEXYJcgI9P0VBtBe").toString(enc.Utf8);
        const userUuid: { data: string } = verify(aes_token, "F2cb0NwqggyP89TS1E0JSgz4KHyUFQ3l") as { data: string };
        const user = await this.databaseService.userCollection.getOneModel({ uuid: userUuid.data });
        if (user != null) {
            const agent: IAgentData = {
                agentNumber: user.serviceNumber,
                _id: user._id.toString(),
                name: user.name,
                rank: user.rank,
                admin: user.admin,
                department: user.department,
                telefonNumber: user.telefonNumber,
                dutyTime: user.dutyTime,
                entryDate: user.entryDate.toLocaleDateString(),
                lastUprank: user.lastUprank.toLocaleDateString(),
                note: user.note,
                divisions: user.divisions,
                streaming: false
            };
            this.updateAgentList();
            this.updateCrimes();
            this.updateRecords();

            return agent;
        }

        return null;
    }

    async verifyAccount(data: ILoginData): Promise<boolean> {
        const userModel: Users = await this.databaseService.userCollection.getOneModel({
            name: data.username,
        });

        if (userModel == null) return false;

        return await compare(data.password, userModel.password);
    }

    private async updateCrimes() {
        const crimes = await this.databaseService.crimesCollection.getAllModels();

        this.authGateway.emit('initiliazeCrimes', crimes);
    }

    private async updateAgentList(): Promise<void> {
        const users = await this.databaseService.userCollection.getAllModels();
        let agents: IAgentData[] = [];

        users.forEach(user => {
            agents.push({
                _id: user._id.toString(),
                admin: user.admin,
                agentNumber: user.serviceNumber,
                department: user.department,
                dutyTime: user.dutyTime,
                entryDate: user.entryDate.toLocaleDateString(),
                lastUprank: user.lastUprank.toLocaleDateString(),
                name: user.name,
                note: user.note,
                rank: user.rank,
                telefonNumber: user.telefonNumber,
                divisions: user.divisions,
                streaming: false
            });
        });

        this.authGateway.emit('initializeAgents', agents);
    }

    async updateRecords() {
        const records = await this.databaseService.recordFilesCollection.getAllModels();

        this.authGateway.emit('initializeDocFiles', records);
    }
}
