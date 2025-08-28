"use client";

import Image from "next/image";

import './NavbarQuery.css'
import { motion } from "framer-motion";
import UseAnimations from "react-useanimations";
import menu2 from "react-useanimations/lib/menu";
import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import BodyPortal from "../PortalBody";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  UserProfile
} from '@clerk/nextjs'

const Navbar = () => {

    const [isOpen , setIsOpen] = useState<boolean>(false);

    const { isLoaded, user } = useUser();

     if (!isLoaded) {
        return null;
    }

  return (
    <motion.div initial={{ y: -50, filter: "blur(10px)", opacity: 0 }}
        animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }} className="w-screen h-[75px] mt-[clamp(20px,2.656vw,51px)]">
        <nav className="max-w-[80vw] m-auto h-full rounded-full backdrop-blur-md bg-gradient-to-br from-white/25 to-white/5 border border-white/20 shadow-2xl backdrop-saturate-200 hover:bg-white/5 transition-all duration-300 flex items-center">
            <ul className="mx-fluid-4 flex items-center justify-between w-full">
                <div className="flex space-x-2 items-center">
                    <Image src="/logo.png" alt="logo" height={50} width={50}/>
                    <h1 className="text-fluid-xl font-michroma flex gap-1">
                        <span className="text-white font-bold">ALi</span>
                        <span className="text-white font-bold">Does</span>
                        <span className="text-main font-extrabold">VFX</span>
                    </h1>
                </div>

                <div className="flex gap-5">
                    <div className="nav-hide items-center space-x-10">
                        <Link href="/">
                            <li className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Home</li>
                        </Link>

                        <Link href="/about">
                            <li className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">About</li>
                        </Link>

                        <Link href="/courses">
                            <li className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Courses</li>
                        </Link>
                        <Link href="/contact">
                            <li className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Contact</li>
                        </Link>

                        {/* Login Logic */}

                        <SignedOut>
                            <li className="glass glass-effect overflow-hidden text-white font-michroma cursor-pointer transition-all duration-200 ease-in-out px-5 py-2 rounded-full transform hover:scale-105">
                                <SignInButton />
                            </li>
                        </SignedOut>

                        <SignedIn>
                            <li className="rounded-full flex items-center gap-2 glass glass-effect overflow-hidden px-4 py-2">
                                <span className="text-white">
                                    {user?.firstName}
                                </span>
                                <UserButton 
                                appearance={{
                                    elements: {
                                      /* 🔹 DROPDOWN (UserButton popover) */
                                      userButtonPopoverCard:
                                        "glass p-2",

                                      userPreview:
                                        "p-3 rounded-xl",
                                      avatarBox:
                                        "w-10 h-10 rounded-full",
                                      userPreviewMainIdentifier:
                                        "text-base font-semibold text-gray-900 drop-shadow",
                                      userPreviewSecondaryIdentifier:
                                        "text-sm text-gray-700/80",

                                      userButtonPopoverActionButton:
                                        "flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg text-gray-900/90 hover:bg-gray-200/40 transition",

                                      userButtonPopoverActionButton__signOut:
                                        "flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-red-200/60 transition",

                                      userButtonPopoverFooter:
                                        "mt-1 border-t border-white/20 pt-2 text-xs text-gray-800/80 text-center",
                                    },
                                  }}
                                />
                            </li>
                        </SignedIn>
                    </div>

                    <div className="cursor-pointer hide">
                        <li className="text-white">
                            <UseAnimations  onClick={()=>setIsOpen(true)} animation={menu2} size={30} strokeColor="#fff"/>
                        </li>
                    </div>
                </div>
            </ul>
        </nav>

        {/* Phone Nav */}
        <BodyPortal>
            <nav className={`w-[300px] h-screen fixed top-0 right-0 z-[20] rounded-xl backdrop-blur-lg bg-gradient-to-br from-white/25 to-white/5 border border-white/20 shadow-2xl backdrop-saturate-200 transition-all duration-100 flex justify-center items-center transform ${ isOpen ? 'translate-0' : 'translate-x-full'  }`}>
                <ul className="flex flex-col items-center space-y-10">
                    <Link href="/">
                        <button onClick={()=>setIsOpen(false)} className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Home</button>
                    </Link>
                    <Link href="/about">
                        <button onClick={()=>setIsOpen(false)}  className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">About</button>
                    </Link>
                    <Link href="/courses">
                        <button onClick={()=>setIsOpen(false)} className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Courses</button>
                    </Link>
                    <Link href="/contact">
                        <button onClick={()=>setIsOpen(false)} className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400] ">Contact</button>
                    </Link>
                    <div className="text-white font-michroma font-bold cursor-pointer hover:text-[#FFB400] transition-colors duration-200 ease-in-out hover:drop-shadow-[0_0_5px_#FFB400]">
                      <SignedOut>
                            <li className="glass glass-effect overflow-hidden text-white font-michroma cursor-pointer transition-all duration-200 ease-in-out px-5 py-2 rounded-full transform hover:scale-105">
                                <SignInButton />
                            </li>
                        </SignedOut>

                        <SignedIn>
                            <li className="rounded-full flex items-center gap-2 glass glass-effect overflow-hidden px-4 py-2">
                                <span className="text-white">
                                    {user?.firstName}
                                </span>
                                <UserButton 
                                appearance={{
                                    elements: {
                                      /* 🔹 DROPDOWN (UserButton popover) */
                                      userButtonPopoverCard:
                                        "glass p-2",

                                      userPreview:
                                        "p-3 rounded-xl",
                                      avatarBox:
                                        "w-10 h-10 rounded-full",
                                      userPreviewMainIdentifier:
                                        "text-base font-semibold text-gray-900 drop-shadow",
                                      userPreviewSecondaryIdentifier:
                                        "text-sm text-gray-700/80",

                                      userButtonPopoverActionButton:
                                        "flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg text-gray-900/90 hover:bg-gray-200/40 transition",

                                      userButtonPopoverActionButton__signOut:
                                        "flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg font-medium text-red-600 hover:bg-red-200/60 transition",

                                      userButtonPopoverFooter:
                                        "mt-1 border-t border-white/20 pt-2 text-xs text-gray-800/80 text-center",
                                    },
                                  }}
                                />
                            </li>
                        </SignedIn>
                    </div>
                </ul>
                
                <X className="absolute top-5 right-5 text-red-500 cursor-pointer" onClick={()=>setIsOpen(false)}/>
            </nav>
        </BodyPortal>
    </motion.div>
  )
}

export default Navbar;