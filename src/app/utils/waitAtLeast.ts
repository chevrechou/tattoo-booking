export const waitAtLeast = async (promise: Promise<any>, minTime = 350) => {
  const start = Date.now();
  const result = await promise;
  const elapsed = Date.now() - start;

  if (elapsed < minTime) {
    await new Promise((res) => setTimeout(res, minTime - elapsed));
  }

  return result;
};
