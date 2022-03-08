exports.mockRequest = (reqData = {}) => {
  return reqData;
};

exports.mockResponse = () => {
  type Response = {
    status?: jest.Mock<any, any>;
    json?: jest.Mock<any, any>;
  };

  const res: Response = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

exports.mockNext = jest.fn();
