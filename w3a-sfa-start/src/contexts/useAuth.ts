import { makePersisted } from "@solid-primitives/storage";
import { useNavigate } from "@solidjs/router";
import { batch, createEffect, createSignal } from "solid-js";
import { createContextProvider } from "@solid-primitives/context";

import { ApiClient } from "~/api/ApiClient";

const [AuthProvider, _useAuth] = createContextProvider(() => {
  const navigate = useNavigate();

  const [email, setEmail] = makePersisted(createSignal<string | undefined>(), {
    name: "email",
  });
  const [oauthTokenSecret, setOauthTokenSecret] = makePersisted(
    createSignal<string | undefined>(),
    { name: "oauth_token_secret" },
  );
  const [state, setState] = makePersisted(createSignal<string | undefined>(), {
    name: "state",
  });
  const [accessToken, setAccessToken] = makePersisted(
    createSignal<string | undefined>(),
    { name: "access" },
  );
  const [refreshToken, setRefreshToken] = makePersisted(
    createSignal<string | undefined>(),
    { name: "refresh" },
  );

  // Wait till first refresh query has been ran
  // to determine initial Step state
  const [hasRefreshedOnMount, setHasRefreshedOnMount] =
    createSignal<boolean>(false);

  // async function refetchStatus() {
  //   await revalidate("status");
  // }

  async function callbackTwitter(oauthToken: string, oauthVerifier: string) {
    //@ts-ignore
    const secret = oauthTokenSecret();
    if (!secret) {
      console.error("callback: FAILED, missing oauth_token_secret!");
      return;
    }
    const { email, access_token, refresh_token } =
      await ApiClient.callbackTwitterGet({
        oauth_verifier: oauthVerifier,
        oauth_token: oauthToken,
        oauth_token_secret: secret,
      });

    batch(() => {
      //@ts-ignore
      setEmail(email);
      //@ts-ignore
      setAccessToken(access_token);
      //@ts-ignore
      setRefreshToken(refresh_token);
      //@ts-ignore
      setOauthTokenSecret();
    });

    navigate("/");
  }

  async function loginTwitter() {
    const { redirect_url, oauth_token_secret } =
      await ApiClient.loginTwitterGet();

    //@ts-ignore
    setOauthTokenSecret(oauth_token_secret);

    // Redirect to twitter url
    window.location.href = redirect_url;
  }

  async function loginDiscord() {
    const { redirect_url, state: _state } = await ApiClient.loginDiscordGet();

    //@ts-ignore
    setState(_state);

    // Redirect to twitter url
    window.location.href = redirect_url;
  }

  async function callbackDiscord(code: string, receivedState: string) {
    //@ts-ignore
    const _state = state();
    if (!_state) {
      console.error(
        "callback: FAILED, state recieved from original discord signin request missing!",
      );
      return;
    }
    if (_state !== receivedState) {
      console.error("callback: FAILED, mismatched state values!", {
        state,
        _state,
      });
    }
    const { email, access_token, refresh_token } =
      await ApiClient.callbackDiscordGet({
        code,
      });

    batch(() => {
      //@ts-ignore
      setEmail(email);
      //@ts-ignore
      setAccessToken(access_token);
      //@ts-ignore
      setRefreshToken(refresh_token);
      //@ts-ignore
      setState();
    });

    navigate("/");
  }

  async function loginGoogle() {
    const { redirect_url, state: _state } = await ApiClient.loginGoogleGet();

    //@ts-ignore
    setState(_state);

    // Redirect to twitter url
    window.location.href = redirect_url;
  }

  async function callbackGoogle(code: string, receivedState: string) {
    //@ts-ignore
    const _state = state();
    if (!_state) {
      console.error(
        "callback: FAILED, state recieved from original discord signin request missing!",
      );
      return;
    }
    if (_state !== receivedState) {
      console.error("callback: FAILED, mismatched state values!", {
        state,
        _state,
      });
    }
    const { email, access_token, refresh_token } =
      await ApiClient.callbackGoogleGet({
        code,
      });

    batch(() => {
      //@ts-ignore
      setEmail(email);
      //@ts-ignore
      setAccessToken(access_token);
      //@ts-ignore
      setRefreshToken(refresh_token);
      //@ts-ignore
      setState();
    });

    navigate("/");
  }

  createEffect(() => {
    const em = typeof email == "function" ? email() : email;
    console.log({ email: em ?? "missing email!" });
  });

  // function setInitialRefresh() {
  //   const refreshed = hasRefreshedOnMount();
  //   if (!refreshed) {
  //     setHasRefreshedOnMount(true);
  //   }
  // }
  //
  // async function refresh() {
  //   const access = accessToken();
  //   const refresh = refreshToken();
  //   if (!refresh || !access) {
  //     console.error("refresh: FAILED, not authenticated!");
  //     setInitialRefresh();
  //     return;
  //   }
  //   try {
  //     const { access_token, refresh_token } = await ApiClient.refreshPost(
  //       {
  //         refresh_token: refresh,
  //       },
  //       access,
  //     );
  //     batch(() => {
  //       setInitialRefresh();
  //       setAccessToken(access_token);
  //       setRefreshToken(refresh_token);
  //     });
  //   } catch (e) {
  //     console.error("refresh FAILED, error: ", { e });
  //     setInitialRefresh();
  //   }
  // }
  //
  // async function logout() {
  //   batch(() => {
  //     setScreenName();
  //     setAccessToken();
  //     setRefreshToken();
  //   });
  // }

  // onMount(async () => {
  //   await refresh();
  //   const interval = setInterval(
  //     async () => {
  //       try {
  //         await refresh();
  //       } catch (e) {
  //         console.error("refresh timeout FAILED: ", { e });
  //       }
  //     },
  //     1000 * 60 * 4,
  //   );
  //   onCleanup(() => {
  //     clearInterval(interval);
  //   });
  // });

  return {
    // state
    email,
    accessToken,
    hasRefreshedOnMount,

    // login actions
    loginTwitter,
    callbackTwitter,
    loginDiscord,
    callbackDiscord,
    loginGoogle,
    callbackGoogle,
    // refresh,
    // logout,

    // actions
    // appeal,
    // signup,
    // refetchStatus,
  };
});

const useAuth = () => {
  const context = _useAuth();
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
