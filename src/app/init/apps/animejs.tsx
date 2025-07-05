"use client";
import { Icon } from "@/lib/icons";
import { animate, svg } from "animejs";
// Animate the transforms properties of .car the motion path values

export const AnimeJS = () => {
  animate(".car", {
    ease: "linear",
    duration: 5000,
    loop: true,
    ...svg.createMotionPath("path"),
  });

  // Line drawing animation following the motion path values
  // For demo aesthetic only
  animate(svg.createDrawable("path"), {
    draw: "0 1",
    ease: "linear",
    duration: 5000,
    loop: true,
  });
  return (
    <div className="absolute p-4 inset-0 bg-black/0 transition-colors">
      <Icon
        size={36}
        name="re-up.ph"
        className="square car motion-path-car"
        // style={{ transform: "translateX(189px) translateY(4px)" }}
      />
      {/* <div
        className="square car motion-path-car"
        style={{ transform: "translateX(189px) translateY(4px)" }}
      ></div> */}
    </div>
  );
};
