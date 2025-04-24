import { Vendor, WaitTimeReport } from '../types/vendor';

// Calculate the current wait time from historical reports
export const calculateCurrentWaitTime = (reports: WaitTimeReport[]): number => {
  if (!reports || reports.length === 0) return 0;
  
  // Sort by time (most recent first)
  const sortedReports = [...reports].sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  
  // Consider only the 3 most recent reports
  const recentReports = sortedReports.slice(0, 3);
  
  // Calculate weighted average (more recent reports have higher weight)
  const weights = [0.6, 0.3, 0.1]; // 60%, 30%, 10% weights
  
  let totalWeight = 0;
  let weightedSum = 0;
  
  recentReports.forEach((report, index) => {
    if (index < weights.length) {
      weightedSum += report.waitTime * weights[index];
      totalWeight += weights[index];
    }
  });
  
  return Math.round(weightedSum / totalWeight);
};

// Add a new wait time report to a vendor
export const addWaitTimeReport = (
  vendor: Vendor, 
  waitTime: number, 
  userId: string
): Vendor => {
  const newReport: WaitTimeReport = {
    time: new Date().toISOString(),
    waitTime,
    userId
  };
  
  const updatedReports = [
    ...(vendor.waitTimeReports || []),
    newReport
  ];
  
  // Calculate new current wait time
  const currentWaitTime = calculateCurrentWaitTime(updatedReports);
  
  return {
    ...vendor,
    waitTimeReports: updatedReports,
    currentWaitTime
  };
};

// Get wait time text description
export const getWaitTimeDescription = (waitTime: number): string => {
  if (waitTime === 0) return 'No wait time data';
  if (waitTime <= 10) return 'Short wait';
  if (waitTime <= 20) return 'Quick service';
  if (waitTime <= 30) return 'Average wait';
  if (waitTime <= 45) return 'Long wait';
  return 'Very busy';
};

// Get time of day with highest/lowest wait times
export const getBestTimeToVisit = (visitData: Vendor['visitData']): { 
  bestDay: number; 
  bestHour: number;
  worstDay: number;
  worstHour: number;
} => {
  if (!visitData || visitData.length === 0) {
    return { bestDay: 0, bestHour: 8, worstDay: 5, worstHour: 19 };
  }
  
  // Find minimum and maximum visitor counts
  const minVisit = visitData.reduce((min, item) => 
    item.count < min.count ? item : min, visitData[0]);
  
  const maxVisit = visitData.reduce((max, item) => 
    item.count > max.count ? item : max, visitData[0]);
  
  return {
    bestDay: minVisit.day,
    bestHour: minVisit.hour,
    worstDay: maxVisit.day,
    worstHour: maxVisit.hour
  };
};

// Get the day name
export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

// Format hour (24h to 12h format)
export const formatHour = (hour: number): string => {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}; 