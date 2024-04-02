import { HttpRequest, HttpResponse } from "uWebSockets.js";
import { PathMethod, UwsServerRouter, sendJson } from "./uwebsockets/index.js";


export function appPingHandler(req: HttpRequest, res: HttpResponse) {
  return sendJson(res, { success: true });
}

export function appRouter(): UwsServerRouter {
  const router = new UwsServerRouter();

  router.addRouterPath("/test");
  router.makeRoutes(
    {
      path: { method: PathMethod.get, url: "/json" },
      handler: appPingHandler
    }
  );

  return router;
}
