#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#
# Exit on first error
docker network disconnect -f net_test logspout

set -ex

# Bring the test network down
pushd ../y-network
./network.sh down
popd

# clean out any old identites in the wallets
rm -rf wallet/*

