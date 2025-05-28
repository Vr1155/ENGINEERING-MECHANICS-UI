
export default {
  setGlobalHandler: (callback: (error: Error, isFatal?: boolean) => void) => {
    const previousHandler = RNErrorUtils.getGlobalHandler();
    RNErrorUtils.setGlobalHandler((error, isFatal) => {
      callback(error, isFatal);
    });
    return previousHandler;
  },
  getGlobalHandler: RNErrorUtils.getGlobalHandler,
};