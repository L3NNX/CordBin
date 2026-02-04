export const fakeUser = (req, res, next) => {
  // hardcoded test user id
  req.userId = "000000000000000000000001";
  next();
};
