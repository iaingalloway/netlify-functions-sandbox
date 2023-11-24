import type NestedParameterDto from '../../src/functions/nested-parameter-dto.mjs';
import fetchParametersFromUrl from '../../src/functions/parameters-provider.mjs';

const baseUrl = 'https://example.com';

class TestDto implements NestedParameterDto {
  ConfigUrl?: string;
  finalData?: string;
  otherData?: string;
}

const mockDataUrl = '/mock-data.json';
const mockData = { finalData: 'value', otherData: 'value' };

const mockNestedDataUrl = '/mock-nested-data.json';
const mockNestedData = { finalData: 'finalValue' };

const mockDataWithNestedUrl = '/mock-data-with-nested.json';
const mockDataWithNested = {
  ConfigUrl: mockNestedDataUrl,
  otherData: 'value'
};

const mockNestedOverrideUrl = '/mock-nested-override.json';
const mockNestedOverride = { finalData: 'overriddenValue' };

const mockDataWithNestedOverrideUrl = '/mock-data-with-nested-override.json';
const mockDataWithNestedOverride = {
  ConfigUrl: mockNestedOverrideUrl,
  finalData: 'value',
  otherData: 'value'
};

const mockClient = jasmine
  .createSpy('httpJsonClient')
  .and.callFake(async url => {
    if (url === `${baseUrl}${mockDataUrl}`) {
      return await Promise.resolve(mockData);
    } else if (url === `${baseUrl}${mockNestedDataUrl}`) {
      return await Promise.resolve(mockNestedData);
    } else if (url === `${baseUrl}${mockDataWithNestedUrl}`) {
      return await Promise.resolve(mockDataWithNested);
    } else if (url === `${baseUrl}${mockNestedOverrideUrl}`) {
      return await Promise.resolve(mockNestedOverride);
    } else if (url === `${baseUrl}${mockDataWithNestedOverrideUrl}`) {
      return await Promise.resolve(mockDataWithNestedOverride);
    }
    throw Error('Unexpected URL');
  });

describe('fetchParametersFromUrl', () => {
  beforeEach(() => {
    mockClient.calls.reset();
  });

  it('should fetch data from URL', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataUrl,
      1,
      mockClient
    );

    expect(result).toEqual(mockData);
    expect(mockClient).toHaveBeenCalledWith(
      'https://example.com/mock-data.json'
    );
  });

  it('should handle nested URLs up to the specified max depth', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataWithNestedUrl,
      2,
      mockClient
    );

    expect(result).toEqual({ ...mockDataWithNested, ...mockNestedData });
    expect(mockClient.calls.allArgs()).toEqual([
      ['https://example.com/mock-data-with-nested.json'],
      ['https://example.com/mock-nested-data.json']
    ]);
  });

  it('should not fetch nested URLs deeper than the specified max depth', async () => {
    const result = await fetchParametersFromUrl(
      baseUrl,
      mockDataWithNestedUrl,
      1,
      mockClient
    );

    expect(result).toEqual(mockDataWithNested);
    expect(mockClient).toHaveBeenCalledOnceWith(
      'https://example.com/mock-data-with-nested.json'
    );
  });

  it('should merge nested URLs in the correct order', async () => {
    const result = await fetchParametersFromUrl<TestDto>(
      baseUrl,
      mockDataWithNestedOverrideUrl,
      3,
      mockClient
    );

    expect(result).toEqual({
      ...mockDataWithNestedOverride,
      ...mockNestedOverride
    });
    expect(result?.finalData).toEqual('overriddenValue');
    expect(mockClient.calls.allArgs()).toEqual([
      ['https://example.com/mock-data-with-nested-override.json'],
      ['https://example.com/mock-nested-override.json']
    ]);
  });
});
