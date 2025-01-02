import { TimeSeriesData, AnalyticsMetrics } from '@/types';

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const convertToCSV = (data: any[], headers: string[]) => {
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header] ?? '';
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

export const exportTimeSeriesData = (
  data: TimeSeriesData[],
  type: 'csv' | 'json',
  filename: string
) => {
  if (type === 'csv') {
    const headers = ['date', 'value'];
    const csv = convertToCSV(
      data.map(item => ({
        date: formatDate(item.date),
        value: item.value
      })),
      headers
    );
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  } else {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
};

export const exportMetrics = (
  metrics: AnalyticsMetrics,
  type: 'csv' | 'json',
  filename: string
) => {
  if (type === 'csv') {
    const headers = Object.keys(metrics);
    const csv = convertToCSV([metrics], headers);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
  } else {
    const json = JSON.stringify(metrics, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
};

export const exportFullReport = (
  metrics: AnalyticsMetrics,
  userActivity: TimeSeriesData[],
  postViews: TimeSeriesData[],
  serviceUsage: TimeSeriesData[],
  type: 'csv' | 'json',
  filename: string
) => {
  const report = {
    generatedAt: new Date().toISOString(),
    metrics,
    userActivity,
    postViews,
    serviceUsage
  };

  if (type === 'csv') {
    // Create separate sections for each data type
    const metricsCSV = convertToCSV([metrics], Object.keys(metrics));
    const userActivityCSV = convertToCSV(
      userActivity.map(item => ({
        date: formatDate(item.date),
        value: item.value
      })),
      ['date', 'value']
    );
    const postViewsCSV = convertToCSV(
      postViews.map(item => ({
        date: formatDate(item.date),
        value: item.value
      })),
      ['date', 'value']
    );
    const serviceUsageCSV = convertToCSV(
      serviceUsage.map(item => ({
        date: formatDate(item.date),
        value: item.value
      })),
      ['date', 'value']
    );

    const fullCSV = [
      'METRICS',
      metricsCSV,
      '\nUSER ACTIVITY',
      userActivityCSV,
      '\nPOST VIEWS',
      postViewsCSV,
      '\nSERVICE USAGE',
      serviceUsageCSV
    ].join('\n');

    downloadFile(fullCSV, `${filename}.csv`, 'text/csv');
  } else {
    const json = JSON.stringify(report, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
  }
};

const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
