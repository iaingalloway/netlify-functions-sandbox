import functionUnderTest from '../../../src/functions/parameterised/index.mjs';

describe('Parameterised function', () => {
  it('should respond correctly to a valid request', async () => {
    const mockRequest = {
      json: async () =>
        await Promise.resolve({
          Name: 'John',
          FavouriteNumber: 42,
          HighFive: true,
          DateOfBirth: '1990-01-01'
        })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(200);
  });

  it('should handle request with missing fields', async () => {
    const mockRequest = {
      json: async () => await Promise.resolve({ Name: 'John' })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(400);
  });
});
