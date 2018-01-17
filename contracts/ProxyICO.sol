pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
/**
 * 单代投责任人合约
 */
contract ProxyICO is Ownable {

	using uint from SafeMath;

	struct ICORule {
		string 	name;			// 代币名称
		address contractAddr;	// 代币合约地址
		uint 	ratio;			// 比例
		uint 	least;			// 最小值
		uint 	limit;			// 限量
		uint 	investVolume;	// 已投资量
	}

	mapping(address => (mapping(address => uint))) investors;

	ICORule[] ICOPools;		// 项目池子

	string[] public projectNames;	// 项目名存储

	// event AddProject(address indexed owner, string indexed name);

	/**
	 * 是否存在指定ICO
	 */
	modifier ICOExists(uint _index) { 
		require(ICOPools[_index].contractAddr != 0x0);
		_;
	}

	/**
	 * 大于最小值
	 */
	modifier gtLeast(uint _index) { 
		require(ICOPools[_index].least <= msg.value);
		_;
	}
	

	/**
	 * 获取项目数量
	 */
	function getProjectCount() public view returns(uint) {
		return projectNames.length;
	}

	/**
	 * 获取项目信息
	 */
	function getProjectInfo(uint256 _index) public view returns(string, address, uint) {
		var icoRule = ICOPools[_index];
		return (icoRule.name, icoRule.contractAddr, icoRule.ratio);
	}

	/**
	 * 添加项目
	 */
	function addProject(string _name, address _tokenAddr, uint _ratio) public {
		// AddProject(msg.sender, name);
		var temp = ICORule(_name, _tokenAddr, _ratio);
		ICOPools.push(temp);
		projectNames.push(_name);
	}

	/**
	 * 投资接口
	 */
	function investment(uint _icoIndex) payable public ICOExists(_index) gtLeast(_index) {
		
		var icoRule = ICOPools[_index];

		var investQuota = msg.value;
		var refundQueta = 0;
		
		// 当额度不足
		if (investVolume > icoRule.limit.sub(icoRule.investVolume)) {
			// 获取能投资的额度
			investQuota = icoRule.limit.sub(icoRule.investVolume);
			// 退款额度
			refundQueta = msg.value.sub(investQuota);
		}

		investors[icoRule.contractAddr][msg.sender] = investQuota;

		if (refundQueta > 0) {	// 退款
			revert(msg.sender.transfer(refundQueta));
		}
	}
}
