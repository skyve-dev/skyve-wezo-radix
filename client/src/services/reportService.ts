import { api } from './api';

export interface ReportStats {
  period: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  properties: {
    total: number;
    active: number;
    inactive: number;
  };
  bookings: {
    total: number;
    byStatus: Record<string, number>;
    monthlyTrend: Record<string, number>;
  };
  revenue: {
    total: number;
    average: number;
  };
  occupancy: {
    rate: number;
    totalBookingDays: number;
    availableDays: number;
  };
  locations: Array<{
    location: string;
    count: number;
  }>;
  propertyViews: number;
  users?: {
    total: number;
    active: number;
    inactive: number;
  };
}

export interface RevenueReport {
  revenue: Array<{
    date: Date;
    amount: number;
    villaName: string;
    location: string;
  }>;
  total: number;
  count: number;
  average: number;
}

export interface PerformanceMetric {
  villaId: string;
  villaName: string;
  location: string;
  totalBookings: number;
  confirmedBookings: number;
  revenue: number;
  occupancyRate: number;
  averageBookingValue: number;
}

export class ReportService {
  /**
   * Fetch report statistics
   */
  static async getReportStats(
    period: '7d' | '30d' | '90d' | '1y' = '30d',
    userId?: string,
    role?: string
  ): Promise<ReportStats> {
    try {
      const params = new URLSearchParams({
        period,
        ...(userId && { userId }),
        ...(role && { role })
      });
      
      return await api.getReportStats(params.toString()) as ReportStats;
    } catch (error) {
      console.error('Error fetching report stats:', error);
      throw error;
    }
  }

  /**
   * Fetch revenue report
   */
  static async getRevenueReport(
    startDate?: Date,
    endDate?: Date,
    userId?: string,
    role?: string
  ): Promise<RevenueReport> {
    try {
      const params = new URLSearchParams({
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() }),
        ...(userId && { userId }),
        ...(role && { role })
      });
      
      return await api.getRevenueReport(params.toString()) as RevenueReport;
    } catch (error) {
      console.error('Error fetching revenue report:', error);
      throw error;
    }
  }

  /**
   * Fetch performance metrics
   */
  static async getPerformanceMetrics(
    villaId?: string,
    userId?: string,
    role?: string
  ): Promise<PerformanceMetric[]> {
    try {
      const params = new URLSearchParams({
        ...(villaId && { villaId }),
        ...(userId && { userId }),
        ...(role && { role })
      });
      
      return await api.getPerformanceMetrics(params.toString()) as PerformanceMetric[];
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate trends from historical data
   */
  static calculateTrend(current: number, previous: number): { value: string; trend: 'up' | 'down' | 'neutral' } {
    if (previous === 0) {
      return { value: current > 0 ? '+100%' : '0%', trend: current > 0 ? 'up' : 'neutral' };
    }
    
    const change = ((current - previous) / previous) * 100;
    const value = change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return { value, trend };
  }
}