---
title: Permanent Pixels Deepdive
date: 2023-01-03
description: An overview of the Permanent Pixels Project
author: Ben and Nico
---

## What are Permanent Pixels
### Overview
Permanent Pixels are 50 “pixel” X 50 “pixel” images that are generated and stored 100% on chain on the Polygon network, in a truly random manner ([using Chainlink VRF](https://docs.chain.link/vrf/v2/introduction))</a>. Each image contains 2500 “pixels,” all of which have an equally likely chance to be black or white. There can be up to 10,000,000 (10 Million) Permanent Pixels created.

### Image
Permanent Pixels are 50 X 50 grids of black and white squares; aka “pixels.” Each of the 2500 squares in the grid have an equally likely chance (50/50) of being either black or white.

![50 X 50 grid of black and white pixels](/images/articles/whitepaper/pixel-grid.png)

### Creation
Permanent Pixels will be created and held on the Polygon network and are generated completely on-chain and in a verifiably random manner.

### The difference between off-chain and on-chain NFT's
Off-chain NFT's refer to NFT's that have some or all of their data stored outside of the blockchain. It is common practice to create all of the images and metadata for an NFT collection before it has actually launched, and then store that data in an off chain location, such as IPFS. When an NFT is minted, it will reference the off chain data but not actually create anything new. Two advantages of off chain NFT's are that they can be easier to create, and there are lower network fees required to mint them. One of the main disadvantages of off-chain NFT's is that their data is not permanently stored to the blockchain and could be deleted or edited in the future.

On-chain NFT's, on the other hand, have all of their data stored on the blockchain. On-chain NFT's can be difficult and expensive to create; Solidity (the coding language for smart contracts) and blockchains are not designed to create and store large amounts of image data. The advantage of having NFT data stored on the blockchain is that it cannot be edited or deleted like off-chain NFT's can; on-chain NFT's are permanent.

### Why Permanent Pixels are on-chain and on the Polygon network
It was decided to make Permanent Pixels on-chain because of the trust and value that on-chain data provides: the data for Permanent Pixels will never get deleted or edited in the future.

The Polygon network was chosen for its low network fees. Minting Permanent Pixels will use a significant amount of gas, but the Polygon network keeps the monetary cost of minting low. There will be further discussion of cost and pricing later in the article.

### What verifiably random means, and why it is important
One challenge Solidity and the blockchain faces is the creation of truly random numbers. Pseudo random numbers can be created, but with the right motivation, someone can figure out how the pseudo randomness works and easily determine which pseudo random numbers will be generated. If not for the use of truly random numbers, there are a few reasons this could cause problems for Permanent Pixels. The first reason this is a concern, is because the Permanent Pixels are all generated on-chain. If the Permanent Pixels were generated off-chain, there would be no need to worry about using blockchain resources to create random numbers as all of the work to create randomness would be done off-chain. The second reason is that randomness will be used to determine how rare a Permanent Pixel is: the random number generated as the seed for each NFT will be used to determine how rare it is. There will be an in depth discussion about how the Permanent Pixel rarity works later on in the article, but for now, the important thing to know is that the more rare an NFT is, the more valuable it is. If Permanent Pixels used pseudo random numbers when generating NFT's on the blockchain, someone could potentially figure out how the randomness works and then mint all of the most valuable NFTs would give the most technical savvy an unfair advantage over others.

In comes Chainlink VRF (Verifiable Random Function). Here is the description of Chainlink VRF from their website:for themselves, which would give the most technical savvy an unfair advantage over others.

*“Chainlink VRF enables smart contracts to access randomness without compromising on security or usability. With every new request for randomness, Chainlink VRF generates a random number and cryptographic proof of how that number was determined. The proof is published and verified on-chain before it can be used by any consuming applications. This process ensures that the results cannot be tampered with nor manipulated by anyone, including oracle operators, miners, users and even smart contract developers.”*

Chainlink VRF eliminates the two problems described above by allowing for truly random and verified number generation on-chain. Each time a Permanent Pixel needs to be minted, a new random number is generated using Chainlink VRF that determines what it will look like.

### How Permanent Pixels use random numbers to determine color expression, and reduce cost
*Skip this section if you are not interested in technical details*

As described in the previous section, a single random number is generated as the seed to create a Permanent Pixel. You may be wondering: how does a single random number determine how the 2500 different squares in a Permanent Pixel appear?

The initial number generated from the Chainlink VRF is a 32-byte random number.

Each bit in the base-2 representation of the 32-byte (256-bit) number represents a pixel in our Permanent Pixel, beginning from the top left, and continuing to the right.

Let's use the number 19…. as an example:

The binary representation of 19 in big-endian form is:

```10011```{ style="background-color: blue" }