### MESSAGE RULES

# Generics
- signer must be a keypair registered in the key registry for the target rid by the timestamp specified in `messageData`
- signature must be verifiable for the given hash and signer
- messageData.type must be valid type
- messageData.body must be serialized bytes of the data corresponding with a given type
- because of how messageIds are generated, two identical messages will be de-duped by the virtual machine. ex: impossible to create two channels with identical uris for the same user at the same timestamp, since they will both have the same channelId.

# Channels
- Create Channel
    - uri must be a string. we will use `ipfs://{cid}` to start
- Edit Members
    - channelId must be an existing channelId at the timestamp
    specified in the message
    - target rid must already have been registered by timestamp specified in the message
    - rid sending the message must either be the creator or a specified admin of the channel before the given timestamp
- Edit Uri
    - channelId must be an existing channelId at the timestamp
    specified in the message
    - uri must be a string. we will use `ipfs://{cid}` to start
- Transfer Owner
    - channelId must be an existing channelId at the timestamp
    specified in the message
    - transferToRid must be already registered by timestamp specified in message
