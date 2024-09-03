import { useSearchParams } from "@solidjs/router";
import { Component, createEffect } from "solid-js";

const Page: Component = () => {
  const [searchParams] = useSearchParams<{
    oauth_token: string;
    oauth_verifier: string;
  }>();

  // const navigate = useNavigate();
  // async function callback(oauthToken: string, oauthVerifier: string) {
  //   const secret = oauthTokenSecret();
  //   if (!secret) {
  //     console.error("callback: FAILED, missing oauth_token_secret!");
  //     return;
  //   }
  //   const { screen_name, access_token, refresh_token } =
  //     await ApiClient.callbackGet({
  //       oauth_verifier: oauthVerifier,
  //       oauth_token: oauthToken,
  //       oauth_token_secret: secret,
  //     });
  //   batch(() => {
  //     setScreenName(screen_name);
  //     setAccessToken(access_token);
  //     setRefreshToken(refresh_token);
  //   });
  //
  //   navigate("/");
  // }

  // onMount(async () => {
  //   const { oauth_token, oauth_verifier } = searchParams;
  //   if (!oauth_token || !oauth_verifier) {
  //     console.error(
  //       "callback: FAILED, missing oauth_token or oauth_verifier in callback url",
  //     );
  //     return;
  //   }
  //   await callback(oauth_token, oauth_verifier);
  // });

  createEffect(() => {
    const { oauth_token, oauth_verifier } = searchParams;
    console.log({ oauth_token, oauth_verifier });
  });

  return (
    <>
      <div class="items flex flex-1 justify-center p-3">Redirecting...</div>
    </>
  );
};

export default Page;
