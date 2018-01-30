class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			chartData: this.props.data[0]
		};
	}

	setSelectedDay = data => {
		this.setState({chartData: data});
	}

	render(){

		const days = [];
		this.props.data.forEach((day, index) => {
			days.push(<Day data={day} setSelectedDay={this.setSelectedDay} />);
		});

		return (
			<div>
				{days}
				<Chart data={this.state.chartData}/>
			</div>
		)
	}
};


class Day extends React.Component {
	constructor(props){
		super(props);
	}

	handleClick = () => {
		this.props.setSelectedDay(this.props.data);
	}

	render(){
		return (
			<div className="Day" onClick={this.handleClick}>
				<h2 className="dayTitle">{this.props.data.day}</h2>
				<img className="icon" src={this.props.data.icon} />
				<p className="temp">{this.props.data.temperature} &deg;C</p>
				<p className="maxTemp">Max: {this.props.data.maxTemperature} &deg;C</p>
				<p className="minTemp">Min: {this.props.data.minTemperature} &deg;C</p>
			</div>
		)
	}
};


class Chart extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="Chart">
				<Day data={this.props.data} />
			</div>
		)
	}	
};


const DATA = [
	{day: "Monday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Tuesday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Wednesday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Thursday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Friday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Saturday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
	{day: "Sunday", temperature: 15, maxTemperature: 18, minTemperature: 14, icon: "#"},
];

ReactDOM.render(
	<App data={DATA} />,
	document.getElementById("app")
);