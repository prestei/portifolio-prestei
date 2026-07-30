/**
 * Motion.dev bridge (motion package via esm.sh)
 * Exposes window.Motion = { animate, stagger, inView, scroll }
 */
import {
  animate,
  stagger,
  inView,
  scroll,
} from "https://esm.sh/motion@11.18.0";

window.Motion = { animate, stagger, inView, scroll };
window.dispatchEvent(new CustomEvent("motion:ready"));
