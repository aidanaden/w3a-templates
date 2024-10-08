import {
  COREKIT_STATUS,
  WEB3AUTH_NETWORK,
  Web3AuthMPCCoreKit,
  mnemonicToKey,
} from "@web3auth/mpc-core-kit";
import { Show, createEffect, createSignal, on, onMount } from "solid-js";
import { tssLib } from "@toruslabs/tss-frost-lib";
import { A, useNavigate } from "@solidjs/router";
import { BN } from "bn.js";

const web3AuthClientId =
  "BNBNpzCHEqOG-LIYygpzo7wsN8PDLjPjoh6GnuAwJth_prYW-pdy2O7kqE0C5lrGCnlJfCZx4_OEItGTcti6q1A"; // get from https://dashboard.web3auth.io

const coreKitInstance = new Web3AuthMPCCoreKit({
  web3AuthClientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.DEVNET,
  storage: window.localStorage,
  manualSync: true,
  tssLib,
  uxMode: "redirect",
  baseUrl: "https://w3a-templates.pages.dev",
  redirectPathName: "redirect",
});

export default function Redirect() {
  const navigate = useNavigate();
  const [coreKitStatus, setCoreKitStatus] = createSignal<COREKIT_STATUS>(
    COREKIT_STATUS.NOT_INITIALIZED,
  );
  const [backupFactorKey, setBackupFactorKey] = createSignal<string>("");
  const [mnemonicFactor, setMnemonicFactor] = createSignal<string>("");

  // decide whether to rehydrate session
  const rehydrate = true;
  onMount(async () => {
    // Example config to handle redirect result manually
    await coreKitInstance.init({ handleRedirectResult: false, rehydrate });
    if (
      window.location.hash.includes("#token_type") ||
      window.location.hash.includes("#access_token")
    ) {
      console.log("handling redirect result!");
      await coreKitInstance.handleRedirectResult();
    }

    if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
      console.log("logged in!!!");
      // await setupProvider();
    }

    if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
      uiConsole(
        "required more shares, please enter your backup/ device factor key, or reset account unrecoverable once reset, please use it with caution]",
      );
    }

    console.log("coreKitInstance.status", coreKitInstance.status);
    setCoreKitStatus(coreKitInstance.status);

    // try {
    //   let result = securityQuestion.getQuestion(coreKitInstance!);
    //   setQuestion(result);
    //   uiConsole("security question set");
    // } catch (e) {
    //   uiConsole("security question not set");
    // }
  });

  const inputBackupFactorKey = async () => {
    if (!coreKitInstance) {
      throw new Error("coreKitInstance not found");
    }
    const backup = backupFactorKey();
    if (!backup) {
      throw new Error("backupFactorKey not found");
    }
    const factorKey = new BN(backup, "hex");
    await coreKitInstance.inputFactorKey(factorKey);

    setCoreKitStatus(coreKitInstance.status);

    if (coreKitInstance.status === COREKIT_STATUS.REQUIRED_SHARE) {
      uiConsole(
        "Required more shares even after inputing backup factor key, please enter your backup/ device factor key, or reset account [unrecoverable once reset, please use it with caution]",
      );
    }
  };

  const getDeviceFactor = async () => {
    try {
      const factorKey = await coreKitInstance.getDeviceFactor();
      setBackupFactorKey(factorKey!);
      uiConsole("Device share: ", factorKey);
    } catch (e) {
      uiConsole(e);
    }
  };

  const MnemonicToFactorKeyHex = async (mnemonic: string) => {
    if (!coreKitInstance) {
      throw new Error("coreKitInstance is not set");
    }
    try {
      const factorKey = mnemonicToKey(mnemonic);
      setBackupFactorKey(factorKey);
      return factorKey;
    } catch (error) {
      uiConsole(error);
    }
  };

  const logout = async () => {
    await coreKitInstance.logout();
    setCoreKitStatus(coreKitInstance.status);
    uiConsole("Logged out");
  };

  const criticalResetAccount = async (): Promise<void> => {
    // This is a critical function that should only be used for testing purposes
    // Resetting your account means clearing all the metadata associated with it from the metadata server
    // The key details will be deleted from our server and you will not be able to recover your account
    if (!coreKitInstance) {
      throw new Error("coreKitInstance is not set");
    }

    await coreKitInstance.tKey.storageLayer.setMetadata({
      privKey: new BN(coreKitInstance.state.postBoxKey!, "hex"),
      input: { message: "KEY_NOT_FOUND" },
    });

    if (coreKitInstance.status === COREKIT_STATUS.LOGGED_IN) {
      await coreKitInstance.commitChanges();
    }
    uiConsole("Reset successful");
    await logout();
  };

  createEffect(
    on(coreKitStatus, (status) => {
      console.log({ corekitstatus: status });
      if (status === COREKIT_STATUS.LOGGED_IN) {
        console.log("logged in, navigating home!");
        navigate("/");
      }
    }),
  );

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Show when={coreKitStatus() === COREKIT_STATUS.REQUIRED_SHARE}>
        <div>
          <button onClick={() => getDeviceFactor()} class="card">
            Get Device Factor
          </button>
          <label>Recover Using Mnemonic Factor Key:</label>
          <input
            value={mnemonicFactor()}
            onChange={(e) => setMnemonicFactor(e.target.value)}
          ></input>
          <button
            onClick={() => MnemonicToFactorKeyHex(mnemonicFactor())}
            class="card"
          >
            Get Recovery Factor Key using Mnemonic
          </button>
          <label>Backup/ Device Factor: {backupFactorKey()}</label>
          <button onClick={() => inputBackupFactorKey()} class="card">
            Input Backup Factor Key
          </button>
          <button onClick={criticalResetAccount} class="card">
            [CRITICAL] Reset Account
          </button>
        </div>
      </Show>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        About Page
      </h1>
      <p class="mt-8">
        Visit{" "}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="text-sky-600 hover:underline"
        >
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="text-sky-600 hover:underline">
          Home
        </A>
        {" - "}
        <span>About Page</span>
      </p>
    </main>
  );
}
