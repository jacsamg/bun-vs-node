import { appRouter } from "./app.router.js";
import { UwsServerService } from "./uwebsockets/index.js";

(async () => {
  try {
    // ================================================================================
    // Definitions
    // ================================================================================
    const uwsServerService = new UwsServerService();
    const serverPort = parseInt("86");

    uwsServerService.__init();
    await uwsServerService.addRouter(appRouter);
    uwsServerService.__open(serverPort);
  } catch (error: any) {
    console.error(error?.message || error);
  }
})();

