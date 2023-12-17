export const paginate = (items, pageNumber, pageSize) => {
    const startIndex = (pageNumber - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  };
  
export const applyFilters = (requests, filters) => {
    let filteredRequests = [...requests];
  
    // Example filter by status
    if (filters.status) {
      filteredRequests = filteredRequests.filter(
        request => request.status === filters.status
      );
    }
  
    // Example filter by date range
    if (filters.startDate && filters.endDate) {
      filteredRequests = filteredRequests.filter(request => {
        const requestDate = new Date(request.createdAt);
        return requestDate >= new Date(filters.startDate) && requestDate <= new Date(filters.endDate);
      });
    }
  
    // Add more filters as needed based on the filters state
  
    return filteredRequests;
  };
 