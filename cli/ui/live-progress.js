import process from "node:process";

import { ansi } from "./ansi.js";

// Keep the startup UI self-contained for both Git and archive installations.
const defaultSpinner = { interval: 80, frames: [..."⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏"] };

export function canRenderLiveProgress(stream = process.stdout) {
  return Boolean(stream?.isTTY && typeof stream.write === "function");
}

export function createLiveProgress({
  stream = process.stdout,
  spinner = defaultSpinner,
  setIntervalImplementation = globalThis.setInterval,
  clearIntervalImplementation = globalThis.clearInterval
} = {}) {
  const spinnerDefinition = spinner ?? defaultSpinner;
  let active = false;
  let timerHandle = null;
  let frameIndex = 0;
  let currentText = "";

  function renderCurrentFrame() {
    if (!active) {
      return;
    }

    const frame = spinnerDefinition.frames[frameIndex % spinnerDefinition.frames.length];
    stream.write(
      `${ansi.carriageReturn}${ansi.clearLine}${frame} ${currentText}`
    );
  }

  function start(initialText = "") {
    if (!canRenderLiveProgress(stream) || active) {
      return false;
    }

    active = true;
    currentText = String(initialText);
    stream.write(ansi.hideCursor);
    renderCurrentFrame();
    timerHandle = setIntervalImplementation(() => {
      frameIndex = (frameIndex + 1) % spinnerDefinition.frames.length;
      renderCurrentFrame();
    }, spinnerDefinition.interval);
    return true;
  }

  function update(nextText) {
    currentText = String(nextText ?? "");
    if (active) {
      renderCurrentFrame();
    }
  }

  function stop(finalLine = "") {
    if (!active) {
      return;
    }

    active = false;
    if (timerHandle !== null) {
      clearIntervalImplementation(timerHandle);
      timerHandle = null;
    }

    stream.write(
      `${ansi.carriageReturn}${ansi.clearLine}${finalLine}\n${ansi.showCursor}`
    );
  }

  return {
    start,
    update,
    stop
  };
}
