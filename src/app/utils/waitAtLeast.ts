export const waitAtLeast = async <T>(promise: Promise<T>, minTime = 350): Promise<T> => {
  const start = Date.now();
  const result = await promise;
  const elapsed = Date.now() - start;

  if (elapsed < minTime) {
    await new Promise((res) => setTimeout(res, minTime - elapsed));
  }

  return result;
};
