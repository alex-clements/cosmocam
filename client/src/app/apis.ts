const apis_prod = {
  home: "https://www.alexsapiserver.com/",
  authenticate: "https://www.alexsapiserver.com/authenticate/",
  validateToken: "https://www.alexsapiserver.com/validateToken/",
  socket: "https://www.alexsapiserver.com:443",
};

const apis_dev = {
  home: "http://localhost/",
  authenticate: "http://localhost/authenticate/",
  validateToken: "http://localhost/validateToken/",
  socket: "http://localhost:3001",
};

export default process.env.NODE_ENV == "production" ? apis_prod : apis_dev;
