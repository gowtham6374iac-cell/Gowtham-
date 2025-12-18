
import { URLFeatures } from '../types';

export const extractFeatures = (url: string): URLFeatures => {
  const hasAtSymbol = url.includes('@');
  const hasHttps = url.toLowerCase().startsWith('https://');
  const dotCount = (url.match(/\./g) || []).length;
  
  // Basic IP detection regex
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  let isIPAddress = false;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
    isIPAddress = ipRegex.test(urlObj.hostname);
  } catch {
    // If URL parsing fails, check the raw string for IP-like pattern
    isIPAddress = ipRegex.test(url);
  }

  return {
    url,
    length: url.length,
    hasAtSymbol,
    hasHttps,
    dotCount,
    isIPAddress
  };
};

export const calculateHeuristicRisk = (features: URLFeatures): number => {
  let score = 0;
  
  // Logic mimicking a simple weighted classifier
  if (features.length > 54) score += 20;
  if (features.length > 75) score += 15;
  if (features.hasAtSymbol) score += 25;
  if (!features.hasHttps) score += 20;
  if (features.dotCount > 3) score += 15;
  if (features.isIPAddress) score += 30;

  return Math.min(100, score);
};
