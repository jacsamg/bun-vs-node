import {
  TemplatedApp
} from "uWebSockets.js";
import {
  PathMethod,
  UwsMiddleware,
  UwsServerRouteConfig
} from "./uws.types.js";
import { UwsServerRoute } from "./uws-route.class.js";

export class UwsServerRouter {
  private readonly _routes: UwsServerRoute[] = [];
  private readonly _globalMiddlewares: UwsMiddleware[] = [];
  private readonly _routerMiddlewares: UwsMiddleware[] = [];
  private _bootstraped: boolean = false;
  private _routerPath: string = "";

  public get routerPath() { return this._routerPath; }

  constructor() { }

  public __init(app: TemplatedApp): void {
    if (this._bootstraped) return;

    for (const route of this._routes) {
      const url = this.routerPath + route.url;

      route.__init();

      switch (route.method) {
        case PathMethod.get:
          app.get(url, route.handler.bind(route));
          break;
        case PathMethod.post:
          app.post(url, route.handler.bind(route));
          break;
        case PathMethod.any:
          app.any(url, route.handler.bind(route));
          break;
      }

      console.info(`${UwsServerRouter.name}: route added [${route.method}] -> '${url}'`);
    }

    this._bootstraped = true;
  }

  public addRouterPath(path: string): void {
    if (this._bootstraped) return;
    this._routerPath = path;
  }

  public addGlobalMiddlewares(_globalMiddlewares: UwsMiddleware[]): void {
    if (this._bootstraped) return;
    this._globalMiddlewares.push(..._globalMiddlewares);
  }

  public addRouterMiddleware(middleware: UwsMiddleware): void {
    if (this._bootstraped) return;
    this._routerMiddlewares.push(middleware);
  }

  public addRoute(route: UwsServerRoute): void {
    if (this._bootstraped) return;

    route.addGlobalMiddlewares(this._globalMiddlewares);
    route.addRouterMiddlewares(this._routerMiddlewares);
    route.addRouteMiddlewares(route.routeMiddlewares);
    this._routes.push(route);
  }

  public makeRoutes(...routesConfig: UwsServerRouteConfig[]): void {
    if (this._bootstraped) return;

    for (const routeConfig of routesConfig) {
      this.addRoute(new UwsServerRoute(routeConfig));
    }
  }
}
