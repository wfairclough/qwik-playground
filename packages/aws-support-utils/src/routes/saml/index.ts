import { type RequestHandler } from "@builder.io/qwik-city";


export const onRequest: RequestHandler = async (ev) => {
  console.log({ ev });
  const resp = {
    ok: true,
    query: [...ev.query.entries()].reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
    params: ev.params,
    basePathname: ev.basePathname,
    env: ev.env,
    headers: ev.headers,
    method: ev.method,
    url: ev.url,
  };
  ev.json(200, { ...resp });
}
