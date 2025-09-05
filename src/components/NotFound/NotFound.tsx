import React from 'react'
import './NotFound.css'

const NotFound = ({href, pageName}:{href:string;pageName:string}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-center px-4">
        <h1 className="text-main font-semibold [font-size:clamp(1.5rem,3vw,2.25rem)] [text-shadow:1px_1px_6px_rgba(0,0,0,0.15)]">
            Not found : )
        </h1>
        <p className="mt-3 text-gray-500 [font-size:clamp(0.9rem,2vw,1.125rem)] max-w-md">
            Looks like the page you're looking for doesn&apos;t exist or has been removed.
        </p>
        
        <a href={href}>
        <button className="animated-button mt-5 px-8 py-3">
            <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
            </svg>
            <span className="text">Go To {pageName}</span>
            <span className="circle"></span>
            <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                ></path>
            </svg>
        </button>
        </a>
    </div>
   )
}

export default NotFound;