import { isIos } from "@/support/isIos";

const invisibleLayer = (style: Partial<CSSStyleDeclaration>) => {
  const layer = document.createElement("div");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    background: "rgba(255, 255, 255, 0.01)",
    pointerEvents: "none",
    ...style
  });
  return layer;
};

/**
 * iOS 27 workaround: standalone PWAs get a system blur over the top of the
 * screen. Sliding a (nearly invisible) fixed panel in and out once removes it.
 * https://tips.ojapp.app/en/ios-27-pwa-top-blur-workaround-2/
 */
window.addEventListener("load", () => {
  if (!matchMedia("(display-mode: standalone)").matches || !isIos()) return;

  const cover = invisibleLayer({ display: "none", zIndex: "2147483646" });
  const panel = invisibleLayer({
    left: "auto",
    width: "90%",
    zIndex: "2147483647",
    transform: "translateX(110%)",
    transition: "transform 0.3s"
  });
  document.body.append(cover, panel);
  void panel.offsetWidth;

  requestAnimationFrame(() => {
    cover.style.display = "block";
    panel.style.transform = "translateX(0%)";
    setTimeout(() => {
      cover.style.display = "none";
      // keep the panel outside the viewport instead of removing it
      panel.style.transform = "translateX(110%)";
    }, 500);
  });
});
