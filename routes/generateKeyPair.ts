import { ed25519 } from "@noble/curves/ed25519";
import * as nobleUtils from '@noble/curves/abstract/utils';

export default defineEventHandler(async (event) => {
  console.log("/generateKeyPair route ping");

  try {
    const priv = nobleUtils.bytesToHex(ed25519.utils.randomPrivateKey());
    const pub = nobleUtils.bytesToHex(ed25519.getPublicKey(priv));

    return new Response(
      JSON.stringify({ priv: priv, pub: pub }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error handling request:", error.message);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
