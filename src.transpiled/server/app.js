"use strict";

var path = _interopRequireWildcard(require("path"));

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

let app = (0, _express.default)();

let bodyParser = require('body-parser');

var multer = require('multer'); // v1.0.5


var upload = multer(); // for parsing multipart/form-data

app.use(_express.default.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));

const routes = _express.default.Router();

routes.post('/records', upload.array(), function (req, res) {
  console.log("Yaaaaaay");
  console.log(req.body);
});
routes.use('/', _express.default.static(path.join('public')));
app.use('/', routes);
const port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
//# sourceMappingURL=app.js.map