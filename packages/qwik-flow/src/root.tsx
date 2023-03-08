import { Counter } from "./components/counter/counter";
import { QOverviewFlow } from "./components/flow/overview";

export default () => {
  return (
    <>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik Blank App</title>
        <link
          rel="stylesheet"
          href="../node_modules/reactflow/dist/style.css"
        />
      </head>
      <body>
        <Counter />
        <QOverviewFlow />
      </body>
    </>
  );
};
