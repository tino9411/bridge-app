// config/corsOptions.js

const allowedOrigins = [
    'http://localhost:3001',  // Your front-end origin
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
  };
  
  module.exports = corsOptions;
  