
var React = require('react-native');

// Destructuring modules
var {
	Component,
	View,
	TouchableHighlight,
	ListView,
	Text
} = React;

// Requiring local modules
var MakeTrade = require('maketrade');
var UserStocks = require('UserStocks');


class League extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
				<MakeTrade />
			</View>
		)
	}
}

module.exports = League;