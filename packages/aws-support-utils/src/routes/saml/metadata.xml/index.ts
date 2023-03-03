import { type RequestHandler } from '@builder.io/qwik-city';
import { metadata } from '../service-provider';

export const onGet: RequestHandler = async (ev) => {
  console.log({ ev });
  ev.headers.set('Content-Type', 'application/xml');
  ev.send(200, metadata);
}
