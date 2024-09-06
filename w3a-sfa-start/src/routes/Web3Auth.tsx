import { createKeyPairFromPrivateKeyBytes } from "@solana/web3.js";
import { NodeDetailManager } from "@toruslabs/fetch-node-details";
// IMP START - Quick Start
import { Torus, TorusKey } from "@toruslabs/torus.js";
import { Show, VoidComponent, createMemo, onMount } from "solid-js";

import { useAuth } from "~/contexts/useAuth";

const web3AuthClientId =
  "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

// Firebase libraries for custom authentication
// const verifier = "w3a-firebase-demo";
//
// const firebaseConfig = {
//   apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
//   authDomain: "web3auth-oauth-logins.firebaseapp.com",
//   projectId: "web3auth-oauth-logins",
//   storageBucket: "web3auth-oauth-logins.appspot.com",
//   messagingSenderId: "461819774167",
//   appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
// };

export const TORUS_SAPPHIRE_NETWORK = {
  SAPPHIRE_DEVNET: "sapphire_devnet",
  SAPPHIRE_MAINNET: "sapphire_mainnet",
} as const;
export type TORUS_NETWORK =
  (typeof TORUS_SAPPHIRE_NETWORK)[keyof typeof TORUS_SAPPHIRE_NETWORK];

const CUSTOM_JWT_VERIFIER = "w3a-custom";
const WEB3AUTH_NETWORK: TORUS_NETWORK = TORUS_SAPPHIRE_NETWORK.SAPPHIRE_DEVNET;
// const redirectUrl = "https://w3a-nomodal-start.pages.dev";

export const W3Auth: VoidComponent = () => {
  const { loginTwitter, loginDiscord, loginGoogle, email, accessToken } =
    useAuth();
  // const [web3auth, setWeb3Auth] = createSignal<Web3Auth | undefined>();
  // const [provider, setProvider] = createSignal<IProvider | null>();

  const loggedIn = createMemo(() => {
    return true;
    //   const web3 = web3auth();
    //   return web3?.connected ?? false;
  });

  // const app = initializeApp(firebaseConfig);

  // const status = createMemo(() => {
  //   const web3 = web3auth();
  //   return web3?.status;
  // });

  // createEffect(() => {
  //   console.log({ status: status() });
  // });
  //
  // createEffect(() => {
  //   console.log({ loggedIn: loggedIn() });
  // });

  // const rpc = createMemo(() => {
  //   const prov = provider();
  //   if (!prov) {
  //     return;
  //   }
  //   return new RPC(prov);
  // });
  // createEffect(() => {
  //   console.log({ rpc: rpc(), provider: provider() });
  // });

  onMount(async () => {
    console.log("on mount!");
    const nodeDetailManagerInstance = new NodeDetailManager({
      network: WEB3AUTH_NETWORK,
    });
    const torusInstance = new Torus({
      clientId: web3AuthClientId,
      enableOneKey: true,
      network: WEB3AUTH_NETWORK,
      keyType: "ed25519",
    });

    //@ts-ignore
    const verifierId: string | undefined = email();
    //@ts-ignore
    const idToken: string | undefined = accessToken();

    if (!verifierId || !idToken) {
      console.error(
        "missing email or id token, cannot retrieve share, please login first!: ",
        { verifierId, idToken },
      );
      return;
    }

    try {
      const { torusNodeEndpoints, torusIndexes, torusNodePub } =
        await nodeDetailManagerInstance.getNodeDetails({
          verifier: CUSTOM_JWT_VERIFIER,
          verifierId,
        });

      const torusKey: TorusKey = await torusInstance.retrieveShares({
        endpoints: torusNodeEndpoints,
        indexes: torusIndexes,
        verifier: CUSTOM_JWT_VERIFIER,
        verifierParams: { verifier_id: verifierId },
        idToken,
        nodePubkeys: torusNodePub,
        // useDkg: true,
      });

      const seedHex = torusKey.finalKeyData.privKey;
      if (!seedHex) {
        throw new Error("No private key found");
      }
      const seed = Buffer.from(seedHex, "hex");
      const keyPair = await createKeyPairFromPrivateKeyBytes(
        new Uint8Array(seed),
      );
      const { publicKey, privateKey } = keyPair;
      console.log({ privateKey, publicKey });
      // setWeb3Auth(web3auth);
      // setProvider(web3auth.provider);
    } catch (error) {
      console.error(error);
    }
  });

  // const loginTwitter = async () => {
  //   console.log("login!");
  //   const res = await     console.log({ res });
  //
  //   //@ts-ignore
  //   setOauthTokenSecret(res.oauth_token_secret);
  //
  //   window.location.href = res.redirect_url;
  //
  //   // const auth = web3auth();
  //   // if (!auth) {
  //   //   console.log("missing web3 auth: ", { auth });
  //   //   uiConsole("web3auth not initialized yet");
  //   //   return;
  //   // }
  //   //
  //   // // login with firebase
  //   // const loginRes = await signInWithGoogle();
  //   // // get the id token from firebase
  //   // const idToken = await loginRes.user.getIdToken(true);
  //   // const { payload } = decodeToken(idToken);
  //   //
  //   // const web3authProvider = await auth.connect({
  //   //   verifier,
  //   //   verifierId: (payload as any).sub,
  //   //   idToken,
  //   // });
  //   // console.log({ web3authProvider });
  //   // setProvider(web3authProvider);
  // };

  const authenticateUser = async () => {
    //   const auth = web3auth();
    //   if (!auth) {
    //     uiConsole("web3auth not initialized yet");
    //     return;
    //   }
    //   const idToken = await auth.authenticateUser();
    //   console.log({ idToken });
    //   uiConsole(idToken);
  };

  const getUserInfo = async () => {
    //   const auth = web3auth();
    //   if (!auth) {
    //     uiConsole("web3auth not initialized yet");
    //     return;
    //   }
    //   const user = await auth.getUserInfo();
    //   uiConsole(user);
  };

  const getPrivateKey = async () => {};
  //
  // const logout = async () => {
  //   const auth = web3auth();
  //   if (!auth) {
  //     uiConsole("web3auth not initialized yet");
  //     return;
  //   }
  //   await auth.logout();
  //   setProvider();
  //   setLoggedIn(false);
  // };
  //
  const getAccounts = async () => {
    //   const prov = provider();
    //   if (!prov) {
    //     uiConsole("provider not initialized yet");
    //     return;
    //   }
    //   const rpc = new RPC(prov);
    //   const address = await rpc.getAccounts();
    //   uiConsole(address);
  };

  const getBalance = async () => {
    //   const _rpc = rpc();
    //   if (!_rpc) {
    //     uiConsole("provider not initialized yet");
    //     return;
    //   }
    //   const balance = await _rpc.getBalance();
    //   uiConsole(balance);
  };

  // const sendTransaction = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const receipt = await _rpc.sendTransaction();
  //   uiConsole(receipt);
  // };
  //
  // const sendVersionTransaction = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const receipt = await _rpc.sendVersionTransaction();
  //   uiConsole(receipt);
  // };
  //
  // const signVersionedTransaction = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const receipt = await _rpc.signVersionedTransaction();
  //   uiConsole(receipt);
  // };
  //
  // const signAllVersionedTransaction = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const receipt = await _rpc.signAllVersionedTransaction();
  //   uiConsole(receipt);
  // };
  //
  // const signAllTransaction = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const receipt = await _rpc.signAllTransaction();
  //   uiConsole(receipt);
  // };
  //
  // // const mintNFT = async () => {
  // //   if (!provider) {
  // //     uiConsole("provider not initialized yet");
  // //     return;
  // //   }
  // //   const rpc = new RPC(provider);
  // //   const NFT = await rpc.mintNFT();
  // //   uiConsole(NFT);
  // // };
  //
  // const signMessage = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const signedMessage = await _rpc.signMessage();
  //   uiConsole(signedMessage);
  // };
  //
  // const getPrivateKey = async () => {
  //   const _rpc = rpc();
  //   if (!_rpc) {
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   const privateKey = await _rpc.getPrivateKey();
  //   console.log({ privateKey });
  //   uiConsole(privateKey);
  // };

  // createEffect(
  //   on(provider, async (prov) => {
  //     console.log({ provider: prov });
  //     await getPrivateKey();
  //   }),
  // );

  return (
    <main class="m-auto px-8 w-3/5">
      <h1 class="text-3xl text-center m-12">
        <a
          class="text-[#0070f3] decoration-transparent"
          target="_blank"
          href="https://web3auth.io/docs/sdk/pnp/web/no-modal"
          rel="noreferrer"
        >
          Web3Auth{" "}
        </a>
        & Solidjs Example
      </h1>

      <button
        onClick={async () => {
          console.log("login pressed!");
          await loginTwitter();
        }}
      >
        Login twitter
      </button>

      <button
        onClick={async () => {
          console.log("login pressed!");
          await loginDiscord();
        }}
      >
        Login discord
      </button>

      <button
        onClick={async () => {
          console.log("login pressed!");
          await loginGoogle();
        }}
      >
        Login google
      </button>

      <div class="flex items-center flex-col">
        <Show
          when={loggedIn()}
          fallback={
            <button
              onClick={async () => {
                console.log("login pressed!");
                await loginTwitter();
              }}
              class="card"
            >
              Login
            </button>
          }
        >
          <>
            <div class="flex-container">
              <div>
                <button onClick={getUserInfo} class="card">
                  Get User Info
                </button>
              </div>
              <div>
                <button onClick={authenticateUser} class="card">
                  Get ID Token
                </button>
              </div>
              <div>
                <button onClick={getAccounts} class="card">
                  Get Accounts
                </button>
              </div>
              <div>
                <button onClick={getBalance} class="card">
                  Get Balance
                </button>
              </div>
              <div>
                <button onClick={getPrivateKey} class="card">
                  Get Private Key
                </button>
              </div>
            </div>
            {/*


            <div class="flex-container">
              <div>
                <button onClick={getUserInfo} class="card">
                  Get User Info
                </button>
              </div>
              <div>
                <button onClick={authenticateUser} class="card">
                  Get ID Token
                </button>
              </div>
              <div>
                <button onClick={getAccounts} class="card">
                  Get Accounts
                </button>
              </div>
              <div>
                <button onClick={getBalance} class="card">
                  Get Balance
                </button>
              </div>
              <div>
                <button onClick={signMessage} class="card">
                  Sign Message
                </button>
              </div>
              <div>
                <button onClick={sendTransaction} class="card">
                  Send Transaction
                </button>
              </div>
              <div>
                <button onClick={sendVersionTransaction} class="card">
                  Send Version Transaction
                </button>
              </div>
              <div>
                <button onClick={signVersionedTransaction} class="card">
                  Sign Versioned Transaction
                </button>
              </div>
              <div>
                <button onClick={signAllVersionedTransaction} class="card">
                  Sign All Versioned Transaction
                </button>
              </div>
              <div>
                <button onClick={signAllTransaction} class="card">
                  Sign All Transaction
                </button>
              </div>

<div>
          <button onClick={mintNFT} class="card">
            Mint NFT
          </button>
        </div>
        *
              <div>
                <button onClick={getPrivateKey} class="card">
                  Get Private Key
                </button>
              </div>
              <div>
                <button onClick={logout} class="card">
                  Log Out
                </button>
              </div>
            </div>
            <div id="console" style={{ "white-space": "pre-line" }}>
              <p style={{ "white-space": "pre-line" }}>
                Logged in Successfully!
              </p>
            </div>
            */}
          </>
        </Show>
      </div>

      <div id="console" style={{ "white-space": "pre-line" }}>
        <p style={{ "white-space": "pre-line" }}>Status</p>
      </div>

      <footer class="flex flex-auto py-8 border border-[#eaeaea] justify-center items-center mt-40">
        <a
          class="flex justify-center items-center flex-grow"
          href="https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-no-modal-sdk/blockchain-connection-examples/solana-no-modal-example"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code
        </a>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-no-modal-sdk%2Fblockchain-connection-examples%2Fsolana-no-modal-example&project-name=w3a-solana-no-modal&repository-name=w3a-solana-no-modal">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </footer>
    </main>
  );
};
