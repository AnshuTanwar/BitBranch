// Issue transformation utilities

export const transformIssueStatus = (status) => {
  const statusMap = {
    'open': 'Open',
    'closed': 'Closed',
    'in-progress': 'In Progress',
    'resolved': 'Resolved',
    'pending': 'Pending'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    'open': 'destructive',
    'closed': 'secondary', 
    'in-progress': 'default',
    'resolved': 'success',
    'pending': 'warning'
  };
  return colorMap[status] || 'secondary';
};

export const getStatusIcon = (status) => {
  const iconMap = {
    'open': 'AlertCircle',
    'closed': 'CheckCircle2',
    'in-progress': 'Clock',
    'resolved': 'CheckCircle',
    'pending': 'Timer'
  };
  return iconMap[status] || 'AlertCircle';
};

export const getPriorityColor = (priority) => {
  const colorMap = {
    'low': 'secondary',
    'medium': 'default', 
    'high': 'destructive',
    'critical': 'destructive'
  };
  return colorMap[priority] || 'default';
};

export const transformIssueForDisplay = (issue) => {
  if (!issue) return null;
  
  return {
    ...issue,
    statusDisplay: transformIssueStatus(issue.status),
    statusColor: getStatusColor(issue.status),
    priorityColor: getPriorityColor(issue.priority),
    createdAtFormatted: issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '',
    updatedAtFormatted: issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString() : ''
  };
};

export const filterIssuesByStatus = (issues, status) => {
  if (!issues || !Array.isArray(issues)) return [];
  if (!status) return issues;
  
  return issues.filter(issue => issue.status === status);
};

export const filterIssuesByPriority = (issues, priority) => {
  if (!issues || !Array.isArray(issues)) return [];
  if (!priority) return issues;
  
  return issues.filter(issue => issue.priority === priority);
};

export const sortIssuesByDate = (issues, order = 'desc') => {
  if (!issues || !Array.isArray(issues)) return [];
  
  return [...issues].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
};

export const groupIssuesByStatus = (issues) => {
  if (!issues || !Array.isArray(issues)) return {};
  
  return issues.reduce((groups, issue) => {
    const status = issue.status || 'unknown';
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(issue);
    return groups;
  }, {});
};
