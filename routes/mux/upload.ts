import Mux from '@mux/mux-node'
import { useCORS } from 'nitro-cors'

const { Video } = new Mux()


export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'OPTIONS') {
    return null
  }
  assertMethod(event, 'POST')
 const requestObject = event.node.req

  let authTokenHeader = requestObject.headers['authorization']
  if (Array.isArray(authTokenHeader)) {
    authTokenHeader = authTokenHeader[0]
  }

  const authToken = authTokenHeader?.split(' ')[1] // Extract token from "Bearer [token]"
  if (!authToken) {
    return { error: 'No authentication token provided' }
  }
  const cid = await readBody(event)

  const verifiedClaims = await checkPrivy(authToken)
  if (!verifiedClaims || verifiedClaims.appId !== process.env.PRIVY_APP_ID) {
    console.error('Invalid authentication token')
    return { error: 'Invalid authentication token' }
  }

  const assetEndpointForMux = `https://${cid}.ipfs.w3s.link`

  try {
    const asset = await Video.Assets.create({
      input: assetEndpointForMux,
      playback_policy: 'public',
      encoding_tier: 'baseline',
    })
    return { id: asset.id, playbackId: asset.playback_ids?.[0].id }
  } catch (e) {
    console.error('Error creating Mux asset', e)
    return { error: 'Error creating Mux asset' }
  }
})

// const directUpload = await Video.Uploads.create({
//   cors_origin: '*',
//   new_asset_settings: {
//     input: body,
//     playback_policy: 'public',
//     encoding_tier: 'baseline',
//   },
// })
