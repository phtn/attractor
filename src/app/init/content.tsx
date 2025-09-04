"use client";

import { Icon } from "@/lib/icons";
import { XCardProps } from "@/components/hyper/xcard";
import {
  ContainerTextFlip,
  TextFlip,
} from "@/components/ui/container-text-flip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { type IconName } from "@/lib/icons";

export const Content = () => {
  return (
    <div>
      <Hero />
      <div className="w-full bg-green-300"></div>
    </div>
  );
};

const Hero = () => (
  <div className="flex-1 w-full p-2 h-[32rem] flex items-center justify-center">
    <h1 className="w-[28rem] h-[16rem] border-r border-foreground/5 bg-foreground/10 backdrop-blur-lg justify-center items-center flex-col flex -space-y-1 text-center tracking-tighter">
      <div>
        <ContainerTextFlip
          words={[
            "Automated",
            "Secure",
            "Reliable",
            "Monitor",
            "Better",
            "Upgrade",
            "Scalable",
            "Serverless",
            "Self-Hosted",
          ]}
          className="text-4xl"
        />
      </div>
      <div className="flex flex-col items-center justify-center text-3xl">
        <TextFlip
          className="bg-transparent dark:bg-transparent text-5xl font-bold"
          words={[
            "Workflows",
            "Process",
            "Systems",
            "Payments",
            "Business",
            "Performance",
            "Events",
            "Forecasts",
          ]}
        />
      </div>
    </h1>
    <div className="h-[16rem] w-full bg-green-50/[0.04] p-10 ">
      <Cta />
    </div>
  </div>
);

const Cta = () => {
  return (
    <section className="">
      <div className="px-4 md:px-4">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Build with us.
          </h1>
          <p className="text-xl tracking-tight">
            Platform · Apps · SDK · UI Components
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" asChild>
              <Link
                href="/init/devtools"
                rel="noopener noreferrer"
                className="tracking-tighter"
                target="_blank"
              >
                <span className="text-lg tracking-tighter">Dev Tools</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                className="text-lg"
                href="https://github.com/phtn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-lg tracking-tighter">Projects</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export const IconCard = (item: XCardProps) => (
  <div className="flex items-center justify-center border size-36">
    <Icon
      name={item.icon as IconName}
      className="size-16 text-foreground shrink-0"
    />
  </div>
);

/*
<HyperList
        data={data}
        component={IconCard}
        container="w-full flex gap-4"
        horizontal
      />
      <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delayChildren: stagger(0.25, { from: "last" }) }}
              className="h-[80vh] flex items-center gap-4 border-lime-100 border w-full bg-pink-100/5"
            >
              {data.map((item) => (
                <IconCard key={item.id} {...item} />
              ))}
            </motion.div>
*/
