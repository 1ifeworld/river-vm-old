import { ed25519ph } from "@noble/curves/ed25519";
import { blake3 } from '@noble/hashes/blake3';

export const privHexOne =
  "6f50d6d344bcb854d409ffb8ce2c1e495f20aeb56c55add8b084ff339f14b039";
export const pubHexOne =
  "f577faf0d7312c907067258833375a28805019e31eecb7df50c25dbcbc998bbc";

export const userIdKeyPairObj = {
  1: {
    priv: privHexOne,
    pub: pubHexOne,
  },
};

export function getKeyPair(userId: number) {
  if (userIdKeyPairObj[userId]) {
    return userIdKeyPairObj[userId];
  } else {
    return null; // or handle the case where the user ID is not found
  }
}

// Function to serialize data to Uint8Array
// NOTE: in prod need to use protocol buffer
export function serializeToUint8Array(data: any): Uint8Array {
    // Stringify BigInt values to avoid loss of precision during JSON serialization
    const replacer = (key: string, value: any) => (typeof value === 'bigint' ? value.toString() : value);
    const jsonString = JSON.stringify(data, replacer);
    const utf8Array = new TextEncoder().encode(jsonString);
    return utf8Array;
  }

export type CreateItem = {
  uri: string;
};

export type EditItem = {
  itemId: string;
  newUri: string;
};

export type PostData = {
  rid: bigint;
  timestamp: bigint;
  msgType: number;
  msgBody: CreateItem | EditItem;
};

export type Post = {
  signer: string;
  postData: PostData;
  hashType: number;
  hash: Uint8Array;
  sigType: number;
  sig: Uint8Array;
};

export const MOCK_CREATE_ITEM: CreateItem = { 
    uri: 'ipfs://mockCid'
}
export const MOCK_EDIT_ITEM: EditItem = { 
    itemId: 'ipfs://mockItemCid', 
    newUri: 'ipfs://mockCid'
}
export const MOCK_POST_DATA: PostData = { 
    rid: BigInt(1),
    timestamp: BigInt(123456789),
    msgType: 1,
    msgBody: MOCK_CREATE_ITEM,
}

export const MOCK_HASH: Uint8Array = blake3(serializeToUint8Array(MOCK_POST_DATA))

export const MOCK_POST: Post = {
    signer: pubHexOne,
    postData: MOCK_POST_DATA,
    hashType: 1, // BLAKE_3
    hash: MOCK_HASH,
    sigType: 1, // eddsa_ph (with blake_3)
    sig: ed25519ph.sign(MOCK_HASH, privHexOne)
}

/* 
  HOW TO SEND MOCK POST AS CURL
  
    curl -X POST \
    http://localhost:3000/verifyPost \
    -H 'Content-Type: application/json' \
    -d '{
        "signer": "f577faf0d7312c907067258833375a28805019e31eecb7df50c25dbcbc998bbc",
        "postData": {
        "rid": "1",
        "timestamp": "123456789",
        "msgType": 1,
        "msgBody": { 
            "uri": "ipfs://mockCid" 
        }
        },
        "hashType": 1,
        "hash": [44,230,125,122,14,243,181,134,36,144,218,79,33,143,86,68,85,253,46,30,88,96,249,125,97,255,26,115,227,151,157,45],
        "sigType": 1,
        "sig": [114,164,63,129,203,4,46,57,198,60,201,195,116,172,246,4,91,233,56,96,246,43,233,249,225,30,177,195,153,55,94,236,26,55,87,197,50,16,198,172,254,230,150,217,56,119,100,134,170,8,124,117,62,186,95,35,229,206,188,174,169,31,204,11]
    }'    
*/