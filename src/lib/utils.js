const thrush = (x) => (f) => f(x);
const tap = (f) => (x) => {
  f(x);
  return x;
};
const pipe =
  (...functions) =>
  (x) =>
    functions.reduce((val, f) => f(val), x);

module.exports = { thrush, tap, pipe };
