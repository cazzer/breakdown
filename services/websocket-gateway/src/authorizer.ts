import pick from 'lodash/pick'
import * as jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'
import * as moment from 'moment'
import request from 'request'

import epsagon from './epsagon'

interface DecodedJWT {
  aud: string;
  iss: string;
  exp: number;
  sub: string;
  token_use: string;
}

interface APIGatewayWebsocketEvent {
  methodArn: string;
  queryStringParameters: {
    token: string;
  };
  requestContext: {
    eventType: string;
    connectionId: string;
    authorizer: {
      userId: string;
    };
  };
}

const {
  USER_POOL_ID,
  APP_CLIENT_ID
} = process.env
const COGNITO_ISSUER = `https://cognito-idp.us-west-2.amazonaws.com/${USER_POOL_ID}`

function generatePolicy(principalId: string, effect: 'Allow' | 'Deny', resource: string) {
  return {
    principalId,
    context: {
      userId: principalId, // The authorized userId that will be passed to the event object on each request
    },
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export default epsagon.lambdaWrapper((event: APIGatewayWebsocketEvent, _context: any, cb: any) => {
  const {
    queryStringParameters: { token },
  } = event;

  // Leveraging AWS Cognito to authenticate users based on the id token
  return request({ url: `${COGNITO_ISSUER}//.well-known/jwks.json`, json: true }, (error, response, body) => {
    if (error || response.statusCode !== 200) cb('Unauthorized');

    const [key] = body.keys;
    const jwkArray = pick(key, ['kty', 'n', 'e']);
    const pem = jwkToPem(jwkArray);

    // Verify the token
    jwt.verify(token, pem, { issuer: COGNITO_ISSUER }, (err, decoded) => {
      if (err) {
        cb('Unauthorized');
      } else {
        const { sub, token_use, exp, iss, aud } = decoded as DecodedJWT;
        // Extra checks to ensure that this cognito id token is valid
        if (aud !== APP_CLIENT_ID) cb('Unauthorized');
        if (iss !== COGNITO_ISSUER) cb('Unauthorized');
        if (token_use !== 'id') cb('Unauthorized');
        if (moment().isAfter(moment(exp * 1000))) cb('Unauthorized');
        return cb(null, generatePolicy(sub, 'Allow', event.methodArn));
      }
    });
  });
})
