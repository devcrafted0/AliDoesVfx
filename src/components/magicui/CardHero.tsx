"use client";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import ShinyText from '@/components/ShinyText/ShinyText';

type PropsCardHero = {
  img : string;
  title : string;
  slug : string;
  description : string;
  learnMoreRoute : string
}

export function CardHero({img , title , slug , description, learnMoreRoute} : PropsCardHero) {
  const { theme } = useTheme();
  return (
    <div className="p-0 max-w-sm w-full shadow-none border-none rounded-3xl">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0 rounded-2xl">
        <div className="px-4 pt-4 text-white justify-between items-center flex gap-4">
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-gray-400 overflow-hidden">
                    <img src={img} alt="userImage" width={100} height={100} />
                </div>

                <div>
                    <h1 className="font-bold [@media(max-width:900px)]:text-sm">{title}</h1>
                    <p className="text-gray-400 [@media(max-width:900px)]:text-sm">{slug}</p>
                </div>
            </div>
            <div>
              <a href={learnMoreRoute}>
                <button className="px-[clamp(0.50rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(0.875rem,1vw,1rem)] rounded-full cursor-pointer glass glass-effect overflow-hidden text-white font-bold">Learn More</button>
              </a>
            </div>
        </div>

        <ShinyText className="p-[clamp(1rem,2vw,1rem)] max-w-[70ch] text-[clamp(0.60rem,1vw,0.84rem)]" text={description} disabled={false} speed={3}/>
        
      </MagicCard>
    </div>
  );
}
