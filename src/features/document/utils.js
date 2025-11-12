export const formatContributorName = (user) => {
  if (!user) return 'Unknown User';
  const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  return name ? `${name} (${user.username})` : user.username;
};
