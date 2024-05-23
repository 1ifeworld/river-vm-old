import { ed25519ph } from "@noble/curves/ed25519";
import * as constants from "../constants";

export default defineEventHandler(async (event) => {
  console.log("verify post ping");

  try {
    const incomingPost: constants.Post = await readBody(event).catch(() => {});
    const verifyPost = ed25519ph.verify(
      new Uint8Array(incomingPost.sig),
      new Uint8Array(incomingPost.hash),
      incomingPost.signer
    );
    console.log("message verified successfully")

    return new Response(JSON.stringify({ verified: verifyPost }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error handling request:", error.message);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
