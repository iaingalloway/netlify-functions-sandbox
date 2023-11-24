import functionUnderTest from '../../../src/functions/merge-url/index.mjs';

describe('Parameterised function', () => {
  it('should respond correctly to a valid request', async () => {
    const mockRequest = {
      json: async () =>
        await Promise.resolve({
          TypeOfAnimal: 'cat',
          Name: 'Sushi'
        })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(200);
  });

  it('should handle request with missing fields', async () => {
    const mockRequest = {
      json: async () => await Promise.resolve({ Name: 'Sushi' })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(400);
  });

  it('should handle request with invalid fields', async () => {
    const mockRequest = {
      json: async () =>
        await Promise.resolve({
          TypeOfAnimal: 'cat',
          Name: 'Sushi',
          InvalidField: true
        })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(400);
  });

  it('should handle request with config from url', async () => {
    const mockRequest = jasmine.createSpyObj('request', ['json', 'url']);
    mockRequest.json.and.returnValue(
      Promise.resolve({ ConfigUrl: '/some-config.json' })
    );
    mockRequest.url = 'https://example.com';

    const mockProvider = jasmine
      .createSpy('parametersProvider')
      .and.callFake(async () => {
        return await Promise.resolve({ TypeOfAnimal: 'cat', Name: 'Sushi' });
      });

    const response = await functionUnderTest(mockRequest, mockProvider);
    expect(response.status).toBe(200);
  });
});
