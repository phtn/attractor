"use client";
import { animate, svg, stagger } from "animejs";
import { useEffect } from "react";

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
  //
  useEffect(() => {
    animate(svg.createDrawable(".logo-outline"), {
      draw: ["0 0", "0 0.5", "0 1", "1 1"],
      ease: "inOutQuad",
      duration: 1600,
      delay: stagger(50),
      loop: true,
      autoplay: true,
    });
  }, []);

  return (
    <div>
      <svg
        width="600"
        height="600"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="scale-[16%] text-slate-400 dark:text-slate-200"
      >
        <path
          className="logo-outline"
          d="M442 437.562V166C442 158 442 158 434 158H166C158 158 158 158 158 166V434C158 442 158 442 166 442H300M442 446.438V555.825C442 584 442 584 470.175 584H584V470.175C584 442 584 442 555.825 442H300M300 442V555.825C300 584 300 584 271.825 584H44.1746C16 584 16 584 16 555.825V44.1746C16 16 16 16 44.1746 16H555.825C584 16 584 16 584 44.1746V271.825C584 300 584 300 555.825 300H443M300 442V302C300 300 300 300 302 300H441"
          stroke="currentColor"
          strokeWidth={10}
        />
      </svg>
    </div>
  );
};
