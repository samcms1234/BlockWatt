import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HousesModule } from './houses/houses.module';
import { ClustersModule } from './clusters/clusters.module';
import { EnergyModule } from './energy/energy.module';
import { BillingModule } from './billing/billing.module';
import { FabricService } from './blockchain/fabric.service';
import { FabricController } from './blockchain/fabric.controller';

@Module({
  imports: [HousesModule, ClustersModule, EnergyModule, BillingModule],
  controllers: [AppController, FabricController],
  providers: [AppService, FabricService],
})
export class AppModule {}
