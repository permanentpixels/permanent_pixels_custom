var { contractAddress, correctNetworkId } = config;
var web3 = new Web3(Web3.givenProvider);

const contractWrapper = {
  contract: null,
};

const getNetworkInformation = async () => {
  if (window.ethereum && window.ethereum.isMetaMask) {
    const accounts = await web3.eth.getAccounts();
    const connected = accounts.length > 0;

    const networkId = await getNetVersion();

    return {
      transmitter: "metamask",
      connected: connected,
      networkId: networkId,
    };
  }

  return {
    transmitter: null,
    connected: false,
    networkId: null,
  };
};

const setupMetaMaskListeners = () => {
  if (!window.ethereum) {
    return;
  }
  window.ethereum.on("chainChanged", (chainId) => {
    window.location.reload();
  });

  window.ethereum.on("accountsChanged", (chainId) => {
    window.location.reload();
  });
};

var checkNetwork = async () => {
  let networkId = await getNetVersion();

  if (!checkEthereum()) {
    console.debug("Metamask not detected!");
    return false;
  }

  if (networkId !== correctNetworkId) {
    console.debug(`Incorrect network ${networkId} in use!`);
    return false;
  }

  return true;
};

var getContract = async () => {
  if (!contractWrapper.contract) {
    contractWrapper.contract = new web3.eth.Contract(abi, contractAddress);
  }

  return contractWrapper.contract;
};

var getNetVersion = async () => {
  let response = await ethereum.request({ method: "net_version" });
  return parseInt(response);
};

var connect = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts.length > 0;
};

var isConnected = function () {
  return new Promise(function (resolve, reject) {
    web3.eth.getAccounts().then(function (accounts) {
      resolve(accounts.length !== 0);
    });
  });
};

const getMintedAmount = async () => {
  const contract = await getContract();

  const amount = await contract.methods.totalSupply().call();

  return amount;
};

var updateState = function () {};

var state = {
  connected: false,
  canMint: false,
};

var mintClick = function (event) {};

const displayMintedStats = async () => {
  try {
    const mintedAmount = await getMintedAmount();
    $("#minted-amount").text(mintedAmount);
  } catch (e) {
    setTimeout(displayMintedStats, 2000);
  }
};

const mintButtonState = {
  previousValue: "",
};

const showErrorBanner = async (message) => {
  $("#error-banner").removeClass("hidden");
  $("#error-banner").addClass("error-banner");

  $("#error-message").text(message);
};

const showMintAmountInput = () => {
  $("#mint-amount").removeClass("hidden");
  $("#mint-amount").addClass("reveal");
  $("#mint-button").text("Mint");
  state.canMint = true;
};

const handleMintButtonClick = async (event) => {
  if (state.canMint) {
    const value = parseInt($("#mint-amount").val());
    if (0 < value && value < 1001) {
      const contract = await getContract();

      const accounts = await web3.eth.getAccounts();
      const basePrice = await web3.eth.getGasPrice();

      const args = {
        from: accounts[0],
        value: value * web3.utils.toWei("0.33"),
        gasPrice: basePrice,
      };

      const result = await contract.methods.mint(value).send(args);
    }
  } else {
    try {
      const result = await connect();
      if (!result) {
      }
    } catch (error) {
      console.log(error);
      window.location.reload();
      return;
    }
  }
};

const mintAmountInputHandler = (event) => {
  event.preventDefault();
  if (event.target.value === "") {
    mintButtonState.previousValue = "";
    return;
  }
  let num = event.target.value.replace(/\D/, "");
  if (0 < num && num < 1001) {
    event.target.value = num;
    mintButtonState.previousValue = num;
  } else {
    event.target.value = mintButtonState.previousValue ?? "";
  }
};

const disableMintButton = () => {
  $("#mint-button").addClass("disable");
  $("#mint-button").attr("disabled", "");
};

const checkAndShowNetworkError = () => {
  return new Promise(async (resolve, reject) => {
    const networkInfo = await getNetworkInformation();
    console.log(networkInfo);
    if (!networkInfo.transmitter) {
      // We don't have a way to talk to the blockchain
      showErrorBanner("Install MetaMask in order to mint!");
      disableMintButton();
      $("#mint-button").text("Install MetaMask");
      reject(false);
    } else if (networkInfo.transmitter === "metamask") {
      if (!networkInfo.connected) {
        showErrorBanner("Connect to mint!");
        reject(false);
      } else if (networkInfo.networkId !== correctNetworkId) {
        showErrorBanner("Incorrect network!");
        disableMintButton();
        $("#mint-button").text(
          "Switch to " + (config.correctNetworkName || "Polygon")
        );
        reject(false);
      } else {
        const contract = await getContract();
        const paused = await contract.methods.paused().call();

        if (paused) {
          showErrorBanner("Minting is paused!");
          $("#mint-button").text("Minting paused");
          disableMintButton();
          reject(false);
        }
      }
    }

    resolve(true);
  });
};

const injectContractAddress = () => {
  $("#contract-address").text(config.contractAddress);
  $("#contract-address").append(
    '<img class="link-icon" src="/images/link.svg"/>'
  );
  $("#contract-address").attr(
    "href",
    "https://mumbai.polygonscan.com/address/" + config.contractAddress
  );
};

$(document).ready(async () => {
  checkAndShowNetworkError()
    .then((result) => {
      showMintAmountInput();
    })
    .catch((result) => {});

  setupMetaMaskListeners();

  displayMintedStats();

  injectContractAddress();

  $("#mint-button").click(handleMintButtonClick);

  const contract = await getContract();
  const paused = await contract.methods.paused().call();
  document
    .getElementById("mint-amount")
    .addEventListener("input", mintAmountInputHandler);
});
