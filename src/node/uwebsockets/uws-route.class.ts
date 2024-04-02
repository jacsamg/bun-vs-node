import {
  HttpRequest,
  HttpResponse,
} from "uWebSockets.js";
import {
  UwsAbortedHandler,
  UwsErrorHandler,
  UwsErrorHandlerResponse,
  UwsMiddleware,
  UwsServerRouteConfig
} from "./uws.types.js";

export class UwsServerRoute {
  private readonly _allMiddlewares: UwsMiddleware[] = [];
  private _bootstraped: boolean = false;

  public get method() { return this.config.path.method; };
  public get url() { return this.config.path.url; };
  public get routeMiddlewares() { return this.config.routeMiddleware; };

  constructor(private readonly config: UwsServerRouteConfig) { }

  public __init() {
    if (this._bootstraped) return;
    this._bootstraped = true;
  }

  public addGlobalMiddlewares(globalMiddlewares: UwsMiddleware[]) {
    if (this._bootstraped) return;
    this._allMiddlewares.push(...globalMiddlewares);
  }

  public addRouterMiddlewares(routerMiddlewares: UwsMiddleware[]) {
    if (this._bootstraped) return;
    this._allMiddlewares.push(...routerMiddlewares);
  }

  public addRouteMiddlewares(routeMiddlewares?: UwsMiddleware[]) {
    if (this._bootstraped) return;
    if (routeMiddlewares) this._allMiddlewares.push(...routeMiddlewares);
  }

  private async defaultAbortedHandler(res: HttpResponse, abortedHandler?: UwsAbortedHandler): Promise<void> {
    try {
      res.aborted = true;

      console.error(`${UwsServerRoute.name}, ${this.defaultAbortedHandler.name}:`, "Aborted request");
      if (abortedHandler) await Promise.resolve(abortedHandler());
    } catch (error: any) {
      console.error(`${UwsServerRoute.name}, ${this.defaultAbortedHandler.name}:`, error);
    }
  }

  private async defaultErrorHandler(res: HttpResponse, error: any, errorHandler?: UwsErrorHandler): Promise<void> {
    try {
      let errorResponse: UwsErrorHandlerResponse = {
        success: false,
        errorMessage: error?.message || error
      };

      if (errorHandler) {
        errorResponse = await Promise.resolve(errorHandler(error));
      }

      console.error(`${UwsServerRoute.name}, ${this.defaultErrorHandler.name}:`, errorResponse.errorMessage);
      console.debug(error);
      res.cork(() => {
        res.writeStatus("500");
        res.end(JSON.stringify(errorResponse));
      });
    } catch (error: any) {
      console.error(`${UwsServerRoute.name}, ${this.defaultErrorHandler.name}:`, error);
    }
  }

  public async handler(res: HttpResponse, req: HttpRequest): Promise<void> {
    res.aborted = false;

    res.onAborted(async () => await this.defaultAbortedHandler(res, this.config.abortedHandler));

    try {
      let next = true;

      if (this.config.routeMiddleware?.length) {
        for (const middleware of this.config.routeMiddleware) {
          next = await Promise.resolve(middleware(req, res));

          if (!next) break;
        }
      }

      if (next) await Promise.resolve(this.config.handler(req, res));
    } catch (error: any) {
      await Promise.resolve(this.defaultErrorHandler(res, error, this.config.errorHandler));
    }
  }
}
