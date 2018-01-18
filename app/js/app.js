import '../css/bootstrap.css';
import 'jquery/dist/jquery.min.js';


import {default as Web3} from 'web3';
import {default as contract} from 'truffle-contract';

import ProxyContractArtifacts from '../../build/contracts/ProxyICO.json';

var ProxyContract = contract(ProxyContractArtifacts);
ProxyContract.setProvider(web3.currentProvider);

var address;

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
	    });

	    this.getProjectList();
	},

	// 获取项目数量
	getProjectCount: function() {
		ProxyContract.deployed().then(function(instance) {
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
		var listDom = $('.project-list');
		listDom.html();
		ProxyContract.deployed().then(function(_instance) {
			instance = _instance;
			return instance.getProjectCount();
		}).then(function(value) {
			console.log(value);
			var count = value.valueOf();
			console.log(count);
			for(var i = 0; i < count; i++) {
				instance.getProjectInfo(web3.toBigNumber(i)).then(function(info) {
					var index = parseInt(info[0]) + 1;
					var html = "<tr data-id='" + info[0] + "'><th scope='row'>" + index + "</th><td>" + info[1] + "</td><td>" + info[2] + "</td><td>" + info[3].valueOf() + "</td><td>" + web3.fromWei(info[4].valueOf(), 'ether') + "</td><td>" + web3.fromWei(info[5].valueOf(), 'ether') + "</td><td>" + info[6].valueOf() + "</td></tr>";
					listDom.append(html);
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
		var least = parseInt(document.getElementById("least").value);
		var limit = parseInt(document.getElementById("limit").value);

		least = web3.toWei(least, 'ether');
		limit = web3.toWei(limit, 'ether');

		ProxyContract.deployed().then(function(instance) {
			return instance.addProject(name, addr, ratio, least, limit, {from: address});
		}).then(function() {
			$('.tip-content').text("success");
			$('#tip').show();
		}).catch(function(e) {
			console.log(e);
		});
	},

	// 买票上车
	inviteProject: function() {
		var index = parseInt(document.getElementById("index").value) - 1;

		var value = parseInt(document.getElementById("value").value);
		value = web3.toWei(value, 'ether');


		ProxyContract.deployed().then(function(instance) {
			return instance.investment(
				web3.toBigNumber(index), 
				{
					from: address,
					gas: 210000,
  					gasPrice: 100000000000, 
					value: value,
				});
		}).then(function() {
			$('.tip-content').text("买票成功...");
			$('#tip').show();
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