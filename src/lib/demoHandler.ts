export const handleDemo = async <T>(
  realFn: () => Promise<T>,
  mockFn: () => Promise<T>
): Promise<T> => {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const delay = Math.floor(Math.random() * 1000) + 500;
    await new Promise((res) => setTimeout(res, delay));
    return mockFn();
  }
  return realFn();
};
