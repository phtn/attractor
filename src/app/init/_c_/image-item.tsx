import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";
import { CatZod } from "@/components/tanstack/form/schema";

export const CardImageItem = <T extends CatZod>(props: T) => {
  return (
    <CardContainer
      className={`group/card rounded-3xl dark:bg-card-origin/44 h-fit w-full relative cursor-pointer`}
    >
      <CardBody className="bg-slate-300 relative dark:hover:shadow-2xl dark:hover:shadow-cyan-50/[0.5] dark:bg-void dark:border-void border-black/[0.1] w-auto sm:w-[30rem] p-px h-auto rounded-3xl border transition-shadow duration-700 ease-in-out">
        <CardItem
          as="div"
          translateZ={2500}
          className="p-2 rounded-lg m-2 bg-cream/10 backdrop-blur-sm absolute z-10"
        >
          <span className="text-neutral-300 tracking-tighter font-semibold">
            I feel it coming.
          </span>
        </CardItem>
        <CardItem
          translateZ={150}
          translateX={1000}
          className="w-full scale-[101%] group-hover/card:scale-[103%]"
          as="div"
        >
          <Image
            width={0}
            height={0}
            unoptimized
            alt="thumbnail"
            src="https://media.ed.edmunds-media.com/hyundai/n-vision-74/hero/hyundai_n-vision-74_prf_hero_714221_1280.jpg"
            className="h-auto md:min-w-96 w-auto aspect-auto object-cover rounded-b-md rounded-t-3xl shadow-2xs select-none"
          />
        </CardItem>
        <div className="flex justify-between items-center px-5 py-3">
          <CardItem
            as="button"
            translateZ={20}
            className="py-2 font-sans capitalize tracking-tighter rounded-xl dark:text-lime-100 dark:bg-black/0 text-slate-700 md:text-base text-sm font-semibold"
          >
            {props.name}
          </CardItem>
          <CardItem
            as="a"
            translateZ={60}
            className="px-2 py-1.5 rounded-lg text-sm font-medium bg-mac-red/80 text-white dark:text-white dark:bg-chalk/5"
          >
            enter →
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};
