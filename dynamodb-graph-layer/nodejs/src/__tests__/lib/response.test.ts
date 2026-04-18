import { successResponse, errorResponse } from '../../dynamodb-graph/lib/response';

describe('response functions', () => {
  describe('successResponse', () => {
    it('should return success response', () => {
      const body = { data: 'test' };
      const response = successResponse(body);

      expect(response).toEqual({
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });
  });

  describe('errorResponse', () => {
    it('should return error response', () => {
      const response = errorResponse(404, 'Not found');

      expect(response).toEqual({
        statusCode: 404,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: 'Not found' }),
      });
    });
  });
});