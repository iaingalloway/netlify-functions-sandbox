import NestedParameterDto from '../../src/functions/nested-parameter-dto.mjs';
import fetchParametersFromUrl from '../../src/functions/parameters-provider.mjs';

const baseUrl = 'https://example.com';

class TestDto implements NestedParameterDto {
  ConfigUrl?: string;
  finalData?: string;
  otherData?: string;
}

const mockDataUrl = '/mock-data.json';
const mockData = { finalData: 'value', otherData: 'value' } as TestDto;

const mockNestedDataUrl = '/mock-nested-data.json';
const mockNestedData = { finalData: 'finalValue' } as TestDto;

const mockDataWithNestedUrl = '/mock-data-with-nested.json';
const mockDataWithNested = {
  ConfigUrl: mockNestedDataUrl,
  otherData: 'value'
} as TestDto;

const mockNestedOverrideUrl = '/mock-nested-override.json';
const mockNestedOverride = { finalData: 'overriddenValue' } as TestDto;

const mockDataWithNestedOverrideUrl = '/mock-data-with-nested-override.json';
const mockDataWithNestedOverride = {
  ConfigUrl: mockNestedOverrideUrl,
  finalData: 'value',
  otherData: 'value'
} as TestDto;

const mockHttpClient = jasmine.createSpy('httpJsonClient').and.callFake(url => {
  if (url == `${baseUrl}${mockDataUrl}`) {
    return Promise.resolve(mockData);
  } else if (url == `${baseUrl}${mockNestedDataUrl}`) {
    return Promise.resolve(mockNestedData);
  } else if (url == `${baseUrl}${mockDataWithNestedUrl}`) {
    return Promise.resolve(mockDataWithNested);
  } else if (url == `${baseUrl}${mockNestedOverrideUrl}`) {
    return Promise.resolve(mockNestedOverride);
  } else if (url == `${baseUrl}${mockDataWithNestedOverrideUrl}`) {
    return Promise.resolve(mockDataWithNestedOverride);
  }
  throw Error('Unexpected URL');
});

describe('fetchParametersFromUrl', () => {
  beforeEach(() => {
    mockHttpClient.calls.reset();
  });

  it('should fetch data from URL', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataUrl,
      1,
      mockHttpClient
    );

    expect(result).toEqual(mockData);
    expect(mockHttpClient).toHaveBeenCalledWith(
      'https://example.com/mock-data.json'
    );
  });

  it('should handle nested URLs up to the specified max depth', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataWithNestedUrl,
      2,
      mockHttpClient
    );

    expect(result).toEqual({ ...mockDataWithNested, ...mockNestedData });
    expect(mockHttpClient.calls.allArgs()).toEqual([
      ['https://example.com/mock-data-with-nested.json'],
      ['https://example.com/mock-nested-data.json']
    ]);
  });

  it('should not fetch nested URLs deeper than the specified max depth', async () => {
    const result = await fetchParametersFromUrl(
      baseUrl,
      mockDataWithNestedUrl,
      1,
      mockHttpClient
    );

    expect(result).toEqual(mockDataWithNested);
    expect(mockHttpClient).toHaveBeenCalledOnceWith(
      'https://example.com/mock-data-with-nested.json'
    );
  });

  it('should merge nested URLs in the correct order', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataWithNestedOverrideUrl,
      3,
      mockHttpClient
    );

    expect(result).toEqual({
      ...mockDataWithNestedOverride,
      ...mockNestedOverride
    });
    expect(result.finalData).toEqual('overriddenValue');
    expect(mockHttpClient.calls.allArgs()).toEqual([
      ['https://example.com/mock-data-with-nested-override.json'],
      ['https://example.com/mock-nested-override.json']
    ]);
  });
});
