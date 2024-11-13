window.addEventListener("load", () => {
  // Fix for iOS safari, old screen and new screen manifest update issue
  (
    document.getElementsByTagName("HTML").item(0)! as HTMLHtmlElement
  ).style.setProperty("height", "100vh");
  setTimeout(() => {
    (
      document.getElementsByTagName("HTML").item(0)! as HTMLHtmlElement
    ).style.setProperty("height", "100dvh");
  }, 50);
});
