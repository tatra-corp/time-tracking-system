/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/frontend/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/frontend/main.js":
/*!******************************!*\
  !*** ./src/frontend/main.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _timer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./timer.js */ \"./src/frontend/timer.js\");\n\n\nfunction getTimeDiff(date1, date2) {\n  const diff = new Date(date2.getTime() - date1.getTime());\n  return `${`0${diff.getUTCHours()}`.slice(-2)}:${`0${diff.getMinutes()}`.slice(-2)}:${`0${diff.getSeconds()}`.slice(-2)}`;\n}\n\nclass Record extends React.Component {\n  updateTime() {\n    this.setState({\n      stop: new Date()\n    });\n  }\n\n  constructor(props) {\n    super(props);\n    this.state = {};\n\n    if (this.props.stop === undefined) {\n      this.state.stop = new Date();\n      this.updateTime = this.updateTime.bind(this);\n      setInterval(this.updateTime, 1000);\n    } else this.state.stop = this.props.stop;\n  }\n\n  render() {\n    return React.createElement(\"tr\", {\n      className: \"table_record\"\n    }, React.createElement(\"td\", {\n      className: \"table_time\"\n    }, getTimeDiff(this.props.start, this.state.stop)), React.createElement(\"td\", {\n      className: \"table_user\"\n    }, this.props.user), React.createElement(\"td\", {\n      className: \"table_project\"\n    }, this.props.project), React.createElement(\"td\", {\n      className: \"table_task\"\n    }, this.props.task));\n  }\n\n}\n\nclass RecordsTable extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      records: []\n    };\n    this.getMoreRecords = this.getMoreRecords.bind(this); // this is for 'this' working in this context.\n  }\n\n  getRecords(offset, limit) {\n    const Http = new XMLHttpRequest();\n    const url = `/records?offset=${offset}&limit=${limit}`;\n    Http.open('GET', url);\n    Http.send();\n\n    Http.onload = () => {\n      if (Http.status === 200) {\n        const records = JSON.parse(Http.responseText);\n        this.setState(state => {\n          return {\n            records: [...state.records, ...records]\n          };\n        });\n      } else {\n        console.error(`Muhaha, I lied, I will log into console till I die!\\nResponse status: ${Http.status}`);\n      }\n    };\n  }\n\n  getMoreRecords() {\n    this.getRecords(this.state.records.length, 10);\n  }\n\n  componentDidMount() {\n    this.getMoreRecords();\n  }\n\n  render() {\n    return React.createElement(\"div\", {\n      id: \"records_table\"\n    }, React.createElement(\"table\", {\n      style: {\n        'width': '100%'\n      }\n    }, React.createElement(\"tbody\", null, React.createElement(\"tr\", {\n      className: \"table_header\"\n    }, React.createElement(\"th\", null, \"Time\"), React.createElement(\"th\", null, \"Username\"), React.createElement(\"th\", null, \"Project\"), React.createElement(\"th\", null, \"Task\")), this.state.records.map(record => {\n      return React.createElement(Record, {\n        key: record.id,\n        user: record.student,\n        start: new Date(record.start),\n        stop: record.stop ? new Date(record.stop) : undefined,\n        project: record.project,\n        task: record.task\n      });\n    }))), React.createElement(\"div\", {\n      id: \"load-more\"\n    }, React.createElement(\"button\", {\n      onClick: this.getMoreRecords\n    }, \"Load more\")));\n  }\n\n}\n\ntry {\n  ReactDOM.render(React.createElement(\"div\", null, React.createElement(_timer_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"], null), React.createElement(RecordsTable, {\n    initialLength: 10\n  })), document.getElementById('root'));\n} catch (e) {\n  console.error(e);\n}\n\n//# sourceURL=webpack:///./src/frontend/main.js?");

/***/ }),

/***/ "./src/frontend/timer.js":
/*!*******************************!*\
  !*** ./src/frontend/timer.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Timer; });\nfunction getTimeDiff(date1, date2) {\n  const diff = new Date(date2.getTime() - date1.getTime());\n  return `${`0${diff.getUTCHours()}`.slice(-2)}:${`0${diff.getMinutes()}`.slice(-2)}:${`0${diff.getSeconds()}`.slice(-2)}`;\n}\n\nclass Timer extends React.Component {\n  constructor() {\n    super();\n    this.handleSubmit = this.handleSubmit.bind(this); // this is for 'this' working in this context.\n\n    this.updateTimer = this.updateTimer.bind(this); // this is for 'this' working in this context.\n\n    this.handleInputChange = this.handleInputChange.bind(this); // this is for 'this' working in this context.\n\n    this.handleUserChange = this.handleUserChange.bind(this); // this is for 'this' working in this context.\n\n    this.handleProjectChange = this.handleProjectChange.bind(this); // this is for 'this' working in this context.\n    // is this clear?\n\n    this.state = {\n      interval: null,\n      play: false,\n      username: 'default',\n      project: 'default',\n      task: 'default',\n      timer: '00:00:00',\n      users: [],\n      projects: [],\n      tasks: []\n    };\n  }\n\n  downloadUsers() {\n    const request = new XMLHttpRequest();\n    const url = '/users_list';\n    request.open('GET', url);\n\n    request.onreadystatechange = () => {\n      if (request.readyState === 4 && request.status === 200) {\n        this.setState({\n          users: JSON.parse(request.responseText)\n        });\n      }\n    };\n\n    request.send();\n  }\n\n  downloadProjects() {\n    const request = new XMLHttpRequest();\n    const url = `/projects_list?user=${this.state.username}`;\n    request.open('GET', url);\n\n    request.onreadystatechange = () => {\n      if (request.readyState === 4 && request.status === 200) {\n        this.setState({\n          projects: JSON.parse(request.responseText)\n        });\n      }\n    };\n\n    request.send();\n  }\n\n  downloadTasks() {\n    const request = new XMLHttpRequest();\n    const url = `/tasks_list?project=${this.state.project}`;\n    request.open('GET', url);\n\n    request.onreadystatechange = () => {\n      if (request.readyState === 4 && request.status === 200) {\n        this.setState({\n          tasks: JSON.parse(request.responseText)\n        });\n      }\n    };\n\n    request.send();\n  }\n\n  componentDidMount() {\n    this.downloadUsers();\n  }\n\n  static validateForm() {\n    return true;\n  }\n\n  sendRecord(event, callback) {\n    const message = new FormData();\n    message.append('username', this.state.username);\n    message.append('project', this.state.project);\n    message.append('task', this.state.task);\n    message.append('action', this.state.play ? 'start' : 'stop');\n    if (!this.state.play) message.append('stop_time', new Date().getTime() / 1000);\n    message.append('start_time', this.state.start.getTime() / 1000);\n    const Http = new XMLHttpRequest();\n    const url = '/records';\n    Http.open('POST', url);\n    Http.send(message);\n    if (callback) callback();\n  }\n\n  handleSubmit(event) {\n    event.preventDefault();\n\n    if (Timer.validateForm()) {\n      if (!this.state.interval) {\n        this.setState({\n          play: true,\n          start: new Date(),\n          interval: setInterval(this.updateTimer, 1000)\n        }, () => {\n          this.sendRecord(event);\n        });\n      } else {\n        this.setState({\n          play: false\n        }, () => {\n          this.sendRecord(event, () => {\n            this.setState({\n              interval: null,\n              timer: '00:00:00'\n            });\n          });\n        });\n        clearInterval(this.state.interval);\n      }\n    }\n  }\n\n  handleUserChange(event) {\n    this.setState({\n      [event.target.name]: event.target.value\n    }, () => {\n      this.downloadProjects();\n    });\n  }\n\n  handleProjectChange(event) {\n    this.setState({\n      [event.target.name]: event.target.value\n    }, () => {\n      this.downloadTasks();\n      console.log(this.state);\n    });\n  }\n\n  handleInputChange(event) {\n    const target = event.target;\n    const name = target.name;\n    const value = target.value;\n    this.setState({\n      [name]: value\n    });\n  }\n\n  updateTimer() {\n    this.setState({\n      timer: getTimeDiff(this.state.start, new Date())\n    });\n  }\n\n  render() {\n    // we should add change handler for every field to keep internal state of HTML form and React component\n    // consistent. But for now it works fine.\n    return React.createElement(\"form\", {\n      id: \"timer\",\n      className: \"pane\",\n      name: \"timer\",\n      onSubmit: this.handleSubmit\n    }, React.createElement(\"label\", {\n      htmlFor: \"username\"\n    }, \"Your name:\"), React.createElement(\"select\", {\n      id: \"username\",\n      name: \"username\",\n      value: this.state.username,\n      disabled: this.state.play,\n      required: true,\n      onChange: this.handleUserChange\n    }, React.createElement(\"option\", {\n      hidden: true,\n      disabled: true,\n      selected: true,\n      value: \"default\"\n    }, \" -- select an option --\"), this.state.users.map(username => {\n      return React.createElement(\"option\", {\n        value: username\n      }, username);\n    })), React.createElement(\"input\", {\n      id: \"button\",\n      className: \"button\",\n      type: \"image\",\n      src: this.state.play ? 'img/stop.jpg' : 'img/play.png',\n      alt: \"Submit\"\n    }), React.createElement(\"div\", {\n      id: \"time\"\n    }, \" \", this.state.timer, \" \"), React.createElement(\"label\", {\n      htmlFor: \"project\"\n    }, \"Project title:\"), React.createElement(\"select\", {\n      id: \"project\",\n      name: \"project\",\n      value: this.state.project,\n      disabled: this.state.play,\n      required: true,\n      onChange: this.handleProjectChange\n    }, React.createElement(\"option\", {\n      hidden: true,\n      disabled: true,\n      selected: true,\n      value: \"default\"\n    }, \" -- select an option --\"), this.state.projects.map(project => {\n      return React.createElement(\"option\", {\n        value: project\n      }, project);\n    })), React.createElement(\"label\", {\n      htmlFor: \"task\"\n    }, \"Task name:\"), React.createElement(\"select\", {\n      id: \"task\",\n      name: \"task\",\n      value: this.state.task,\n      disabled: this.state.play,\n      required: true,\n      onChange: this.handleInputChange\n    }, React.createElement(\"option\", {\n      hidden: true,\n      disabled: true,\n      selected: true,\n      value: \"default\"\n    }, \" -- select an option --\"), this.state.tasks.map(task => {\n      return React.createElement(\"option\", {\n        value: task\n      }, task);\n    })));\n  }\n\n}\n\n//# sourceURL=webpack:///./src/frontend/timer.js?");

/***/ })

/******/ });