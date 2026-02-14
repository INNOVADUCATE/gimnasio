#!/usr/bin/env bash
set -euo pipefail

: "${STITCH_BASE_URL:?Set STITCH_BASE_URL}"
PROJECT_ID="13759346689315779931"

ids=(
05622377a6d846fc997715900d1f5783
068387b70ed8487097e54c7feb4ba252
14b08b0bc1784e08bc467ba0633b4528
25849d6b1afb4dbca08be8c5a4e4de3b
446ca69546b04fb5aab96454c9254c66
66732260556747b7916dd32a666c201d
7249c7770668477f9932ddc7768045d8
73320284c26d4e4889c1f57c895c1128
8182c168a91943b99219bca34ce2d2ab
93ec687d8d9a488e857cdddbfa9ba60d
b641eb2176a643e582762e0d86fcd6c3
bbe09e93ece1413789a9e0fcd46cb979
bd89ceb1f4a749908f280b2c5f628ccb
c11dea538b964143ac648b7529508ea6
c747005ab054498581cb8c598e80d639
c9ecbbf52ed143a1acd4c446177719d1
d569b01c1eab4bb3895e9336fb5d713c
ef7bbefce4714b0cbb3ff40afdd62d68
fc08fbffb86f4dad8806c71b2c3efbb6
)

for id in "${ids[@]}"; do
  mkdir -p "stitch_raw/${id}"
  curl -sS -L "${STITCH_BASE_URL}/${PROJECT_ID}/screens/${id}/code" -o "stitch_raw/${id}/code.html"
  curl -sS -L "${STITCH_BASE_URL}/${PROJECT_ID}/screens/${id}/image" -o "stitch_raw/${id}/screen.png"
  echo "Downloaded ${id}"
done
