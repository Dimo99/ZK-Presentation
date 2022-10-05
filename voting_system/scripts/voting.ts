import { buildPoseidon, buildBabyjub } from "circomlibjs";

export async function merkelize(arr: BigInt[], nLevels: number) {
  const extendedLen = 1 << nLevels;

  const hash = await buildPoseidon();

  const hArr: BigInt[] = [];
  for (let i = 0; i < extendedLen; i++) {
    if (i < arr.length) {
      hArr.push(hash([arr[i]]));
    } else {
      hArr.push(0n);
    }
  }

  return __merkelize(hash, hArr);
}

function __merkelize(hash: (a: BigInt[]) => BigInt, arr: BigInt[]) {
  if (arr.length == 1) return arr;

  const hArr: BigInt[] = [];
  for (let i = 0; i < arr.length / 2; i++) {
    hArr.push(hash([arr[2 * i], arr[2 * i + 1]]));
  }

  const m = __merkelize(hash, hArr);

  return [...m, ...arr];
}

export function getMerkleProof(m, key, nLevels) {
  if (nLevels == 0) return [];

  const extendedLen = 1 << nLevels;

  const topSiblings = getMerkleProof(m, key >> 1, nLevels - 1);

  const curSibling = m[extendedLen - 1 + (key ^ 1)];

  return [...topSiblings, curSibling];
}

export function isMerkleProofValid( key, value, root, mp) {
  let h = hash([value]);
  for (let i = mp.length - 1; i >= 0; i--) {
    if ((1 << (mp.length - 1 - i)) & key) {
      h = hash([mp[i], h]);
    } else {
      h = hash([h, mp[i]]);
    }
  }

  return F.eq(root, h);
}
