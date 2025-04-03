// todo
export const promiseAwaiter = async <T>(
  promises: Promise<T>[],
  maxPromisesCount = 5,
) => {
  const addedPromises: Promise<T>[] = [];
  const results: T[] = [];
  let processedPromisesCount = 0;
  let i = 0;

  while (processedPromisesCount !== promises.length) {
    for (; i < promises.length; i++) {
      if (addedPromises.length <= maxPromisesCount) {
        addedPromises.push(promises[i]);
        processedPromisesCount++;
      }
    }
    results.push(...(await Promise.all(addedPromises)));
  }

  return results;
};
