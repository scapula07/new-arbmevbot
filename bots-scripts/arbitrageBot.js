
const Web3 = require("web3")
const erc20min=require("../build/contracts/IERC20Minimal.json")
const {swapUniToSushi}=require("./swapFunctions")
const HDWalletProvider =require("@truffle/hdwallet-provider")
const IFactory = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const IPair = require('@uniswap/v2-core/build/IUniswapV2Pair.json')  
const IRouter = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IERC20 = require('@uniswap/v2-periphery/build/IERC20.json')
const ArbContract=require("../build/contracts/ArbitrageBot.json")
const IFactoryV3 = require('@uniswap/v2-core/build/IUniswapV2Factory.json')
const IPairV3 = require('@uniswap/v2-core/build/IUniswapV2Pair.json')  

const publicAddress="0xeA55260DA2091B592E9FD7A41e22205618A48E9E"
const contractAddress= "0x3E7Cee87CD88b39e415dE10161167F4dF453f13a"
// const contractAddress="0xaD5666cc1bC3c04d2BF6C536E9C1EB335A137c6C"
// const addrSFactory = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"
// const addrSRouter = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
// const addrUFactory ="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
// const addrURouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"
const addrSFactory = "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac"
const addrSRouter ="0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F"
const addrUFactory ="0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const addrURouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

const privateKey ="5b884004eed1c51ca80a9b8ed26ad2c0ba2b6ec6c3cc9ab36297b9d97442489c"
// const projectId = process.env.PROJECT_ID;
const validPeriod = 50

// const wss="wss://ropsten.infura.io/ws/v3/85fc7c4c61664a96808975adbb581787"
const wss="wss://mainnet.infura.io/ws/v3/85fc7c4c61664a96808975adbb581787"



const addrToken0 ="0x6B175474E89094C44Da98b954EedeAC495271d0F"
 const addrToken1 ="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" 
  
 const addrToken0x="0xaD6D458402F60fD3Bd25163575031ACDce07538D"
const addrToken1x="0xc778417E063141139Fce010982780140Aa0cD5Ab"

const web3 = new Web3("wss://mainnet.infura.io/ws/v3/85fc7c4c61664a96808975adbb581787")
const wss_provider = new HDWalletProvider(
    privateKey,
    "wss://ropsten.infura.io/ws/v3/85fc7c4c61664a96808975adbb581787"
     )
     const Tweb3 = new Web3(wss_provider)
const arbContract = new web3.eth.Contract(
    ArbContract.abi,
    contractAddress
)
const arbContractTx =new Tweb3.eth.Contract(
    ArbContract.abi,
    contractAddress
)
// const TokenContractTx =new hweb3.eth.Contract(
//     erc20min.abi,
//     contractAddress
// )

// const addrToken0 ="0xaD6D458402F60fD3Bd25163575031ACDce07538D"
// const addrToken1 ="0xc778417E063141139Fce010982780140Aa0cD5Ab" 


const token0 = new web3.eth.Contract(IERC20.abi,addrToken0)
const token1 = new web3.eth.Contract(IERC20.abi,addrToken1)

const uFactory = new web3.eth.Contract(IFactory.abi,addrUFactory)
 const uRouter = new web3.eth.Contract(IRouter.abi,addrURouter)
const sFactory = new web3.eth.Contract(IFactory.abi,addrSFactory)//sushiswap, same ABIs, sushiswap forked uniswap so, basically same contracts
const sRouter = new web3.eth.Contract(IRouter.abi,addrSRouter)



const arbTrade=async()=>{
   
 
    console.log("Starting Bot")
    let count =0
    let uPair0,uPair1,sPair,sPair0,sPair1,myAccount,token0Name,token1Name,token0Symbol,token1Symbol,amountIn
    
    // const AddToDb=async(result)=>{
    //     console.log("Adding to fb")
    //     console.log(result)
    //     try{
    //         const docRef = await setDoc(doc(db, "Transactions",`0x3E7Cee87CD88b39e415dE10161167F4dF453f13a${count}`), {
           
    //             result:result,
    //             date: Date.now()
    //          });
    //     }catch(e){
    //         console.log(e)
    //     }
       
    //   }

    // const UpdateDb=async(priceDiff,profitUsd,result)=>{
    //     console.log("updating to fb")
    //     console.log(priceDiff,profitUsd,result)
    //     try{
    //         const docRef=  await updateDoc(doc(db, "Transactions",`0x3E7Cee87CD88b39e415dE10161167F4dF453f13a${count}`), {
    //             priceDiff:priceDiff,
    //             profitUsd:profitUsd,
    //             result:result,
    //             date: Date.now()
    //               });
    //     }catch(e){
    //         console.log(e)
    //     }
       
    //   }
    async function asyncsVar() {
        uPair0 = new web3.eth.Contract(IPair.abi, (await uFactory.methods.getPair(addrToken0, addrToken1).call()) )
        uPair1 = new web3.eth.Contract(IPair.abi, (await uFactory.methods.getPair(token0.options.address, token1.options.address).call()) )
        sPair = new web3.eth.Contract(IPair.abi, (await sFactory.methods.getPair(token0.options.address, token1.options.address).call()) )
        sPair0 = new web3.eth.Contract(IPair.abi, (await sFactory.methods.getPair(addrToken0, addrToken1).call()) )
        sPair1 = new web3.eth.Contract(IPair.abi, (await sFactory.methods.getPair(token0.options.address, token1.options.address).call()) )
        const accountObj = await web3.eth.accounts.privateKeyToAccount(privateKey)
        myAccount = accountObj.address
        console.log(`Wallet address of trader ${myAccount}`)
      

        token0Name = await token0.methods.name().call()
        token0Symbol = await token0.methods.symbol().call()
        token1Name = await token1.methods.name().call()
        token1Symbol = await token1.methods.symbol().call()
        console.log(`Token Assets: ${ token0Symbol}/${token1Symbol}`)
       
        amountIn = await arbContractTx.methods.getBalance("0xaD6D458402F60fD3Bd25163575031ACDce07538D").call()
        console.log(`Initial Balance of Contract:${web3.utils.fromWei(amountIn , "ether")} DAI`)
        
    }
    asyncsVar()

       const newBlockEvent = web3.eth.subscribe('newBlockHeaders')
       newBlockEvent.on('connected', () =>{
        console.log('\nBot listening!\n');
       
         })
        
       let skip = true
       newBlockEvent.on('data', async function(blockHeader){
        skip = !skip
        if (skip) return
          
        try {
            count++
            console.log(count,"count")
            let uReserves, uReserve0, uReserve1, sReserves, sReserve0, sReserve1
            console.log("obtaining eth prices from uniswap and sushiswap")
            // AddToDb("None")
            uReserves = await uPair0.methods.getReserves().call()
             uReserve0 = uReserves[0] //dai
             uReserve1 = uReserves[1] //eth
            uPriceEth = (uReserve0/uReserve1) 
            console.log(` 1 Eth price on uniswap:${uPriceEth} DAI`)
           
       
            sReserves = await sPair0.methods.getReserves().call()
            sReserve0 = sReserves[0] //dai
            sReserve1 = sReserves[1] //eth
            sPriceEth = (sReserve0/sReserve1) 
            console.log(`1 Eth price on sushiswap:${sPriceEth} DAI`)
           
            

            // sPriceEth = (uReserve0/uReserve1) 
            const uAmountOut = await uRouter.methods.getAmountOut(amountIn ,uReserve0 ,uReserve1).call()
            // console.log(`amountOut uniswap:${uAmountOut}`)
            const sAmountOut = await sRouter.methods.getAmountOut(amountIn ,sReserve0 ,sReserve1).call()
            // console.log(`ampontOut sushiswap :${sAmountOut}`)



            if (uPriceEth===sPriceEth) {
                console.log(`No arbitrage opportunity on block ${blockHeader.number}\n`);
                // UpdateDb("0","0",`No arbitrage opportunity on block ${blockHeader.number}\n`)
             return}
            if(uPriceEth >sPriceEth){
                const difference=uPriceEth -sPriceEth
                console.log(`Price difference:$ ${difference} `)
                // UpdateDb(difference,"0","None")
              
                if (difference<=0.5) {
                    console.log(`Price difference insufficient for arbitrage ${blockHeader.number}\n`);
                    // UpdateDb(difference,"0",`Price difference insufficient for arbitrage ${blockHeader.number}`)
                   return
                }
                //const totalDifference = difference*Math.round(amountIn/10**18)
                const totalDifference = difference*Math.round(amountIn /10**18)
                console.log(`Total Difference :${totalDifference}`)
              

                const deadline = Math.round(Date.now()/1000)+validPeriod*60 
                // const gasNeeded0 = await token0.methods.approve(uRouter.options.address,amountIn ).estimateGas()
                // console.log(`Gas needed for token approval :${gasNeeded0}`)
                // console.log((0.03*10**6)*2,"gasss")
                const gasNeeded1 = await arbContract.methods.SushiwapToUniswapTrade(token0.options.address,token1.options.address ).estimateGas()
                console.log(`Gas for swap:${gasNeeded1}`)
                const gasNeeded=gasNeeded1
                const gasPrice = await web3.eth.getGasPrice()
                const gasCost = Number(gasPrice)*gasNeeded/10**18
              
                 const token0PriceEth=0.999689*1/uPriceEth 
            //    const token1Price=1558.82
                 console.log(`Price of Dai in eth:${token0PriceEth}`)
                

                // const profit = (totalDifference*token0PriceEth)-gasCost
                const profit = (difference*token0PriceEth)-gasCost
                console.log(`Trade profit:${profit} ETH`)  
               
                const profitUsd =profit * uPriceEth 
                console.log(`profit:$ ${profitUsd} or  DAI`)
                // UpdateDb(difference,profitUsd,"None")
                
                if(profitUsd <=1) return console.log("Profit too low for trade")
                  console.log("Sushiswap to Uniswap . No swap")
                //   UpdateDb(difference,profitUsd,"Sushiswap to Uniswap . No swap")
                


               
            }else{
                const difference=sPriceEth - uPriceEth 
                console.log(`Price difference :$ ${difference} `)
                // UpdateDb(difference,"0","None")
               if (difference<=0.5) {
                console.log(`Price difference insufficient for arbitrage ${blockHeader.number}\n`); 
                // UpdateDb(difference,"0",`Price difference insufficient for arbitrage ${blockHeader.number}`)
               return}
                //const totalDifference = difference*Math.round(amountIn/10**18)
                const totalDifference = difference*Math.round(amountIn /10**18)
                console.log(`Total Difference :${totalDifference}`)
              
                const deadline = Math.round(Date.now()/1000)+validPeriod*60 
               // const gasNeeded0 = await token0.methods.approve(uRouter.options.address,amountIn).estimateGas()
              
            //    console.log(`Gas needed for token approval :${gasNeeded0}`)
            //    console.log((0.03*10**6)*2,"gasss")
               const gasNeeded1 = await arbContract.methods.UniswapToSushiwapTrade(token0.options.address,token1.options.address).estimateGas()
               console.log(`Gas for swap:${gasNeeded1}`)
             
          
               const gasNeeded=gasNeeded1
               const gasPrice = await web3.eth.getGasPrice()
               const gasCost = Number(gasPrice)*gasNeeded/10**18
              

               const token0PriceEth=0.999689*1/sPriceEth 
            //    const token1Price=1558.82
            console.log(`Price of Dai in eth:${token0PriceEth}`)
         

               const profit = (totalDifference*token0PriceEth)-gasCost
               console.log(`Trade profit:${profit}`)
              
               const profitUsd =profit * sPriceEth 
               console.log(`profit:$ ${profitUsd} or  DAI`)
            //    UpdateDb(difference,profitUsd,"None")
                 if(profitUsd <1) return  console.log("profit is too low for trade")
                   
                 swapUniToSushi()
             
             
                
            }

        }catch(e){
            console.log(e)
        }
       })

       newBlockEvent.on('error', console.error);

    

    }



module.exports={arbTrade}