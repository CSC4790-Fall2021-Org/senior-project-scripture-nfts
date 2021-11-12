"use strict";

export default function Mint() {

  const [signedIn, setSignedIn] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  const [how_many_scriptures, set_how_many_scriptures] = useState(1)

  const [scriptureContract, setScriptureContract] = useState(null)

  const [totalSupply, setTotalSupply] = useState(0)

  const [saleStarted, setSaleStarted] = useState(false)

  const [scripturePrice, setScripturePrice] = useState(0)

  useEffect( async() => { 

    signIn()

  }, [])

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      window.web3 = new Web3(window.ethereum);
     
    } else {
      alert("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
        .then((network) => {console.log(network);if(network != "main"){alert("You are on " + network+ " network. Change network to mainnet or you won't be able to do anything here")} });  
        let wallet = accounts[0]
        setWalletAddress(wallet)
        setSignedIn(true)
        callContractData(wallet)

  })
  .catch(function (error) {
  console.error(error)
  })
  }

  async function signOut() {
    setSignedIn(false)
  }
  
  async function callContractData(wallet) {
    // let balance = await web3.eth.getBalance(wallet);
    // setWalletBalance(balance)
    const scriptureContract = new window.web3.eth.Contract(ABI, ADDRESS)
    setScriptureContract(scriptureContract)

    const salebool = await scriptureContract.methods.saleIsActive().call() 
    // console.log("saleisActive" , salebool)
    setSaleStarted(salebool)

    const totalSupply = await scriptureContract.methods.totalSupply().call() 
    setTotalSupply(totalSupply)

    const scripturePrice = await scriptureContract.methods.scripturePrice().call() 
    setScripturePrice(scripturePrice)
   
  }
  
  async function mintScripture(how_many_scriptures) {
    if (scriptureContract) {
 
      const price = Number(scripturePrice)  * how_many_scriptures 

      const gasAmount = await scriptureContract.methods.mintScripture(how_many_scriptures).estimateGas({from: walletAddress, value: price})
      console.log("estimated gas",gasAmount)

      console.log({from: walletAddress, value: price})

      scriptureContract.methods
            .mintScripture(how_many_scriptures)
            .send({from: walletAddress, value: price, gas: String(gasAmount)})
            .on('transactionHash', function(hash){
              console.log("transactionHash", hash)
            })
          
    } else {
        console.log("Wallet not connected")
    }
    
  };


  return (
    
    <div>
    


    <div >
        
        <div>
          {!signedIn ? <button onClick={signIn}>Connect Wallet with Metamask</button>
          :
          <button onClick={signOut}> {walletAddress}</button>}
        </div>
      </div>
      <div>    
        <div>
          <div>
              <span>TOTAL SCRIPTURES MINTED:  <span > {!signedIn ?  <>-</>  :  <>{totalSupply}</> } / 8888</span></span>

              <div id="mint">     
                <input 
                                    type="number" 
                                    min="1"
                                    max="20"
                                    value={how_many_scriptures}
                                    onChange={ e => set_how_many_scriptures(e.target.value) }
                                    name="" 
                                />
              </div>
              {saleStarted ? 
              <button onClick={() => mintScripture(how_many_scriptures)}>MINT {how_many_scriptures} scriptures for {(scripturePrice * how_many_scriptures) / (10 ** 18)} ETH + GAS</button>        
                : <button>SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>        
            }    
          </div> 
          </div>

        </div>  
  </div>  
  )
  
}
const domContainer = document.querySelector('#mint');
ReactDOM.render(e(mint), domContainer);