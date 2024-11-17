### bsky oauth example

Here is an example I made for myself of how to use OAuth with Bluesky,
using [@atcute/oauth/browser-client](https://github.com/mary-ext/atcute/tree/trunk/packages/oauth/browser-client)

It just lets you login and then lists 5 people you're following to prove it
worked.

You can see it in action at https://bsky-oauth-example.jvns.ca

### how to use it

To get it to work, you need to replace `https://bsky-oauth-example.jvns.ca`
everywhere with your domain name. That's it.

If you're developing locally you probably want to use ngrok or tailscale funnel
or something.

I've committed all of the `node_modules` into the repository but you could also
`npm install` if you want an updated version (which is probably smart).

### some problems I had with importmaps

I had a LOT of problems with the importmaps here -- for whatever reason when I
was developing locally ngrok / tailscale funnel it was super flaky and
sometimes files would just randomly not load. I think possibly `python3 -m
http.server` was to blame? Really not sure.
