// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";

import { Buffer } from "buffer";
import process from "process";
(window as any).Buffer = Buffer;
window.process = process;
mount(() => <StartClient />, document.getElementById("app")!);
