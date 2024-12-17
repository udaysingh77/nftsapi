import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}



// import "../styles/globals.css";
// import { ChainId,ThirdwebProvider } from "@thirdweb-dev/sdk";
// import { StateContextProvider } from "../Context/NFTs";

// export default function App({ Component, pageProps }) {
//   return (
//     <ThirdwebProvider activeChain={ChainId.Mumbai}>
//       <StateContextProvider>
//       <Component {...pageProps} />;
//       </StateContextProvider>
//     </ThirdwebProvider>
//   )
// }