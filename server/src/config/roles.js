const allRoles = {
  user: ['crudReviews', 'crudShippingAddress', 'crudCart', 'crudWishlist'],
  admin: ['getUsers', 'manageUsers', 'manageProducts', 'manageReviews', 'manageShippingAddress'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
