import Navbar from '@/components/Navbar/Navbar';
import Image from 'next/image'
import React from 'react'
import SplitText from '@/components/SplitText';
import ClickSpark from '@/components/ClickSpark';
import BlurText from '@/components/BlurText';
import ShinyText from '@/components/ShinyText/ShinyText';
import { CardHero } from '@/components/magicui/CardHero';
import FirstLogin from '@/components/FirstLogin';

import { SignUpButton } from '@clerk/nextjs'

const page = () => {

  return (
    <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400} >
      {/* Hero Section */}
      <div className='hero-gradient relative w-full h-screen overflow-hidden'>
        <Navbar />
        <Image src="/dragon.png" className='absolute top-0 right-0 z-[-1] [@media(max-width:700px)]:w-full [@media(max-width:700px)]:h-full [@media(max-width:700px)]:object-cover' alt='explosion' width={1000} height={1000}/>

          <FirstLogin />

        <div className='pl-fluid-xl pr-fluid-xl w-screen pt-fluid-xl [@media(max-width:900px)]:text-center'>
            <BlurText text="Transform Your Vision Into" delay={20} animateBy="letters" direction="top" className="text-[clamp(1.44rem,5vw,4rem)] text-main font-extrabold [@media(max-width:900px)]:w-fit [@media(max-width:900px)]:mx-auto"/>

            <SplitText text="Hollywood Magic" className="text-[clamp(1.8rem,5vw,4rem)] text-main font-extrabold" delay={100} duration={0.6} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} threshold={0.1} rootMargin="-100px" textAlign="center" />
            <br />
            <ShinyText className="max-w-[50ch] text-[clamp(0.90rem,1vw,1.125rem)] text-gray-100/60" text="Master the visual effects that bring impossible worlds to life — and launch the career you've always dreamed of. From explosive action sequences to breathtaking fantasy realms, learn the same industry techniques used by top VFX studios." disabled={false} speed={3}/>

              {/* Get Started Button */}
            
            <SignUpButton>
            <span className='[@media(max-width:900px)]:justify-center w-full flex items-center drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]'>
              <button className="glass-effect button-orange my-5 [@media(max-width:900px)]:scale-[0.9]">
                  Get Started
                  <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                      clipRule="evenodd"
                  ></path>
                  </svg>
              </button>
            </span>
            </SignUpButton>

            <div className='w-full flex [@media(max-width:900px)]:justify-center mt-10'>
              <CardHero learnMoreRoute="/about" img="/dragon.png" title="Ali Raza" slug="@alidoesvfx" description="Master the visual effects that bring impossible worlds to life — and launch the career you've always dreamed of. From explosive action sequences to breathtaking fantasy realms, learn the same industry techniques used by top VFX studios."/>
            </div>

        </div>
      </div>


    </ClickSpark>
  )
}

export default page;