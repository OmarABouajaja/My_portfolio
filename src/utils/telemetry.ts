export type ClientTelemetry = {
  os: string;
  browser: string;
  resolution: string;
  timezone: string;
  isBot: boolean;
  userAgent: string;
  languages: string;
  deviceMemory: string;
  hardwareConcurrency: number;
  gpuRenderer: string;
  networkType: string;
  touchSupport: boolean;
  pixelRatio: number;
};

export function gatherClientTelemetry(): ClientTelemetry {
  // Detect OS
  let os = "UNKNOWN_OS";
  const userAgent = window.navigator.userAgent;
  const userAgentLower = userAgent.toLowerCase();
  if (userAgentLower.indexOf("win") !== -1) os = "WINDOWS";
  if (userAgentLower.indexOf("mac") !== -1) os = "MACOS";
  if (userAgentLower.indexOf("linux") !== -1) os = "LINUX";
  if (userAgentLower.indexOf("x11") !== -1) os = "UNIX";
  if (userAgentLower.indexOf("android") !== -1) os = "ANDROID";
  if (userAgentLower.indexOf("iphone") !== -1 || userAgentLower.indexOf("ipad") !== -1) os = "IOS";

  // Detect Browser
  let browser = "UNKNOWN_ENGINE";
  if (userAgentLower.indexOf("chrome") !== -1 && userAgentLower.indexOf("edg") === -1 && userAgentLower.indexOf("opr") === -1) browser = "CHROME";
  else if (userAgentLower.indexOf("safari") !== -1 && userAgentLower.indexOf("chrome") === -1) browser = "SAFARI";
  else if (userAgentLower.indexOf("firefox") !== -1) browser = "FIREFOX";
  else if (userAgentLower.indexOf("edg") !== -1) browser = "EDGE";
  else if (userAgentLower.indexOf("opr") !== -1 || userAgentLower.indexOf("opera") !== -1) browser = "OPERA";

  // Screen Resolution
  const resolution = `${window.screen.width}x${window.screen.height}`;

  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UNKNOWN_TZ";

  // Bot Detection (Honeypot)
  const isWebdriver = window.navigator.webdriver === true;
  const isBotAgent = /bot|crawler|spider|crawling|googlebot|bingbot|yandexbot/i.test(userAgentLower);
  const isHeadless = window.outerWidth === 0 && window.outerHeight === 0;
  const isBot = isWebdriver || isBotAgent || isHeadless;

  // Preferred Languages
  const languages = navigator.languages ? navigator.languages.join(", ") : navigator.language || "unknown";

  // Hardware cores and RAM (if supported)
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  const deviceMemory = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : "unknown";

  // Connection information (Network Information API)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const networkType = connection?.effectiveType || "unknown";

  // Touch Support
  const touchSupport = navigator.maxTouchPoints > 0;

  // Pixel ratio (Retina screens, high-dpi displays)
  const pixelRatio = window.devicePixelRatio || 1;

  // GPU info via WebGL
  let gpuRenderer = "UNKNOWN_GPU";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const dbgRenderInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbgRenderInfo) {
        gpuRenderer = gl.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL) || "UNKNOWN_GPU";
      } else {
        gpuRenderer = gl.getParameter(gl.RENDERER) || "UNKNOWN_GPU";
      }
    }
  } catch {
    // ignore
  }

  return {
    os,
    browser,
    resolution,
    timezone,
    isBot,
    userAgent,
    languages,
    deviceMemory,
    hardwareConcurrency,
    gpuRenderer,
    networkType,
    touchSupport,
    pixelRatio,
  };
}
