import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ status: 200, description: 'Get dashboard data successfully' })
  async getDashboardData() {
    return await this.dashboardService.getDashboardData();
  }
  //get monthly stats

  @Get('/stats/monthly')
  @ApiOperation({ summary: 'Get monthly stats' })
  @ApiResponse({ status: 200, description: 'Get monthly stats successfully' })
  async getMonthlyStats() {
    return await this.dashboardService.getMonthlyStats();
  }

  //weekly stats
  @Get('/stats/weekly')
  @ApiOperation({ summary: 'Get weekly stats' })
  @ApiResponse({ status: 200, description: 'Get weekly stats successfully' })
  async getWeeklyStats() {
    return await this.dashboardService.getWeeklyStats();
  }

  //hourly stats
  @Get('/stats/hourly')
  @ApiOperation({ summary: 'Get hourly stats' })
  @ApiResponse({ status: 200, description: 'Get hourly stats successfully' })
  async getHourlyStats() {
    return await this.dashboardService.getHourlyStats();
  }
}
