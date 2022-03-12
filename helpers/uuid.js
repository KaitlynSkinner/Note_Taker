// Export
module.exports = () =>
// Function that generates a string of random numbers and letters.
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
