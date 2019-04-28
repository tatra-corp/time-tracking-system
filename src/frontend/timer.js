export default class Timer extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this); // this is for 'this' working in this context.
        this.updateTimer = this.updateTimer.bind(this); // this is for 'this' working in this context.
        this.handleInputChange = this.handleInputChange.bind(this); // this is for 'this' working in this context.
        // is this clear?
        this.state = {
            interval: null,
            play: false,
            username: '',
            project_name: '',
            task_name: '',
            timer: '00:00:00'
        }
    }

    static validateForm() {
        return true
    }

    sendRecord(event, callback) {
        const message = new FormData();
        message.append('username', this.state.username);
        message.append('project_name', this.state.project_name);
        message.append('task_name', this.state.task_name);
        message.append('action', this.state.play ? 'start' : 'stop');
        if (!this.state.play) message.append('stop_time', (new Date()).getTime() / 1000);
        message.append('start_time', this.state.start.getTime() / 1000);

        const Http = new XMLHttpRequest();
        const url = '/records';
        Http.open('POST', url);
        Http.send(message);
        if (callback) callback()
    };

    handleSubmit(event) {
        event.preventDefault();
        if (Timer.validateForm()) {
            if (!this.state.interval) {
                this.setState({
                    play: true,
                    start: new Date(),
                    interval: setInterval(this.updateTimer, 1000)
                }, () => {
                    this.sendRecord(event)
                })
            } else {
                this.setState({
                    play: false
                }, () => {
                    this.sendRecord(event,
                        () => {
                            this.setState({
                                interval: null,
                                timer: '00:00:00'
                            })
                        })
                });
                clearInterval(this.state.interval)
            }
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        })
    }

    updateTimer() {
        this.setState({
            timer: getTimeDiff(this.state.start, new Date())
        })
    }

    render() { // we should add change handler for every field to keep internal state of HTML form and React component
        // consistent. But for now it works fine.
        return (<form id="timer" className="pane" name="timer" onSubmit={this.handleSubmit}>
            <label htmlFor="username">Your name:</label>
            <input type="text" id="username" name="username" value={this.state.username} minLength="5" required
                   readOnly={this.state.play} onChange={this.handleInputChange}/>

            <input id="button" className="button" type="image" src={this.state.play ? 'img/stop.jpg' : 'img/play.png'}
                   alt="Submit"/>

            <div id="time"> {this.state.timer} </div>

            <label htmlFor="project_name">Project title:</label>
            <input type="text" id="project_name" name="project_name" value={this.state.project_name} minLength="3"
                   required
                   readOnly={this.state.play} onChange={this.handleInputChange}/>

            <label htmlFor="task_name">Task name:</label>
            <input type="text" id="task_name" name="task_name" value={this.state.task_name} minLength="5" required
                   readOnly={this.state.play} onChange={this.handleInputChange}/>
        </form>)
    };
}
