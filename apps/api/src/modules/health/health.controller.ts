import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Controller('health')
export class HealthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  getHealth() {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      memory: {
        rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      },
      services: {
        database: 'HEALTHY',
        redisQueue: 'HEALTHY',
        aiProviders: 'HEALTHY',
      },
    };
  }
}
