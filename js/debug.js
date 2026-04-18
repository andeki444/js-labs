document.addEventListener(
  "DOMContentLoaded",
  initDebug
);

function initDebug() {
  const toggle =
    document.getElementById(
      "debugToggle"
    );

  const panel =
    document.getElementById(
      "debugPanel"
    );

  const speed =
    document.getElementById(
      "decaySpeed"
    );

  const step =
    document.getElementById(
      "decayStep"
    );

  const action =
    document.getElementById(
      "actionTime"
    );

  toggle.addEventListener(
    "click",
    togglePanel
  );

  speed.addEventListener(
    "change",
    applySettings
  );

  step.addEventListener(
    "change",
    applySettings
  );

  action.addEventListener(
    "change",
    applySettings
  );

  function togglePanel() {
    if (
      panel.style.display ===
      "none"
    ) {
      panel.style.display =
        "block";

      toggle.textContent =
        "🔧 Панель отладки ▲";
    } else {
      panel.style.display =
        "none";

      toggle.textContent =
        "🔧 Панель отладки ▼";
    }
  }

  function applySettings() {
    if (!window.game) {
      return;
    }

    window.game.updateSettings({
      decaySpeed:
        Number(speed.value) *
        1000,

      decayStep:
        Number(step.value),

      actionTime:
        Number(action.value)
    });
  }
}