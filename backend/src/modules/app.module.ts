import { InfoController } from './../controllers/info.controller';
import { VehicleGateway } from './../gateways/vehicle.gateway';
import { UnitGateway } from './../gateways/unit.gateway';
import { UnitController } from './../controllers/unit.controller';
import { AuthController } from '../controllers/auth.controller';
import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { DatabaseService } from '../services/database/database.service';
import { InfoGateway } from 'src/gateways/info.gateway';
import { AuthGateway } from 'src/gateways/auth.gateway';
import { AgentGateway } from 'src/gateways/agent.gateway';
import { AgentController } from 'src/controllers/agent.controller';
import { CrimesController } from 'src/controllers/crimes.controller';
import { CrimesGateway } from 'src/gateways/crimes.gateway';
import { AdminController } from 'src/controllers/admin.controller';
import { DocController } from 'src/controllers/doc.controller';
import { DocGateway } from 'src/gateways/doc.gateway';
import { FactionsController } from 'src/controllers/factions.controllers';
import { FactionsGateway } from 'src/gateways/factions.gateway';
import {LiabilityController} from "../controllers/liability.controller";
import {LiabilityGateway} from "../gateways/liability.gateway";

@Module({
    imports: [],
    controllers: [InfoController, UnitController, AuthController, AgentController, CrimesController, AdminController, DocController, FactionsController, LiabilityController, AppController],
    providers: [VehicleGateway, UnitGateway, InfoGateway, AuthGateway, AgentGateway, CrimesGateway, DocGateway, FactionsGateway, LiabilityGateway, DatabaseService],
})
export class AppModule {}
