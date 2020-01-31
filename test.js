// Init transaction
const pay = 50000
const billing = 32500
const money = pay - billing

let availableBillsWQty = {
  '10000': 8,
  '5000': 10,
  '2000': 20,
  '1000': 15,
  '500': 3,
  '200': 10,
  '100': 20
}

let availableBills = []
for (let key in availableBillsWQty) {
	availableBills.push(key)
}

availableBills = availableBills.sort((a, b) => a - b)

//Get possible wallets
//Return wallets having sum >= money
let getPossibleWallets = function (money, startingBills) {
  let possibleWallets = []
  let wallet = {}
  let bills = startingBills.slice()
  let maxBill = bills.pop()

  wallet[maxBill] = Math.ceil(money / maxBill)
  
  while (wallet[maxBill] >= 0) {
    let walletSum = getWalletSum(wallet)
    if (walletSum == money) {
      possibleWallets.push(copyWallet(wallet))
      return possibleWallets
    }
    if (walletSum > money) {
      possibleWallets.push(copyWallet(wallet))
    } else {
      if (bills.length > 0) {
        let remaining = money - getWalletSum(wallet)
        let remainingWallets = getPossibleWallets(remaining, bills)
        for (let i = 0; i < remainingWallets.length; i++) {
          let mergedWallet = mergeWallets(wallet, remainingWallets[i])
          possibleWallets.push(mergedWallet)
          if (getWalletSum(mergedWallet) == money) {
            return possibleWallets
          }
        }
      }
    }
    wallet[maxBill] = wallet[maxBill] - 1
  }

  //Copy a wallet without empty values
  function copyWallet(wallet) {
    let newWallet = {}
    for (let bill in wallet) {
      if (wallet[bill] != 0) {
        newWallet[bill] = wallet[bill]
      }
    }
    return newWallet
  }

  //Merge two wallets without empty values
  function mergeWallets(wallet1, wallet2) {
    let mergedWallet = copyWallet(wallet1)
    for (let bill in wallet2) {
      if (wallet2[bill] != 0) {
        mergedWallet[bill] = wallet2[bill]
      }
    }
    return mergedWallet
  }

  return possibleWallets
}

// Get smallest possible wallet
// > Wallet sum >= money
// > Wallet sum is as close as possible to money
// > Wallet is as small as possible (less bills)
let getSmallestSufficientWallet = function (money, startingBills) {
  let possibleWallets = getPossibleWallets(money, startingBills)
  let minWallet = possibleWallets[0]
  for (let i = 0; i < possibleWallets.length; i++) {
    let possibleWallet = possibleWallets[i]
    let possibleWalletSum = getWalletSum(possibleWallet)
    if (possibleWalletSum == money) {
      return possibleWallet
    }
    if (possibleWalletSum < getWalletSum(minWallet) && possibleWalletSum >= money) {
      minWallet = possibleWallet
    }
  }
  return minWallet
}

//Get total money in wallet
let getWalletSum = function (wallet) {
  let sum = 0
  for (let bill in wallet) {
    sum += wallet[bill] * bill
  }
  return sum
}

let countWalletLeft = function (wallet) {
	for (let bill in wallet) {
		availableBillsWQty[bill] = availableBillsWQty[bill] - wallet[bill]
	}
	return availableBillsWQty
}

//Wallet to string
let walletToString = function (wallet) {
  let result = []
  for (bill in wallet) {
    result.push(wallet[bill] + ' * Rp ' + bill)
  }
  return result.join(' + ')
}

let wallet = getSmallestSufficientWallet(money, availableBills)

//Print
console.log('Bill in the wallet ', availableBillsWQty)
console.log('money ', money)
console.log('wallet ', walletToString(wallet))
console.log('total ', getWalletSum(wallet))
console.log('Difference ', getWalletSum(wallet) - money)
console.log('Remaining bill in the wallet ', countWalletLeft(wallet))