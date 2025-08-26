import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import { image } from "motion/react-client";
import Image from "next/image";

export function OrbitImages() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden">
      <OrbitingCircles iconSize={40} radius={200}>
        <Icons.nuke />
        <Icons.unity />
        <Icons.unreal />
        <Icons.blender />
        <Icons.houdini />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={140} reverse speed={1}>
        <Icons.nuke />
        <Icons.unreal />
        <Icons.blender />
        <Icons.houdini />
      </OrbitingCircles>
      <OrbitingCircles iconSize={30} radius={60} reverse speed={1}>
        <span className="text-main">Learn</span>
        <span className="text-main">Anything</span>
      </OrbitingCircles>
    </div>
  );
}

const Icons = {
  nuke: () => (
    <Image src="/logos/nuke.png" alt="nuke" width={100} height={100}/>
  ),
  unity: () => (
    <Image src="/logos/unity.png" alt="unity" width={100} height={100}/>
  ),
  unreal: () => (
    <Image src="/logos/unreal.png" alt="unreal" width={100} height={100} className="invert"/>
  ),
  blender: () => (
    <Image src="/logos/blender.png" alt="blender" width={100} height={100}/>
  ),
  houdini: () => (
    <Image src="/logos/houdini.png" alt="houdini" width={150} height={150}/>
  )
};
