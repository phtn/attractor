"use client";
import { Icon } from "@/lib/icons";
import { animate, svg, stagger } from "animejs";

export const Tracer = () => {
  // animate(".s", {
  //   ease: "linear",
  //   duration: 5000,
  //   loop: true,
  //   ...svg.createMotionPath("path"),
  // });

  // Line drawing animation following the motion path values
  // For demo aesthetic only
  // animate(svg.createDrawable("path"), {
  //   draw: "0 1",
  //   ease: "linear",
  //   duration: 5000,
  //   loop: true,
  // });

  animate(svg.createDrawable("ellipse, path"), {
    draw: ["0 0", "0 0.75", "1 1"],
    ease: "inOutQuad",
    duration: 2000,
    delay: stagger(50),
    loop: true,
    autoplay: true,
  });
  return (
    <div className="absolute p-4 inset-0 bg-black/0 transition-colors">
      <Icon name="re-up.ph" className="size-96" solid />
    </div>
  );
};
