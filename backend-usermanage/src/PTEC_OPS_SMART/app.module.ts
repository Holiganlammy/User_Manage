import { Module } from '@nestjs/common';
import { SmartBillController } from './controller/ptec_smart.controller';
import { SmartBillService } from './service/ptec_smart.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DatabaseManagerModule } from 'src/database/database-manager.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [SmartBillController],
  imports: [
    DatabaseManagerModule,
    MulterModule.register({
      dest: 'D:/files/smartBill/',
    }),
  ],
  providers: [
    SmartBillService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class PTEC_OPS_SMART_Module {}
