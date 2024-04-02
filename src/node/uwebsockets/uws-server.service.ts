import {
  App,
  AppOptions,
  TemplatedApp,
  us_listen_socket
} from "uWebSockets.js";
import { RouterFactory, UwsMiddleware } from "./uws.types.js";

export class UwsServerService {
  private readonly _globalMiddlewares: UwsMiddleware[] = [];
  private _boostraped: boolean = false;
  private _defaultListenCallback = (listenSocket: us_listen_socket | false) => undefined;
  private _app!: TemplatedApp;

  constructor() { }

  public __init(
    uWSConfig: AppOptions = {}
  ) {
    this._app = App(uWSConfig);
  }

  public __open(
    port: number,
    callback: (listenSocket: us_listen_socket | false) => void | Promise<void> = this._defaultListenCallback
  ): void {
    if (this._boostraped) return;

    this._boostraped = true;

    this._app.listen(port, callback);
    console.info(`${UwsServerService.name}: server listening in port '${port}'`);
  }

  public __close(): void {
    if (this._boostraped) {
      this._app.close();
      this._boostraped = false;
      console.info(UwsServerService.name);
    }
  }

  public addGlobalMiddleware(globalMiddleware: UwsMiddleware): void {
    this._globalMiddlewares.push(globalMiddleware);
    console.info(`${UwsServerService.name}: middleware added ${globalMiddleware.name}`);
  }

  public async addRouter(routerFactory: RouterFactory): Promise<void> {
    const router = await Promise.resolve(routerFactory());

    console.info(`${UwsServerService.name}: adding router '${router.routerPath}'`);
    router.addGlobalMiddlewares(this._globalMiddlewares);
    router.__init(this._app);
  }
}
