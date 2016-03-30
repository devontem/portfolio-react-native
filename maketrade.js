
var React = require('react-native');

// Destructuring modules
var {
	Component,
	View,
	TouchableHighlight,
	ListView,
	Text,
	StyleSheet,
	AlertIOS,
	TextInput,
	Switch,
	ActivityIndicatorIOS
} = React;


class MakeTrade extends Component {


	constructor(props) {
		super(props);

		// Setting initial data source as empty array
		this.state = {
			userId: this.props.userId,
			leagueId: this.props.leagueId,
			isLoading: false,
			stocks: null,
			stock: null,
			stockAmount: 0,
			searchInput: '',
			portfolio: {},
			total: 0,
			balance: 0,
			porfolioValue: 0,
			buySell: false 
		}
	};

	componentDidMount(){
    this.updatePortfolioAndStocks(this.state.leagueId, this.state.userId)
  }

	getUserStocks(leagueId, userId) {
		this.setState({isLoading: true});
		// console.log('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+13+'/'+14)
		fetch('https://portfolioio.herokuapp.com/api/portfolios/stocks/'+leagueId+'/'+userId, {
              headers: {
                'x-access-token' : this.props.token
              }})
		.then((response) => response.json())
		.then((data) => {
			// Setting state (thus re-rendering template)
			console.log('User Stocks', data)
			this.setState({ 
				stocks: data
			});
		})
		.catch((error) => {
			console.log(error)
		})
	};

	getUserPortfolio(leagueId, userId) {
		this.setState({isLoading: true});

		fetch('https://portfolioio.herokuapp.com/api/portfolios/'+leagueId+'/'+userId,  {
              headers: {
                'x-access-token' : this.props.token
              }})
		.then((response) => response.json())
		.then((data) => {
			// Setting state (thus re-rendering template)
			this.setState({ 
				portfolio: data,
				isLoading: false
			});
			console.log('portfolio', data)
		})
		.catch((error) => {
			console.log(error);
		});
	}

	searchForStock(stockName) {
		this.setState({isLoading: true});

		var query = 'https://portfolioio.herokuapp.com/api/stocks/'+stockName;
		return fetch(query,  {
              headers: {
                'x-access-token' : this.props.token
              }})
		.then((response) => {
			return response.json();
		})
		.then((stock) => {
			return stock;
		})
		.catch((error) => {
			console.log(error)
		})
	}

	performAction(leagueId, userId) {
		var context = this;
		// if stock is invalid, don't perform action
		if (!this.state.stock.Ask){
			AlertIOS.alert("Please enter a valid symbol!");
			return false;
		}

		// Setting options for trade
		var options = {
			symbol: this.state.stock.symbol,
			company: this.state.stock.Name,
			leagueId: leagueId,
			userId:  userId,
			shares: this.state.stockAmount,
			price: this.state.stock.Ask,
			marketPrice: this.state.stock.Ask,
			buysell: !this.state.buySell,
			dayorder: false,
			executed: true
		};
		console.log('perform action options, ', options);
		// return false;

		this.state.total = this.state.stockAmount * this.state.stock.Ask + 10;
		console.log('my total is....'+ this.state.total)

		// if selling stock, must own it and enough shares
		if (!options.buysell && !this.ableToSell()){
			return false;
		} else if (options.buysell &&  this.state.total > this.state.stock.balance){
			AlertIOS.alert("Sorry", "Your balance isn't high enough to make this trade");
			return false;
		} else {

			// POST REQ for limit order
			this.limitOrder(options).then(()=>{

				// POST REQ for buySell
				this.buySell(options).then(function(){
					AlertIOS.alert('You traded '+options.shares+' shares in '+options.company);
					context.resetFields();

					console.log('everything done!!')
					context.updatePortfolioAndStocks(context.state.leagueId, context.state.userId)
				});
			});
		}
	}

	updatePortfolioAndStocks(leagueId, userId) {
		this.getUserPortfolio(leagueId, userId);
		this.getUserStocks(leagueId, userId)
	}

	resetFields() {
		this.setState({
			total: 0,
			stockAmount: 0,
			stock: null,
			searchInput: ''
		});
	}

	updateTotal(event) {
		if (this.state.stock){
			this.setState({
				stockAmount: event,
				total: event * this.state.stock.Ask
			});
			var amount = this.state.stockAmount * this.state.stock.Ask
			console.log('Stock #: '+ this.state.stockAmount+', total: $'+ amount);
		}	
	}

	limitOrder(options) {
		return fetch('https://portfolioio.herokuapp.com/api/transactions/limitorder', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'x-access-token' : this.props.token
		  },
		  body: JSON.stringify(options)
		}).then(()=>{

		});
	}

	buySell(options) {
		return fetch('https://portfolioio.herokuapp.com/api/transactions', {
		  method: 'POST',
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'x-access-token' : this.props.token
		  },
		  body: JSON.stringify(options)
		}).then(function(data){
			return data;
		})
	}

	ableToSell() {
		var stocks = this.state.stocks;
		var selectedStock = this.state.stock;
		for (var i = 0; i < stocks.length; i++){
			if (stocks[i].symbol === selectedStock.symbol){
				if (this.state.stockAmount <= stocks[i].shares){
					return true;
				} else {
					AlertIOS.alert('You are selling more shares in this company than you own');
					return false;
				}
			}
		}
		AlertIOS.alert('You do not own this share to sell');
		return false;
	}

	SearchTextChange(event) {
		this.setState({
			searchInput: event.nativeEvent.text
		});
		console.log('New stock val->', this.state.searchInput)
	}

	getStock(){
		var item = this.state.searchInput.toLowerCase();
		this.searchForStock(item).then((stock)=>{

			console.log('inside stock data', stock)
			// Sets state and checks if stock type is invalid
			this.setState({
				stock: stock,
				isLoading: false
			}, ()=>{
				if (this.state.stock.Ask === 'N/A'){
					AlertIOS.alert('Stock name is invalid!');
					return false;
				}
			})
		});
	}

	submit(){

		this.performAction(this.state.leagueId, this.state.userId);
	}

	render() {

		var showTrade = this.state.stock && this.state.stock.Ask !== 'N/A' ?
		(<View style={styles.showTrade}>
						<Text style={styles.symbol}>{this.state.stock.symbol.toUpperCase() || 0}</Text>
						<View style={styles.separator}></View>
						<View style={styles.rowInner}>
							<TextInput placeholder="# of Shares" 
													onChangeText={this.updateTotal.bind(this)}
													style={styles.searchInput}   />
							<View style={styles.switch}>
								<Text style={styles.switchText}>Buy</Text>
								<Switch
				          onValueChange={(value) => this.setState({buySell: value})}
				          value={this.state.buySell} />
			          <Text style={styles.switchText}>Sell</Text>
			        </View>
			      </View>
		        <View style={styles.separator}></View>
						<TouchableHighlight 
												onPress={this.submit.bind(this) }
												style={styles.button} >
							<Text style={styles.buttonText}>Submit</Text>
						</TouchableHighlight>
						 <View style={styles.estimate}>
							<Text style={styles.estimateText}>Quote for {this.state.stockAmount} shares: </Text>
	          	<Text style={styles.estimateTextPrice}>${this.state.total.toFixed(2)}</Text>
	          </View>
			</View>
			) : (<View></View>);

		var spinner = this.state.isLoading ?
			( <ActivityIndicatorIOS
					hidden='true'
					size='large' /> )  : 
			( <View /> );



		return (
			<View style={styles.container}>
				<View style={styles.table}>
					<View style={styles.tableRow}>
						<Text style={styles.tableHeader}>Balance</Text>
						<Text style={styles.tableHeader}>PortfolioValue</Text>
					</View>
					<View style={styles.tableRow}>
						<Text style={styles.tableData}>${this.state.portfolio.balance}</Text>
						<Text style={styles.tableData}>${this.state.portfolio.portfolioValue}</Text>
					</View>
				</View>
				<View>
					<View>
						<Text style={styles.headerText}>Make a Trade</Text>
					</View>
					<View style={styles.row}>
						<TextInput placeholder="Search for a stock" 
												value={this.state.searchInput}
												onChange={this.SearchTextChange.bind(this)}
												style={styles.searchInput}   />
						<TouchableHighlight 
												onPress={this.getStock.bind(this) }
												style={styles.button} >
							<Text style={styles.buttonText}>Get Stock</Text>
						</TouchableHighlight>
					</View>
					{spinner}
					{showTrade}
				</View>
			</View>
		)
	}
}

var styles = StyleSheet.create({
	description: {
		fontSize: 18,
		textAlign: 'center',
		color: '#656565'
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		padding: 10
	},
	rowInner: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'stretch'
	},
	switch: {
		flex:2,
		flexDirection: 'row'
	},
	container: {
		marginTop: 60,
		flex: 1,
		backgroundColor: '#F5FCFF'
	},
	flowRight: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  alignSelf: 'stretch'
		},
	buttonText: {
	  fontSize: 18,
	  lineHeight: 28,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flex: 3,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	},
	headerText: {
		fontSize: 23,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	showTrade:{
		padding: 10
	},
	switchText:{
		marginTop: 5,
		marginRight: 5,
		marginLeft: 5
	},
	separator: {
		borderWidth: 1,
		marginTop: 10,
		marginBottom: 20,
		borderColor: '#ddd'
	},
	estimate:{
		marginTop: 30
	},
	symbol: {
		alignSelf: 'center',
		fontSize: 30,
		color: '#01579b',
		fontWeight: 'bold' 
	},
	estimateText:{
		marginTop: 5,
		fontSize: 20,
		textAlign: 'center',
		color: 'green'
	},
	estimateTextPrice:{
		marginTop: 5,
		fontSize: 30,
		textAlign: 'center',
		fontWeight: 'bold',
		color: 'green'
	},
	table:{
		marginBottom: 10
	},
	tableRow:{
		flexDirection: 'row'
	},
	tableHeader:{
		backgroundColor: '#e0f2f1',
		textAlign: 'center',
		fontSize: 15,
		padding: 20,
		fontWeight: 'bold',
		flex: 3,
		alignSelf: 'center'
	},
	tableData: {
		flex: 3,
		padding: 10,
		fontSize: 15,
		textAlign: 'center'
	}
});
module.exports = MakeTrade