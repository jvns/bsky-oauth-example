import { configureOAuth } from '@atcute/oauth-browser-client';
import { resolveFromIdentity } from '@atcute/oauth-browser-client';
import { createAuthorizationUrl } from '@atcute/oauth-browser-client';
import { XRPC } from '@atcute/client';
import { OAuthUserAgent, finalizeAuthorization, getSession } from '@atcute/oauth-browser-client';

const APP_URL="https://bsky-oauth-example.jvns.ca"

configureOAuth({
	metadata: {
		client_id: `${APP_URL}/client-metadata.json`,
		redirect_uri: `${APP_URL}`,
	},
});

async function login() {
    const username = document.getElementById("username").value
    const { identity, metadata } = await resolveFromIdentity(username);
    const authUrl = await createAuthorizationUrl({
        metadata: metadata,
        identity: identity,
        scope: 'atproto transition:generic transition:chat.bsky',
    });
    window.location.assign(authUrl);
    await sleep(200);
}

async function finalize() {
    const params = new URLSearchParams(location.hash.slice(1));
    history.replaceState(null, '', location.pathname + location.search);
    const session = await finalizeAuthorization(params);
    const agent = new OAuthUserAgent(session);
    return agent
}

window.login = login;

//export interface XRPCRequestOptions {
//	type: 'get' | 'post';
//	nsid: string;
//	headers?: HeadersInit;
//	params?: Record<string, unknown>;
//	data?: FormData | Blob | ArrayBufferView | Record<string, unknown>;
//	signal?: AbortSignal;
//}
async function getFollowing(xrpc) {
    const following = await xrpc.request({
        type: 'get',
        nsid: 'app.bsky.graph.getFollows',
        params: {
            actor: agent.session.info.sub,
            limit: 5
        }
    });
    return following.data.follows;
}

function display(follows) {
    // create new <ul>
    const list = document.createElement('ul');
    for (const follow of follows) {
        const item = document.createElement('li');
        item.textContent = follow.handle;
        list.appendChild(item);
    }
    document.getElementById("following").textContent = "5 people you're following:"
    document.getElementById("following").appendChild(list);
}

async function handleOauth() {
    if (!location.href.includes('state')) {
        return;
    }
    const agent = await finalize();
    window.xrpc = new XRPC({handler: agent});
    window.agent = agent;
}

async function restoreSession() {
    const sessions = localStorage.getItem('atcute-oauth:sessions');
    if (!sessions) {
        return;
    }
    const did = Object.keys(JSON.parse(sessions))[0]
    const session = await getSession(did, { allowStale: true });
    const agent = new OAuthUserAgent(session)
    window.xrpc = new XRPC({handler: agent});
    window.agent = agent;
}


document.addEventListener('DOMContentLoaded', async function() {
    await handleOauth();
    await restoreSession();
    if (!window.xrpc) {
        return;
    }
    const follows = await getFollowing(xrpc)
    display(follows);
});
