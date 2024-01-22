import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
@Controller('dashboard')
@ApiTags('Dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/:company_id')
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiResponse({ status: 200, description: 'Get dashboard data successfully' })
  async getDashboardData(@Param('company_id') companyId: string) {
    return await this.dashboardService.getDashboardData(companyId);
  }
  //get monthly stats

  @Get('/:company_id/stats/monthly')
  @ApiOperation({ summary: 'Get monthly stats' })
  @ApiResponse({ status: 200, description: 'Get monthly stats successfully' })
  async getMonthlyStats(@Param('company_id') companyId: string) {
    return await this.dashboardService.getMonthlyStats(companyId);
  }

  //weekly stats
  @Get('/:company_id/stats/weekly')
  @ApiOperation({ summary: 'Get weekly stats' })
  @ApiResponse({ status: 200, description: 'Get weekly stats successfully' })
  async getWeeklyStats(@Param('company_id') companyId: string) {
    return await this.dashboardService.getWeeklyStats(companyId);
  }

  //hourly stats
  @Get('/:company_id/stats/hourly')
  @ApiOperation({ summary: 'Get hourly stats' })
  @ApiResponse({ status: 200, description: 'Get hourly stats successfully' })
  async getHourlyStats(@Param('company_id') companyId: string) {
    return await this.dashboardService.getHourlyStats(companyId);
  }
}
