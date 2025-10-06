// src/utils/apiErrorHandler.js
export const handleApiError = (error, fallbackData = null) => {
  console.error('API Error:', error);
  
  // Check for different error types
  if (error.message.includes('rate limit')) {
    return {
      error: 'Rate limit exceeded. Please try again later.',
      fallback: fallbackData
    };
  }
  
  if (error.message.includes('unauthorized')) {
    return {
      error: 'API key invalid or expired. Please check your credentials.',
      fallback: fallbackData
    };
  }
  
  return {
    error: 'Failed to fetch data. Using cached data if available.',
    fallback: fallbackData
  };
};
