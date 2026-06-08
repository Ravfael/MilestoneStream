#!/bin/bash
echo "Deadline timestamp date:"
date -d @1780531200
echo "Current block timestamp:"
~/.foundry/bin/cast age --rpc-url https://eth-sepolia.g.alchemy.com/v2/_Pr3Rq65seF-oqeOH8KoU
