import { ethers } from "ethers";
import BoardABI from "./abi/Board.json";
import "./App.css";
import { useState } from "react";

const App = () => {
 const [cellColor, setCellColor] = useState("");
 const [cellColorRed, setCellColorRed] = useState("");
 const [cellColorWhite, setCellColorWhite] = useState("");
 const [cellColorBlack, setCellColorBlack] = useState("");
 //  const [userAddr, setuserAddr] = useState();
 const contractAddr = "0x717a33a9EeF6d3b1BA3c7cc2D388A0e923200b03"; //Goerli

 // Ensure PRIVATE_KEY is set in your environment or config
 const privateKey = process.env.REACT_APP_PRIVATE_KEY;

 if (!privateKey) {
  console.error("PRIVATE_KEY environment variable is not set.");
  process.exit(1); // You can handle this error as needed
 }

 //To send Transactions
 const rpcProvider = new ethers.JsonRpcProvider(
  process.env.REACT_APP_GOERLI_RPC
 );
 const getSigner = new ethers.Wallet(privateKey, rpcProvider);
 const sendTransaction = new ethers.Contract(contractAddr, BoardABI, getSigner);

 //Wallet connect
 //@ts-ignore
 let provider = new ethers.BrowserProvider(window.ethereum);
 //@ts-ignore
 let contract = new ethers.Contract(contractAddr, BoardABI, provider);
 let signer;

 const connect = async () => {
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  //@ts-ignore
  let contract = new ethers.Contract(contractAddr, BoardABI, signer);

  try {
   const user = (await signer).getAddress();
   console.log(user);
   //    setuserAddr(user);
  } catch (error) {
   console.error("Error fetching cell color:", error);
  }
 };

 const setRandomColors = async () => {
  try {
   const tx = await sendTransaction.randomizeColors();
   await tx.wait();
   console.log("Transaction successful");
  } catch (error) {
   console.error("Transaction failed:", error);
  }
 };

 const getCellColors = async () => {
  //@ts-ignore
  let inputX = document.getElementById("x-input")?.value;
  //@ts-ignore
  let inputY = document.getElementById("y-input")?.value;

  // Validate user inputs
  if (!inputX || !inputY) {
   console.error("Invalid input values");
   return;
  }

  try {
   // Assuming "contract" is an ethers.js contract instance
   const txgetCellColor = await contract.getCellColor(inputX, inputY);
   console.log(txgetCellColor);
   setCellColor(txgetCellColor);
  } catch (error) {
   console.error("Error fetching cell color:", error);
   // Handle the error as needed (e.g., show an error message to the user)
  }
 };

 //@ts-ignore
 const getNoColors = async () => {
  const contract = new ethers.Contract(contractAddr, BoardABI, provider);

  try {
   const getWhiteCellColors = await contract.whiteCellCount();
   const getBlackCellColors = await contract.blackCellCount();
   const getRedCellColors = await contract.redCellCount();
   setCellColorWhite(getWhiteCellColors);
   setCellColorBlack(getBlackCellColors);
   setCellColorRed(getRedCellColors);
   console.log(getWhiteCellColors, getBlackCellColors, getRedCellColors);
  } catch (error) {
   console.error("Error fetching cell color:", error);
   // Handle the error as needed (e.g., show an error message to the user)
  }
 };

 return (
  <div className="app">
   <h1>Board Dapp</h1>
   <button onClick={connect}>Connect Wallet</button>
   {/* <h2>{userAddr}</h2> */}
   <button onClick={setRandomColors}>Randomize Cell colors</button>
   <div className="dapp">
    <div className="set_values">
     <h2>Input X values between [0,4] </h2>
     <input type="text" id="x-input" placeholder="Input X value" />
     <h2>Input Y values between [0,6] </h2>
     <input type="text" id="y-input" placeholder="Input Y value" />
     <button id="set-xy" onClick={getCellColors}>
      Get Cell Colors
     </button>
     <div className="cellColor">{cellColor}</div>
     {/* <div className="cells">
      <button onClick={getNoColors}>Colors in Cells</button>
      <div className="cellColorNo">
       <p>Red cell</p>
       <p>{cellColorRed}</p>
      </div>
      <div className="cellColorNo">
       <p>White Cell</p>
       <p>{cellColorWhite}</p>
      </div>
      <div className="cellColorNo">
       <p>Black Cell</p>
       <p>{cellColorBlack}</p>
      </div>
     </div> */}
    </div>
   </div>
  </div>
 );
};
export default App;
