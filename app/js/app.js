// import 'jquery/dist/jquery.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract';
import {default as BigNumber} from 'bignumber.js';

import ProxyICOArtifacts from '../../build/contracts/ProxyICO.json';

var ProxyICO = contract(ProxyICOArtifacts);
ProxyICO.setProvider(web3.currentProvider);

var address;

// console.log($.("#name").value());

window.App = {

	// 初始化APP
	initApp: function() {
		web3.eth.getAccounts(function(err, accs) {
	      if (err != null) {
	        alert("There was an error fetching your accounts.");
	        return;
	      }

	      if (accs.length == 0) {
	        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
	        return;
	      }

	      address = accs[0];
	      console.log(accs);
	    });
	},

	// 获取项目数量
	getProjectCount: function() {
		ProxyICO.deployed().then(function(instance) {
			return instance.getProjectCount();
		}).then(function(count) {
			console.log(count.valueOf());
		}).catch(function(e) {
			console.log(e);
		}); 
	},

	// 获取项目名称
	getProjectList: function() {
		var instance;
		ProxyICO.deployed().then(function(_instance) {
			instance = _instance;
			return instance.getProjectCount();
		}).then(function(value) {
			var count = value.valueOf();
			for(var i = 0; i < count; i++) {
				instance.getProjectInfo(web3.toBigNumber(i)).then(function(name) {
					console.log(name);
				}).catch(function(e) {
					console.log(e);
					return;
				});
			}
		}).catch(function(e) {
			console.log(e);
			return;
		});
	},

	// 添加项目
	addProject: function() {
		var name = document.getElementById("name").value;
		var addr = document.getElementById("address").value;
		var ratio = parseInt(document.getElementById("ratio").value);

		console.log(name);
		ProxyICO.deployed().then(function(instance) {
			return instance.addProject(name, addr, ratio, {from: address});
		}).then(function() {
			console.log("success");
		}).catch(function(e) {
			console.log(e);
		});
	}
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.initApp();
});