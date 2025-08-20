import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Image from "next/image";

export const CardImageItem = () => {
  return (
    <CardContainer
      className={`group/card rounded-xl dark:bg-zinc-100 bg-radial-[at_10%_80%] dark:from-zinc-400/60 dark:to-mac-cyan/80 from-mac-red/30 to-mac-indigo/20 h-fit w-full relative cursor-pointer`}
    >
      <CardBody className=" bg-slate-300 dark:bg-slate-600/50 pentax relative rounded-xl overflow-hidden dark:hover:shadow-2xl dark:hover:shadow-cyan-50/[0.5] w-auto sm:w-[30rem] p-px h-auto transition-shadow duration-700 ease-in-out">
        <CardItem
          translateZ={150}
          translateX={1000}
          className="w-full h-auto scale-[100%] group-hover/card:scale-[104%]"
          as="div"
        >
          <Image
            priority
            width={0}
            height={0}
            unoptimized
            alt="thumbnail"
            src={"" as string}
            // src="https://media.ed.edmunds-media.com/hyundai/n-vision-74/hero/hyundai_n-vision-74_prf_hero_714221_1280.jpg"
            className="h-auto w-auto hidden aspect-auto object-cover rounded-md shadow-2xs select-none"
          />
        </CardItem>
        {/* <div className="justify-between hidden items-center px-5 py-3">
          <CardItem
            as="button"
            translateZ={20}
            className="py-2 font-sans capitalize tracking-tighter rounded-xl dark:text-lime-100 dark:bg-black/0 text-slate-700 md:text-base text-sm font-semibold"
          >
            {props.name}
          </CardItem>
          <CardItem
            as="a"
            onClick={route(`/init/${props.href}`)}
            translateZ={60}
            className="flex items-center justify-center px-2 penta-slim text-sm font-medium bg-mac-red/80 text-white dark:text-white dark:bg-chalk/5"
          >
            <span>enter →</span>
          </CardItem>
        </div> */}
      </CardBody>
    </CardContainer>
  );
};
