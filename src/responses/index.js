const successResponse = (res, message, data) => {
  res.status(200).json({
    status: "ok",
    statusCode: 200,
    isSuccess: true,
    message: message,
    data: data,
    error: null,
  });
};

const internalServerErrorResponse = async (res, err) => {
  await res.status(500).json({
    status: "ok",
    statusCode: 500,
    isSuccess: false,
    message: "Internal server error",
    data: null,
    error: err,
  });
};

const conflictErrorResponse = (res, message) => {
  res.status(200).json({
    status: "ok",
    statusCode: 409,
    isSuccess: false,
    message: message,
    data: null,
    error: "conflict",
  });
};

const badRequestResponse = (res, err) => {
  res.status(200).json({
    status: "ok",
    statusCode: 400,
    isSuccess: false,
    message: err,
    data: null,
    error: "Bad Request Error is occured",
  });
};

const unauthorizedResponse = (res, message) => {
  res.status(401).json({
    status: "unauthorized",
    statusCode: 401,
    isSuccess: false,
    message: message,
    data: null,
    error: null,
  });
};
module.exports = {
  successResponse,
  internalServerErrorResponse,
  conflictErrorResponse,
  badRequestResponse,
  unauthorizedResponse,
};
