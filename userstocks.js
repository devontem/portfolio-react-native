
var React = require('react-native');

// Destructuring modules
var {
	Component,
	View,
	TouchableHighlight,
	ListView,
	Text,
	StyleSheet,
	ActivityIndicatorIOS
} = React;

var styles = StyleSheet.create({
	container: {
		paddingTop: 60,
		paddingRight: 10,
		paddingLeft: 10
	},
	row: {
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: 'white'
	},
	rowHeader: {
		borderBottomColor: '#ddd',
		borderBottomWidth: 1,
		flexDirection: 'row',
		backgroundColor: '#ddd'
	},
	table: {
		borderWidth: 2,
		borderColor: '#ddd',
		height: 600
	},
	rowText: {
		flex: 1,
		textAlign: 'center'
	},
	rowTextHeader: {
		flex: 1,
		textAlign: 'center',
		fontWeight: 'bold',
		fontSize: 10,
		padding: 5
	},
	header: {
		backgroundColor: '#252C41'
	},
	headerText: {
		fontSize: 20,
		padding: 10,
		textAlign: 'center',
		color: 'white',
		fontWeight: 'bold'
	}
});

class UserStocks extends Component {


	constructor(props) {
		super(props);

		// Define datasource and method for checking is rows change
		var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
		// Setting initial data source as empty array
		this.state = {
			stocks: dataSource.cloneWithRows([]),
			isLoading: true,
			leagueId: this.props.leagueId,
			userId: this.props.userId
		}

		console.log('userstocks props', this.props.leagueId, this.props.userId)
	};

	componentDidMount(){
    // Getting the User's stocks initially
		this.getUserStocks(this.state.leagueId, this.state.userId)
  }

	// Updates the user's stocks to current market price, and resets them
	updateUserStocks(leagueId, userId) {
		this.setState({isLoading: true})

		fetch('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+leagueId+'/'+userId, {
			method: 'PUT'
		}, {
        headers: {
          'x-access-token' : this.props.token
        }})
		.then((response) => response.json())
		.then((data) => {
			
			this.getUserStocks(leagueId, userId)

		})
		.catch((error) => {
			console.log(error)
		})
	}

	// Retrives the users purchased stocks
	getUserStocks(leagueId, userId) {

		fetch('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+leagueId+'/'+userId, {
              headers: {
                'x-access-token' : this.props.token
              }})
		.then((response) => response.json())
		.then((data) => {
			// Setting state (thus re-rendering template)
			var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
			this.setState({ 
				stocks: dataSource.cloneWithRows(data),
				isLoading: false
			});
		})
		.catch((error) => {
			console.log(error)
		})
	};

	renderRow(stockData) {
		return (
			<View style={styles.row}>
				<Text style={styles.rowText}>{ stockData.symbol }</Text>
				<Text style={styles.rowText}>{ stockData.company }</Text>
				<Text style={styles.rowText}>{ stockData.price }</Text>
				<Text style={styles.rowText}>{ stockData.marketPrice }</Text>
				<Text style={styles.rowText}>{ stockData.return }%</Text>
			</View>
		);
	}

	render() {

		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
					hidden='true'
					size='large' /> )  : 
			( <View /> );

		return (
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.headerText}>Stocks</Text>
				</View>
				<View style={styles.table}>
					<View style={styles.rowHeader}>
						<Text style={styles.rowTextHeader}>SYMBOL</Text>
						<Text style={styles.rowTextHeader}>CORP</Text>
						<Text style={styles.rowTextHeader}>PRICE</Text>
						<Text style={styles.rowTextHeader}>MARKET PRICE</Text>
						<Text style={styles.rowTextHeader}>RETURN</Text>
					</View>
					<ListView dataSource={this.state.stocks}
									renderRow={this.renderRow.bind(this)} />
				</View>
				{ spinner }
			</View>
		)
	}
}

module.exports = UserStocks;