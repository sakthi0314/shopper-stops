const allRoles = {
  user: ['crudReviews'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'manageReviews'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
