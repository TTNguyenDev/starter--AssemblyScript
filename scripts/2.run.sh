#!/usr/bin/env bash
set -e

echo
echo \$CONTRACT is $CONTRACT
echo \$OWNER is $OWNER
echo


#Step 1: Create a Game:
near call $CONTRACT createGame --amount 10 --account_id $OWNER
#Step 2: Player join the game
near call $CONTRACT joinGame '{"_gameId":4173195741, "_guess":true}' --amount 10 --account_id ttnguyen999_2.testnet
#Step 3: Owner stop the game
near call $CONTRACT endGame '{"_gameId":4173195741}' --account_id $OWNER
