// import React, {Component} from 'react'
// import ReactDOM from 'react-dom'

function getTimeDiff (date1, date2) {
  // console.log(date1);
  // console.log(date2);
  const diff = new Date(date2.getTime() - date1.getTime())
  return `${(`0${diff.getUTCHours()}`).slice(-2)}:${
    (`0${diff.getMinutes()}`).slice(-2)}:${
    (`0${diff.getSeconds()}`).slice(-2)}`
}

class Timer extends React.Component {
  constructor () {
    super()
    this.sendRecord = this.sendRecord.bind(this) // this is for 'this' working in this context.
    // is this clear?
    this.state = {
      interval: null
    }
  }

  setInputsLocked (isLocked) {
    const form = document.forms.record
    form.username.readOnly = isLocked
    form.project_name.readOnly = isLocked
    form.task_name.readOnly = isLocked
  }

  validateForm () {
    return true
  }

  sendRecord () {
    const data = new FormData(document.forms.record)
    data.append('action', this.state.play ? 'start' : 'stop')
    if (this.state.play) data.append('stop_time', (new Date()).getTime() / 1000)
    data.append('start_time', start.getTime() / 1000)
    data.delete('x')
    data.delete('y')
    data.delete('time') // we already sending unix time;

    const Http = new XMLHttpRequest()
    const url = '/records'
    Http.open('POST', url)
    Http.send(data)
  };

  handleSubmit (e) {
    e.preventDefault()
    if (this.validateForm()) {
      if (!this.state.interval) {
        this.setState({
          play: true,
          start: new Date()
        })
        this.sendRecord()
        this.setState({
          interval: setInterval(this.render, 1000)
        })
        this.setInputsLocked(true)
      } else {
        this.sendRecord()
        clearInterval(this.state.interval)
        this.setState({
          play: false,
          start: new Date(),
          interval: null
        })
        this.setInputsLocked(false)
      }
    }
  }

  render () {
    return (<div id="timer">
      <form id="record" className="pane" name="record" onSubmit={this.handleSubmit}>
        <label htmlFor="username">Your name:</label>
        <input type="text" id="username" name="username" minLength="5" required/>

        <input id="button" className="button" type="image" src={this.state.play ? 'img/stop.jpg' : 'img/start.png'}
               alt="Submit"/>

        <label htmlFor="time"/>
        <input type="text" id="time" name="time" value={getTimeDiff(this.state.start, new Date())} readOnly/>

        <label htmlFor="project_name">Project title:</label>
        <input type="text" id="project_name" name="project_name" minLength="3" required/>

        <label htmlFor="task_name">Task name:</label>
        <input type="text" id="task_name" name="task_name" minLength="5" required/>
      </form>
    </div>)
  };
}

class Record extends React.Component {
  updateTime () {
    this.setState({
      stop: new Date()
    })
  }

  constructor () {
    super()
    this.state = {
      record_id: this.props.id,
      stop: (this.props.stop ? this.props.stop : new Date())
    }
    if (!this.props.stop)
      setInterval(this.updateTime, 1000)
  }

  render () {
    return (<tr className="table_record" style="display: none">
      <td className="table_time">{getTimeDiff(this.props.start, this.state.stop)}</td>
      // yeah, it's a little messy.
      <td className="table_user">{this.props.user}</td>
      <td className="table_project">{this.props.project}</td>
      <td className="table_task">{this.props.task}</td>
    </tr>)
  }
}

class RecordsTable extends React.Component {

  constructor () {
    super()
    this.state = {
      records: []
    }
  }

  getRecords (offset, limit) {
    const Http = new XMLHttpRequest()
    const url = `/records?offset=${offset}&limit=${limit}`
    Http.open('GET', url)
    Http.send()
    Http.onload = () => {
      if (Http.status === 200) {
        const records = JSON.parse(Http.responseText)
        this.setState((prev) => {
          records: [...prev.records, ...records]
        })
      } else {
        console.error(`Muhaha, I lied, I will log into console till I die!\nResponse status: ${Http.status}`)
      }
    }
  }

  getMoreRecords () {
    this.getRecords(this.state.records.length, 10)
  }

  componentDidMount () {
    this.getMoreRecords()
  }

  render () {
    this.getRecords(0, this.props.initialLength)
    return (<div id="records_table">
      <table style="width:100%">
        <tr className="table_header">
          <th>Time</th>
          <th>Username</th>
          <th>Project</th>
          <th>Task</th>
        </tr>
        {
          this.state.records.map((record) => {
            return (
              <Record key={record.id} user={record.student} start={record.start} stop={record.stop}
                      project={record.project}
                      task={record.task}/>)
          })
        }
      </table>
      <div id="load-more">
        <button onClick={this.getMoreRecords}>
          Load more
        </button>
      </div>
    </div>)
  }
}

console.log('wtf')
  console.log('wtf')
  try {
    ReactDOM.render(<div className="wholesite">
      <Timer/>
      <RecordsTable initialLength={10}/>
    </div>, document.getElementById('root'))
  } catch (e) {
    console.error(e)
  }
