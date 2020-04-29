describe('Test EnvVar', () => {
  it('should NODE_ENV be test', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });
});
