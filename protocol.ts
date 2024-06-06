import { ed25519ph } from "@noble/curves/ed25519";
import { blake3 } from '@noble/hashes/blake3';

/*
    official types + actions for river vm
    1. generics
    2. channel vm
    3. item vm
    4. comment vm
    5. user vm
*/

// === GENERICS

export type Message = {
    signer: string;             // public eddsa key signer
    messageData: MessageData;   // serialized postData object
    hashType: number;           // hash type. 0 = none. 1 = BLAKE_3
    hash: Uint8Array;           // hash value. computed via blake_3(postData)
    sigType: number;            // sig type. 0 = none. 1 = ed25519ph
    sig: Uint8Array;            // sig value. computed via ed22519ph.sign(hash, priv_key)
}

export type MessageData = {    
    rid: bigint;                // userId submitting message
    timestamp: bigint;          // self-elected timestamp for message
    type: number;               // number value. can be different depending on message scheme
    body: Uint8Array            // serialized contents. underlying contents can differ per scheme
}

// === CHANNELS

export enum ChannelMessageTypes {
    NONE = 0,
    CREATE_CHANNEL = 1,    
    EDIT_MEMBERS = 2,
    EDIT_URI = 3,
    TRANSFER_OWNER = 4
}

export type CreateChannelBody = {
    uri: string
}


// TODO: lets get rid of the array, and require separate messages
//       to update each member. just a bit cleaner
export type EditMemberBody = {
    channelId: string
    member: {
        rid: bigint,
        role: 0 | 1 | 2 // 0 = none, 1 = member, 2 = admin
    }
}

export type EditUriBody = {
    channelId: string
    uri: string
}

export type TransferOwnerBody = {
    channelId: string
    transferToRid: bigint
}

// === ITEMS

export enum ItemMessageTypes {
    NONE = 0,
    CREATE_ITEM = 1,    
    EDIT_ITEM = 2,
    DELETE_ITEM = 3,
    SUBMIT_ITEM = 4,
    ACC_REJ_ITEM = 5,
    REMOVE_ITEM = 6
}

export type CreateItemBody = {
    uri: string
}

export type EditItemBody = {
    itemId: string
    uri: string
}

export type DeleteItemBody = {
    itemId: string
}

export type SubmitItemBody = {
    itemId: string
    channelId: string
    caption?: string    // MAX 300 CHAR LIMIT
}

export type AccRejItemBody = {
    submissionId: string
    response: boolean   // FALSE = rejected, TRUE = accepted
    caption?: string    // MAX_CHAR_LIMIT = 300
}

export type RemoveItemBody = {
    submissionId: string
}

// === COMMENTS

export enum CommentMessageTypes {
    NONE = 0,
    CREATE_COMMENT = 1,    
    EDIT_COMMENT = 2,
    DELETE_COMMENT = 3
}

export type CreateCommentBody = {
    targetId: string     // Must be SUBMISSION_ID or COMMENT_ID
    text: string         // MAX_CHAR_LIMIT = 300
}

export type EditCommentBody = {
    commentId: string
    text: string         // MAX_CHAR_LIMIT = 300
}

export type DeleteCommentBody = {
    commentId: string
}

// ==== USER_DATA

export enum UserMessageTypes {
    NONE = 0,
    SET_NAME = 1,    
    SET_URI = 2,
}

export type SetNameBody = {
    fromId: bigint,
    toId: bigint,
    username: string // MAX_CHAR_LIMIT = 15 + regex
}

export type SetUriBody = {
    rid: bigint,
    uri: string,
}

// EXAMPLES

// NOTE: this is an example eddsa key pair I generated using nobile curves lib
// NOTE: messages are signed with eddsa key pairs a userId has registered in the key registry.
//       they are NOT signed by the users custody address
export const SIGNER_PRIV_KEY =
  "6f50d6d344bcb854d409ffb8ce2c1e495f20aeb56c55add8b084ff339f14b039";
export const SIGNER_PUB_KEY =
  "f577faf0d7312c907067258833375a28805019e31eecb7df50c25dbcbc998bbc";

export function serializeToUint8Array(data: any): Uint8Array {
    // Stringify BigInt values to avoid loss of precision during JSON serialization
    const replacer = (key: string, value: any) => (typeof value === 'bigint' ? value.toString() : value);
    const jsonString = JSON.stringify(data, replacer);
    const utf8Array = new TextEncoder().encode(jsonString);
    return utf8Array;
}

const exampleCreateChannelMessageData: MessageData = {
    rid: BigInt(1),
    timestamp: BigInt(1700012120),
    type: ChannelMessageTypes.CREATE_CHANNEL,
    body: serializeToUint8Array({
        uri: "ipfs://exampleChannelUri"
    })
}

const exampleCreateChannelMessageDataHash: Uint8Array = 
    blake3(serializeToUint8Array(exampleCreateChannelMessageData))

const exampleCreateChannelMessage: Message = {
    signer: SIGNER_PUB_KEY,
    messageData: exampleCreateChannelMessageData,
    hashType: 1,
    hash: exampleCreateChannelMessageDataHash,
    sigType: 1,
    sig: ed25519ph.sign(exampleCreateChannelMessageDataHash, SIGNER_PUB_KEY)
}