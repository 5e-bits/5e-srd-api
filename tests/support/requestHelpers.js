exports.mockRequest = (reqData = {}) => {
  return reqData;
};

exports.mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

exports.mockNext = jest.fn();
