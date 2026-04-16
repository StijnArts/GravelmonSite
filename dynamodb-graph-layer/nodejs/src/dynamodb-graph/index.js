const graph = require("./lib/graph");
const response = require("./lib/response");

module.exports = {
  ...graph,
  ...response,
};
