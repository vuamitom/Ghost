# Momo integration

## Front End

Upon accessing a post, for which the member hasn't purchased, he/she should see prompt for payment with momo. Template can use (entity.fee && entity.access) to determine whether to show the prompt.

1. When user click on the prompt, a request must be made to the server at the following url: `http://{host}/ghost/api/canary/finpub/payments?post_id={post_id}`

2. The api's response will contain two elements: `payUrl` and `deeplink`. If user is using web browser, he/she should be redirected to `payUrl`, else `deeplink` for mobile.

## Configuration

Payment configurations can be found in: `core/server/config/env/config.{development,production}.json`. These values need to be set correctly. Current value for development env:

    - "momoUrl": "test-payment.momo.vn". On production this need to set to momo production url
    - "returnUrl": "http://localhost:2368/reader/purchases/". We can probably set this to redirect to the purchased post
    - "notifyUrl": "https://webhook.site/693dbc7e-25ac-410f-93d5-413921147fa0" . In production this should be http://{host}/ghost/api/canary/finpub/notifyPaymentComplete