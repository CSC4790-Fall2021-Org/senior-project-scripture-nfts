"use strict";

const e = React.createElement;
const useState = React.useState;
const useEffect = React.useEffect;

const ConnectAndMint = ({ reserve }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [scripturesContract, setscripturesContract] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [saleStarted, setSaleStarted] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof window.web3 !== "undefined") {
        // Use existing gateway
        window.web3 = new Web3(window.ethereum);
      } else {
        alert("No ETH interface plugged. Using read-only.");
      }
      const scripturesContract = new window.web3.eth.Contract(ABI, ADDRESS);
      setscripturesContract(scripturesContract);

      const totalSupply = await scripturesContract.methods.totalSupply().call();
      setTotalSupply(totalSupply);

      const saleIsActive = await scripturesContract.methods.saleIsActive().call();
      setSaleStarted(saleIsActive);
    })();
  }, []);

  async function signIn() {
    if (typeof window.web3 !== "undefined") {
      // Use existing gateway
      window.web3 = new Web3(window.ethereum);
    } else {
      alert("No ETH interface plugged. Using read-only.");
    }

    window.ethereum
      .enable()
      .then((accounts) => {
        window.web3.eth.net
          .getNetworkType()
          // check if connected network is mainnet
          .then((network) => {
            if (network != "main") {
              alert("You are on " + network + " network. Change network to Ethereum mainnet.");
            }
          });
        let walletAddress = accounts[0];
        setWalletAddress(walletAddress);
        setSignedIn(true);
        callContractData(walletAddress);
      })
      .catch((err) => {
        // Handle error. Likely the user rejected the login
        console.error(err);
      });
  }

  async function signOut() {
    setSignedIn(false);
  }


  const Hr = () => e("hr");
  const Br = () => e("br");

  const SignInButton = () => {
    return e("button", { className: "connect-button", onClick: signIn }, `Connect to MetaMask`);
  };
  const SignOutButton = () => {
    return e("button", { className: "connect-button", onClick: signOut }, `Disconnect from MetaMask`);
  };



  if (reserve) {
 
    return e(
      "div",
      { className: "centered-text" },
      
      Br(),
      SignInButton(),
      Br(),
      SignOutButton(),
      Br(),
      
    );
  }

  return e(
    "div",
    null,
  
    Br(),
    SignInButton(),
      Br(),
    SignOutButton(),
    Br(),
    Br(),
    
    e(
      "div",
      { className: "whitelisted-notices" },
    
    )
  );
};

const mint = document.querySelector("#mint");

if (mint) {
  ReactDOM.render(
    e(() => ConnectAndMint({ reserve: false })),
    mint
  );
}
