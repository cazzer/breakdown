/* Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file
 except in compliance with the License. A copy of the License is located at

     http://aws.amazon.com/apache2.0/

 or in the "license" file accompanying this file. This file is distributed on an "AS IS"
 BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 License for the specific language governing permissions and limitations under the License.
*/

const https = require('https')
const jose = require('node-jose')
import epsagon from '../epsagon'

const region = 'ap-southeast-2'
const userpoolId = process.env.USER_POOL_ID
const appClientId = process.env.APP_CLIENT_ID
const keys_url = `https://cognito-idp.us-west-2.amazonaws.com/${userpoolId}/.well-known/jwks.json`

export default epsagon.lambdaWrapper(async event => {
    const {
      queryStringParameters: { token },
    } = event
    const sections = token.split('.')
    // get the kid from the headers prior to verification
    const header = jose.util.base64url.decode(sections[0])
    header = JSON.parse(header)
    const kid = header.kid
    // download the public keys
    https.get(keys_url, function(response) {
        if (response.statusCode == 200) {
            response.on('data', function(body) {
                const keys = JSON.parse(body)['keys']
                // search for the kid in the downloaded public keys
                const key_index = -1
                for (const i=0; i < keys.length; i++) {
                        if (kid == keys[i].kid) {
                            key_index = i
                            break
                        }
                }
                if (key_index == -1) {
                    console.log('Public key not found in jwks.json')
                    return {
                      statusCode: 500,
                      bode: 'Public key not found in jwks.json'
                    }
                }
                // construct the public key
                jose.JWK.asKey(keys[key_index]).
                then(function(result) {
                    // verify the signature
                    jose.JWS.createVerify(result).
                    verify(token).
                    then(function(result) {
                        // now we can use the claims
                        const claims = JSON.parse(result.payload)
                        // additionally we can verify the token expiration
                        const current_ts = Math.floor(new Date() / 1000)
                        if (current_ts > claims.exp) {
                            return {
                              statusCode: 401,
                              body: 'Token is expired'
                            }
                        }
                        // and the Audience (use claims.client_id if verifying an access token)
                        if (claims.aud != appClientId) {
                          return {
                            statusCode: 401,
                            body: 'Token was not issued for this audience'
                          }
                        }
                        return claims
                    }).
                    catch(function() {
                        throw new Error('Signature verification failed')
                    })
                })
            })
        }
    })
})
