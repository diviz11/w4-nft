"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

import { Web3Storage } from "web3.storage";

import {ethers} from "ethers"
export default function Home() {
  const [ethAccount, setEthAccount] = useState(null);
  const [file, setFile] = useState([])

  const artifacts = require("../../artifacts/contracts/MyNFT.sol/MyNFT.json");

  const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			// let chainId = await ethereum.request({ method: 'eth_chainId' })
			// console.log('Connected to chain:' + chainId)

			// const rinkebyChainId = '0x4'

			// const devChainId = 1337
			// const localhostChainId = `0x${Number(devChainId).toString(16)}`

			// if (chainId !== rinkebyChainId && chainId !== localhostChainId) {
			// 	alert('You are not connected to the Rinkeby Testnet!')
			// 	return
			// }

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setEthAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}
  

  const getEthereumObject = () => window.ethereum;


  console.log(ethAccount);

 
    const getUser = async () => {
      const ethereum = getEthereumObject();
      const accounts = await ethereum.request({ method: "eth_accounts" });
      const account = accounts[0];
      if (account !== null) {
        setEthAccount(account);
      } else {
        setEthAccount(null);
      }
    };
   

  

  const client = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN});
  
  const [uploaded, setUploaded] = useState(false);

  console.log(artifacts.abi)

  const uploadNFT = async() => { 
    
    var fileInput = ipfs_file;

    try {
      if (uploaded) {

        const rootCid = await client.put(fileInput.files);

        console.log("uploaded to ipfs")

        // const res = await client.get(rootCid);
        // const files = await res.files();

        // let temp = [];
        // for (let i = 0; i < files.length; i++) {
        //   temp.push(URL.createObjectURL(files[i]));
        // }

        // setFile(temp);
        const AdMetaData = {  
            description : "anime waifu",
            image : "https://" + rootCid + ".ipfs.w3s.link" + "/" ,
            name : "Diviz"
        }
      
        const blob = new Blob([JSON.stringify(AdMetaData)], {
          type: "application/json",
        });

        const MetaDataFile = [
          new File(["contents-of-file-1"], "plain-utf8.txt"),
          new File([blob], "AdMetaData.json"),
        ];

        console.log("metadata created")

        const MetaDataCID = await client.put(MetaDataFile);
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = await new ethers.Contract(
          process.env.NEXT_PUBLIC_SERVER_ADDRESS,
          artifacts.abi,
          signer
        );
        let URI = "https://" + MetaDataCID + ".ipfs.w3s.link" + "/AdMetaData.json";

        console.log(URI)

        const tx = await contract.mintNFT(ethAccount, URI);
        await tx.wait();
        console.log(tx.hash);
      }

    } catch(err) {
      console.log(err)
    }
  }

  const mintNFT = () => {}

  function uploadFile() {
    document.getElementById("ipfs_file").click();
    setUploaded(true)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <button onClick={() => connectWallet()} className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {ethAccount != null ? <>{ethAccount}</> : <>connect wallet</>}
        </button>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          ></a>
        </div>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <p className=" text-xl font-semibold">Upload your image</p>
      </div>
      <input
                id="ipfs_file"
                type="file"
                style={{ display: "none" }}
                
              />
      <button onClick = {uploadFile} className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Upload
      </button>
      <img src={file[0]}></img>
      {uploaded ? <p className=" text-xl font-semibold">uploaded</p> : <></>}
      <button onClick = {uploadNFT} className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        Mint
      </button>
    </main>
  )
}
