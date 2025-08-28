import Navbar from '@/components/Navbar/Navbar';
import React from 'react'
import { TextMeteors } from '@/components/TextMeteors';
import { OrbitImages } from '@/components/OrbitImages';
import ShinyText from '@/components/ShinyText/ShinyText';
import { CardCarousel } from '@/components/ui/card-carousel';
import AOSWrapper from "@/components/AOSWrapper";
import { WordRotate } from '@/components/magicui/word-rotate';

const page = () => {

    const images = [
      { src: "/moviesImages/1.webp", alt: "Image 1" },
      { src: "/moviesImages/2.webp", alt: "Image 2" },
      { src: "/moviesImages/3.webp", alt: "Image 3" },
      { src: "/moviesImages/4.jpg", alt: "Image 3" },
    ]

  return (
    <div className='overflow-x-hidden'>
      <AOSWrapper/>
      <div className='w-screen h-[100vh] overflow-hidden'>
        <Navbar/>
        <TextMeteors text='About Me'/>
        <div className='mt-4 relative -top-[clamp(10rem,10rem,15rem)] [@media(max-width:930px)]:-top-[18rem] grid grid-cols-2 grid-rows-1 [@media(max-width:930px)]:grid-cols-1'>
            <div className='p-[clamp(1rem,2vw,2.5rem)] [@media(max-width:930px)]:flex [@media(max-width:930px)]:justify-center [@media(max-width:930px)]:items-center [@media(max-width:930px)]:flex-col'>
              <h1 className='text-[clamp(1.5rem,5vw,4rem)] text-main font-extrabold [@media(max-width:900px)]:w-fit [@media(max-width:900px)]:mx-auto'>My Origin Story</h1>
              
              <ShinyText className='mt-2 max-w-[80ch] text-[clamp(0.7rem,1vw,1.125rem)] text-gray-100/60' text='My passion for visual effects was born the moment I watched Jurassic Park. Seeing dinosaurs come to life on screen wasn’t just entertainment—it was a revelation. From that moment forward, I knew I wanted to understand the magic behind the visuals. With no formal training at the start, I taught myself the fundamentals of VFX, often spending late nights wrestling with software and solving technical challenges one frame at a time. Every hurdle only fueled my determination to master this art form.' disabled={false} speed={3}/>

            </div>
            <div className='flex justify-center items-center '>
              <OrbitImages/>
            </div>
        </div>
      </div>

      <div className='' data-aos="fade-left">
        <CardCarousel 
          images={images}
          autoplayDelay={2000}
          showPagination={true}
          showNavigation={true}
        />
      </div>

      <div className='p-[clamp(1rem,2vw,2.5rem)] mt-3'>
        <div className='overflow-hidden flex items-center gap-1 sm:gap-4 md:gap-4'>
          <span className='text-[clamp(1.35rem,5vw,4rem)] text-main font-extrabold'>My</span>
            <WordRotate
          className='text-[clamp(1.35rem,5vw,4rem)] text-main font-extrabold'
          words={["Teaching Mission", "Passion"]}
          />
        </div>

        <ShinyText className='max-w-[80ch] text-[clamp(0.7rem,1vw,1.125rem)] text-gray-100/60' text='After years in the industry, I realized that my greatest joy came not just from creating, but from sharing knowledge. VFX can often seem intimidating, filled with complex tools and technical jargon. My mission is to demystify visual effects and make them accessible to anyone with passion and creativity. Through my courses, I focus on hands-on, practical training designed to help aspiring artists build professional, industry-ready portfolios.'/>
      </div>

      <div className='p-[clamp(1rem,2vw,2.5rem)] mt-3'>
        <div className='overflow-hidden flex items-center gap-1 sm:gap-4 md:gap-4'>
          <h1 className='text-[clamp(1.35rem,5vw,4rem)] text-main font-extrabold'>Ready to Learn? </h1>
        </div>

        <ShinyText className='max-w-[80ch] text-[clamp(0.7rem,1vw,1.125rem)] text-gray-100/60' text='If you’re serious about mastering VFX and want to learn from someone who’s been on the front lines of blockbuster filmmaking, I invite you to explore my courses and portfolio. Let’s unlock your potential and turn your passion for VFX into a professional reality.'/>

        <div className='w-screen flex items-center [@media(max-width:520px)]:justify-center mt-5'>
          <a
          href="/courses"
          className="
            inline-flex justify-center items-center relative h-[50px] px-[30px] border-2 border-[#FFB400] bg-[#1A1A1A]
            select-none whitespace-nowrap transition-all duration-75 ease-linear
            font-inherit no-underline
            before:content-[''] before:absolute before:bg-[#1A1A1A]
            before:transition-all before:duration-200
            before:w-[calc(100%+6px)] before:h-[calc(100%-16px)] before:top-[8px] before:left-[-3px]
            after:content-[''] after:absolute after:bg-[#1A1A1A]
            after:transition-all after:duration-200
            after:w-[calc(100%-16px)] after:h-[calc(100%+6px)] after:top-[-3px] after:left-[8px]
            hover:cursor-crosshair active:scale-95
            hover:before:h-[calc(100%-32px)] hover:before:top-[16px]
            hover:after:w-[calc(100%-32px)] hover:after:left-[16px]
          "
        >
          <span className="relative z-[3] font-semibold text-[15px] text-[#FFB400]">
            GAME ON
          </span>
        </a>
      </div>
      </div>

    </div>
  )
}

export default page;