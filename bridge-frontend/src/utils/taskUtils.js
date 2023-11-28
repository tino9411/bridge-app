//taskUtils.js
// Sorting function for tasks
export const sortTasks = (tasks, sortField) => {
    if (sortField === "rate") {
      return tasks.sort((a, b) => (a.rate || 0) - (b.rate || 0));
    } else if (sortField === "dueDate") {
      return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }
    else if (sortField === "default") {
      return tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
  };
  
  // Filtering function for tasks
  export const filterTasks = (tasks, filterStatus) => {
    return tasks.filter((task) => filterStatus ? task.status === filterStatus : true);
  };
  