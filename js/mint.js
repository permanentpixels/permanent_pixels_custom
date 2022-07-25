var { contractAddress, abiFile, correctNetworkId } = config;
var web3 = new Web3(Web3.givenProvider);

var checkEthereum = () => {
    return ethereum && ethereum.isMetaMask;
}

var checkNetwork = async () => {
    let networkId = await getNetVersion();

    if (!checkEthereum()) {
        console.debug("Metamask not detected!");
        return false;
    }

    if (networkId !== correctNetworkId) {
        console.log(networkId, correctNetworkId)
        console.debug(`Incorrect network ${networkId} in use!`)
        return false;
    }

    return true;
}

var mint = async (amount) => {
    if (checkNetwork()) {
        var contract = await getContract();
        let accounts = await web3.eth.requestAccounts();

        if (contract && accounts.length) {
            contract.methods.mint(amount).send({ from: accounts[0], value:0 }).catch(console.log.bind(console));
        }
    }
    else {
        window.alert("Select Mumbai Network!");
    }
}

var getAbi = async () => {
    let response = await fetch(abiFile);
    let text = await response.text();
    let abi = JSON.parse(text);

    // Etherscan/polygonscan return a json object
    if (abi.result) {
        return JSON.parse(abi.result);
    }

    return abi;
}

var getContract = async () => {
    let abi = await getAbi();
    return new web3.eth.Contract(abi, contractAddress);
}

var getNetVersion = async () => {
    let response = await ethereum.request({ method: 'net_version' });
    return parseInt(response);
}

var connect = async () => {
    isConnected().then(function(connected) {
        if (!connected) {
            web3.eth.requestAccounts().then((accounts) => {
                if (accounts.length) {
                    state.connected = true;
                }
            }).catch(function(error) {
                state.connected = false;
            }); 
        }
        else {
            state.connected = true;
        }
    });
}

var isConnected = function() {
    return new Promise(function(resolve, reject) {
        web3.eth.getAccounts().then(function(accounts) {
            resolve(accounts.length !== 0);
        });
    });
}

var getTotalSupply = function () {
    return getContract().then(function(contract) {
        return contract.methods.totalSupply().call()
    });
}

var updateState = function() {
    getTotalSupply().then(function(supply) {
        
    });
}

var state = {
    connected: false,
};

var mintClick = function(event) {
    console.log(event);
}

$(document).ready(() => {
    // checkNetwork().then(function(result) {
    //     if (result) {
    //         return getTotalSupply();
    //     }
    //     else {
    //         window.alert("Connect to the correct network!");
    //     }
    // }).then(function(supply) {
    //     if (supply) {
    //         $("#numberMinted").text(supply);
    //     }
    // })
    $("#action").click(function(event) {
        
        // if (!state.connected) {
        //     connect().then(function() {
        //         checkNetwork();
        //     }).then(function() {
        //         $("#numberMinted").text("Hello");
        //     })
        // }
    });

    $("#mint-button").click((event) => {
        $("#mint-amount").removeClass("hidden");
        $("#mint-amount").addClass("reveal");
        $("#mint-button").text("Mint");
    });


    $("#mint-amount").val('');
    document.getElementById("mint-amount").previousValue = '';
    
    document.getElementById("mint-amount").addEventListener('input', (event) => {
        if (event.target.value === '') {
            event.target.value.previousValue = '';
            return;
        }
        let num = event.target.value.replace(/\D/, '');
        if (0 < num && num < 1001) {
            event.target.value = num;
            event.target.previousValue = num;
        }
        else {
            event.target.value = event.target.previousValue ?? '';
        }
    });
});