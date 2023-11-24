import functionUnderTest from '../../../src/functions/merge-url/index.mjs';
import MergeUrlDto from '../../../src/functions/merge-url/merge-url-dto.mjs';

describe('Parameterised function', () => {
  it('should respond correctly to a valid request', async () => {
    const mockRequest = {
      json: () =>
        Promise.resolve({
          TypeOfAnimal: 'cat',
          Name: 'Sushi'
        })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(200);
  });

  it('should handle request with missing fields', async () => {
    const mockRequest = {
      json: () => Promise.resolve({ Name: 'Sushi' })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(400);
  });

  it('should handle request with invalid fields', async () => {
    const mockRequest = {
      json: () =>
        Promise.resolve({
          TypeOfAnimal: 'cat',
          Name: 'Sushi',
          InvalidField: true
        })
    } as unknown as Request;

    const response = await functionUnderTest(mockRequest);
    expect(response.status).toBe(400);
  });

  it('should handle request with config from url', async () => {
    const mockRequest = {
      json: () =>
        Promise.resolve({
          ConfigUrl: '/some-config.json'
        }),
      url: 'https://example.com/'
    } as Request;

    const mockProvider = () =>
      Promise.resolve({
        TypeOfAnimal: 'cat',
        Name: 'Sushi'
      } as MergeUrlDto);

    const response = await functionUnderTest(mockRequest, mockProvider);
    expect(response.status).toBe(200);
  });
});
