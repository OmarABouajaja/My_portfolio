export type ClientTelemetry = {
  os: string;
  browser: string;
  resolution: string;
  timezone: string;
  isBot: boolean;
};

export function gatherClientTelemetry(): ClientTelemetry {
  // Detect OS
  let os = "UNKNOWN_OS";
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.indexOf("win") !== -1) os = "WINDOWS";
  if (userAgent.indexOf("mac") !== -1) os = "MACOS";
  if (userAgent.indexOf("linux") !== -1) os = "LINUX";
  if (userAgent.indexOf("x11") !== -1) os = "UNIX";
  if (userAgent.indexOf("android") !== -1) os = "ANDROID";
  if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) os = "IOS";

  // Detect Browser
  let browser = "UNKNOWN_ENGINE";
  if (userAgent.indexOf("chrome") !== -1 && userAgent.indexOf("edg") === -1 && userAgent.indexOf("opr") === -1) browser = "CHROME";
  else if (userAgent.indexOf("safari") !== -1 && userAgent.indexOf("chrome") === -1) browser = "SAFARI";
  else if (userAgent.indexOf("firefox") !== -1) browser = "FIREFOX";
  else if (userAgent.indexOf("edg") !== -1) browser = "EDGE";
  else if (userAgent.indexOf("opr") !== -1 || userAgent.indexOf("opera") !== -1) browser = "OPERA";

  // Screen Resolution
  const resolution = `${window.screen.width}x${window.screen.height}`;

  // Timezone
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UNKNOWN_TZ";

  // Bot Detection (Honeypot)
  // 1. `webdriver` is true for puppeteer / selenium
  // 2. Check common bot signatures in user agent
  const isWebdriver = window.navigator.webdriver === true;
  const isBotAgent = /bot|crawler|spider|crawling|googlebot|bingbot|yandexbot/i.test(userAgent);
  
  // PhantomJS / NightmareJS specific hacks
  const isHeadless = window.outerWidth === 0 && window.outerHeight === 0;

  const isBot = isWebdriver || isBotAgent || isHeadless;

  return { os, browser, resolution, timezone, isBot };
}
