import json
import sys
from web3 import Web3
import base64
import csv

import sqlite3

DB_NAME = 'tokens.sqlite'

def get_db_connection():
    return sqlite3.connect(DB_NAME)

def init_database():
    with get_db_connection() as db:
        with open('schema.sql') as schema:
            db.execute(schema)

def store(name, value):
    with sqlite3.connect('tokens.sqlite') as db:
        db.execute('insert into storage values (:name, :value) on conflict(name) do update set value = :value', (name, value))

def load(name, default_value=None):
    with sqlite3.connect('tokens.sqlite') as db:
        rows = db.execute('select * from storage where name = :name', (name,))
        rows = list(rows)

        if not rows:
            return default_value

        return rows[0][1]


def store_token(token, storage_method=0):
    if storage_method == 0:
        with  sqlite3.connect('tokens.sqlite') as db:
            db.execute('insert into tokens values (?, ?)', (token['tokenId'], token['rarity']))

    if storage_method == 1:
        with open('token_info.csv', 'a', newline='') as file_object:
            writer = csv.writer(file_object)
            writer.writerow([token['name'], token['skew'], token['rarity'], token['randomSeed'], token['image']])

    # Write to json object, noop
    if storage_method == 2:
        pass


def token_from_uri(uri: str, token_id: int):
    base64_data = uri[uri.find('base64,') + 7:]
    data = json.loads(base64.b64decode(base64_data))

    token = {
        "tokenId": token_id,
        "randomSeed": data['randomSeed'],
        "image": data['image']
    }

    for attribute in data['attributes']:
        token[attribute['trait_type']] = attribute['value']
    
    return token

# Called before any tokens are fetched
def pre_fetch_tokens(storage_method):
    pass

# Called after all tokens are fetched
def post_fetch_tokens(storage_method, tokens):
    # Write to json file
    if storage_method == 2:
        stored_tokens = [{"tokenId": token['tokenId'], "rarity": token['rarity'], "image": token["image"]} for token in tokens]
        stored_tokens.sort(key = lambda token: token['rarity'], reverse = True) 
        with open('tokens.json', 'w') as file_object:
            json.dump(stored_tokens, file_object)
    pass

def main():
    storage_method = 0
    # Unlimited
    max_tokens = 0

    if len(sys.argv) > 1:
        storage_method = int(sys.argv[1])

    if len(sys.argv) > 2:
        max_tokens = int(sys.argv[2])

    from os import environ
    infura_key = environ.get('INFURA_API_KEY', None)

    if infura_key is None:
        print('No infura key found in environment variables')
        sys.exit(1) 
    #free account api daily limit is 100,000 requests
    infura_url = 'https://polygon-mumbai.infura.io/v3/' + infura_key

    web3 = Web3(Web3.HTTPProvider(infura_url))

    # the abi is taken from the contract code, it can be copied right from etherscan
    abi = json.loads('[{"inputs":[{"internalType":"address","name":"vrfCoordinator","type":"address"},{"internalType":"uint64","name":"_subscriptionId","type":"uint64"},{"internalType":"bytes32","name":"_keyhash","type":"bytes32"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ApprovalCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"ApprovalQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"ApprovalToCurrentOwner","type":"error"},{"inputs":[],"name":"ApproveToCaller","type":"error"},{"inputs":[],"name":"BalanceQueryForZeroAddress","type":"error"},{"inputs":[],"name":"MintToZeroAddress","type":"error"},{"inputs":[],"name":"MintZeroQuantity","type":"error"},{"inputs":[{"internalType":"address","name":"have","type":"address"},{"internalType":"address","name":"want","type":"address"}],"name":"OnlyCoordinatorCanFulfill","type":"error"},{"inputs":[],"name":"OwnerQueryForNonexistentToken","type":"error"},{"inputs":[],"name":"TransferCallerNotOwnerNorApproved","type":"error"},{"inputs":[],"name":"TransferFromIncorrectOwner","type":"error"},{"inputs":[],"name":"TransferToNonERC721ReceiverImplementer","type":"error"},{"inputs":[],"name":"TransferToZeroAddress","type":"error"},{"inputs":[],"name":"URIQueryForNonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256[]","name":"randomWords","type":"uint256[]"}],"name":"rawFulfillRandomWords","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"svgUri","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"withdrawERC20Token","outputs":[],"stateMutability":"nonpayable","type":"function"}]')

    address = '0xf4F32E2a237ff831014C6BA80366092A41Ca8477'

    contract = web3.eth.contract(address=address, abi=abi)


    # --- Create a csv of all of the tokens in the contract ------
    # write the header
    # with open('token_info.csv', 'w', newline='') as file_object:
    #     writer = csv.writer(file_object)
    #     writer.writerow(['Name', 'Skew', 'Rarity', 'Random Seed', 'Image code'])


    last_token = load('last_token')

    if not last_token:
        last_token = 0
    
    last_token = int(last_token)

    if max_tokens:
        token_count = last_token + max_tokens
    else:
        token_count = contract.functions.totalSupply().call()

    tokens = []

    pre_fetch_tokens(storage_method)

    for x in range(last_token, token_count):
        token_id = x + 1
        
        # the range value determines how many tokens (starting from the first token) will be captured
        token_uri = contract.functions.tokenURI(token_id).call()

        token = token_from_uri(token_uri, token_id)

        tokens.append(token)
        
        store_token(token, storage_method)

        store('last_token', token_id)

    post_fetch_tokens(storage_method, tokens)


if __name__ == '__main__':
    main()

# ------------------------------------------------------------------------------

# ---------- View the total number of tokens you own in a contract-------------
# token_balance = contract.functions.balanceOf("0x533D389aC67f0cA1455f8E479A46C8D4f00f960c").call()
# print(token_balance)
# -----------------------------------------------------------------------------


# -----------Check to see if you have any of the 100 most rare tokens
# todo: need to make it so you can download the top 100 tokens and then iterate through that list calling the token number in place of x


# step 1: make the database
# step 2: filter by rarity
# step 3: get a list of the 100 most rare tokens
# step 4: feed the list into the script
# for x in range(10):
#     if contract.functions.ownerOf(x).call() == "0x533D389aC67f0cA1455f8E479A46C8D4f00f960c":
#         print(f"You own rare token {x}")
#     else:
#         print("Sorry you don't own any of the most rare tokens :/")
# ----------------------------------------------------------------------------