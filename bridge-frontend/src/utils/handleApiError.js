// utils/handleApiError.js
export function handleApiError(err) {
    console.error('API call failed:', err);
    return err?.response?.data?.error || 'Error occurred';
  }
  