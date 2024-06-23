export default {
  async fetch(): Promise<Response> {
    return new Response('Hello world');
  },
};
