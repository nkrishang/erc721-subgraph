import { Address } from "@graphprotocol/graph-ts"
import {CoolCats, Transfer} from "../generated/CoolCats/CoolCats"
import { Account, NFT } from "../generated/schema" 

/**
 * 
 * @param event Transfer(address from, address to, uint256 tokenId)
 */
export function handleTransfer(event: Transfer): void {
  let nftAddress: Address = Address.fromString("0xB467a2b26E61fAd4D8B043B79E24c6d4e6Fa5a71")

  // Create receiver account if it doesn't already exist.
  let recevierAccountId = event.params.to.toHexString()
  let receiverAccount = Account.load(recevierAccountId)

  if(receiverAccount == null) {
    receiverAccount = new Account(recevierAccountId)
    receiverAccount.address = event.params.to

    receiverAccount.save()
  }

  // Create `NFT` if it is being minted.
  let nftId = event.params.tokenId.toString()
  let nft = NFT.load(nftId)

  if(nft == null) {
    nft = new NFT(nftId)
    nft.tokenId = event.params.tokenId

    let nftContract = CoolCats.bind(nftAddress)
    nft.metadataURI = nftContract.tokenURI(event.params.tokenId)
  }

  nft.owner = recevierAccountId
  nft.save()
}

