exports.mockRequest = (reqData = {}) => {
  return reqData;
};

exports.mockResponse = () => {
  const res = {
    status: jest.fn().mockReturnValue({}),
    json: jest.fn().mockReturnValue({}),
  };
  return res;
};

exports.mockNext = jest.fn();
