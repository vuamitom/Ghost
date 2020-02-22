# Momo integration

## Front End

### Theme integration

An example of integration with theme is below.

```html
{{#if access}}
{{!-- if the user has access to this post, show it to them --}}
    <section class="post-full-content">
        <div class="post-content">
            {{content}}
        </div>
    </section>

{{else}}
{{!-- if the user does not have access, show them an upgrade CTA --}}
    <section class="post-full-content">
        <div class="post-content">
            <p>You don't have access to this post on <strong>{{@site.title}}</strong> at the moment, but if you upgrade your account you'll be able to see the whole thing, as well as all the other posts in the archive! Subscribing only takes a few seconds and will give you immediate access.</p>
        </div>
        <aside class="post-upgrade-cta">
            <div class="post-upgrade-cta-content">
                {{#if @member}}
                <h2>This post is for paying subscribers only</h2>
                {{!-- display pay with momo button --}}
                <div data-fp-members-payment="{{id}}">Pay with MOMO</div>
                {{else}}
                <h2>This post is for subscribers only</h2>
                {{/if}}
                <a class="button large primary" href="/signup/">Subscribe now</a>
                <p><small>Already have an account? <a href="/signin/">Sign in</a></small></p>
            </div>
        </aside>
    </section>
{{/if}}
```

### Rest Api


Upon accessing a post, for which the member hasn't purchased, he/she should see prompt for payment with momo. Template can use (entity.fee && entity.access) to determine whether to show the prompt.

1. When user click on the prompt, a request must be made to the server at the following url: `http://{host}/ghost/api/canary/finpub/payments?post_id={post_id}`

2. The api's response will contain two elements: `payUrl` and `deeplink`. If user is using web browser, he/she should be redirected to `payUrl`, else `deeplink` for mobile.

## Configuration

Payment configurations can be found in: `core/server/config/env/config.{development,production}.json`. These values need to be set correctly. Current value for development env:

    - "momoUrl": "test-payment.momo.vn". On production this need to set to momo production url
    - "returnUrl": "http://localhost:2368/reader/purchases/". We can probably set this to redirect to the purchased post
    - "notifyUrl": "https://webhook.site/693dbc7e-25ac-410f-93d5-413921147fa0" . In production this should be http://{host}/ghost/api/canary/finpub/notifyPaymentComplete