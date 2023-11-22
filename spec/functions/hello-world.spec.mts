import functionUnderTest from '../../src/functions/hello-world.mjs';

describe("Hello World function", () => {

  it("should return the expected message", async () => {
    const response = await functionUnderTest();
    const text = await response.text();
    expect(text).toContain("Hello, world!");
  });

});
