'use client'

import Navbar from '@/components/Navbar/Navbar';
import { Spotlight } from '@/components/ui/Spotlight';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'

const Page = () => {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const router = useRouter(); 

  const policyDialog = useRef<HTMLDialogElement>(null);
  const termsDialog = useRef<HTMLDialogElement>(null);

  const { user } = useUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  const [{ emailAddress }] = user.emailAddresses;

  formData.email = emailAddress; 

  const openDialog = () => {
    if (policyDialog.current) {
    policyDialog.current.showModal();
  }
  };

  const closeDialog = () => {
    policyDialog.current?.close();
  };

  const openDialog2 = () => {
    if (termsDialog.current) {
    termsDialog.current.showModal();
  }
  };

  const closeDialog2 = () => {
    termsDialog.current?.close();
  };

  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData)
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Spotlight/>
      <div className='overflow-hidden'>
        <Navbar/>
      </div>

    <div className='overflow-hidden'>
      <form onSubmit={handleSubmit} className="rounded-2xl shadow-xl p-8 md:p-12 space-y-6 transform hover:scale-[1.002] transition-transform duration-300">
        <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-200 mb-2">Get In Touch</h2>
            <p className="text-gray-400">We'd love to hear from you. Send us a message!</p>
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-yellow-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-accent transition-colors">First Name</label>
                <input
                    type="text" 
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="text-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-amber-500 focus:ring-opacity-20 outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Ali"
                />
            </div>
            <div className="group">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-accent transition-colors">
                    Last Name
                </label>
                <input 
                    type="text" 
                    id="lastName" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="text-white focus:ring-amber-500 w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-opacity-20 outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-300"
                    placeholder="Doe"
                />
            </div>
        </div>

        <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-accent transition-colors">
                Email Address
            </label>
            <input 
                type="email" 
                id="email" 
                name="email"
                value={emailAddress}
                readOnly
                required
                className="text-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-amber-500 focus:ring-opacity-20 outline-none transition-all duration-300 placeholder-gray-400 hover:border-gray-300"
                placeholder="john.doe@example.com"
            />
        </div>

        <div className="group">
            <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2 group-focus-within:text-accent transition-colors">
                Message
            </label>
            <textarea
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="text-white w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-accent focus:ring-4 focus:ring-amber-500 focus:ring-opacity-20 outline-none transition-all duration-300 placeholder-gray-400 resize-vertical hover:border-gray-300"
                placeholder="Tell us how we can help you..."
            ></textarea>
        </div>

        <div className="flex items-start space-x-3">
            <input 
                type="checkbox" 
                id="privacy" 
                name="privacy"
                required
                className="w-5 h-5 mt-1 text-accent border-2 border-gray-300 rounded accent-amber-500"
            />
            <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                I agree to the <a onClick={openDialog} href="#" className="text-accent hover:text-yellow-600 underline font-medium">Privacy Policy</a> and <a href="#" className="text-accent hover:text-yellow-600 underline font-medium" onClick={openDialog2}>Terms of Service</a> *
            </label>
        </div>

        <div className="pt-4">
            <button 
                type="submit"
                className="w-full bg-gradient-to-r from-amber-800 to-yellow-500 text-white font-bold py-4 px-8 rounded-xl hover:from-yellow-500 hover:to-amber-800 transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-accent focus:ring-opacity-50"
            >
                <span className="flex items-center justify-center space-x-2">
                    <span>Send Message</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                </span>
            </button>
        </div>
      </form>

      <dialog ref={policyDialog} className="w-[90%] max-w-md rounded-2xl p-6 shadow-xl text-center backdrop:bg-black/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed" >
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          Privacy Policy
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 h-100 overflow-y-auto">
          At AliDoesVFX, we deeply value the trust you place in us when enrolling in our courses and engaging with our learning platform. Protecting your privacy is one of our highest priorities, and we are committed to being transparent about how we collect, use, and safeguard your information. When you sign up for an account, purchase a course, or interact with our website, we may collect personal details such as your name, email address, billing information, and learning progress. This data is used solely to deliver the courses you purchase, provide customer support, improve your learning experience, and communicate important updates regarding our services. We do not sell, rent, or trade your personal information to third parties. However, we may share limited data with trusted service providers who assist us with secure payment processing, website functionality, or analytics, always under strict confidentiality agreements. All transactions on AliDoesVFX are encrypted and processed through secure gateways to ensure the highest level of protection. Additionally, we may collect non-personal usage data, such as device type or browser information, to help us optimize the website and create a smoother user experience. By using AliDoesVFX, you consent to the practices outlined in this Privacy Policy. We encourage you to review this policy periodically, as it may be updated to reflect changes in technology, regulations, or our services. Your learning journey is important to us, and so is your right to privacy — we will always strive to keep your data safe while empowering you to achieve your creative goals.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700" onClick={closeDialog}>
            Confirm
          </button>
        </div>
      </dialog>

      <dialog ref={termsDialog} className="w-[90%] max-w-md rounded-2xl p-6 shadow-xl text-center backdrop:bg-black/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed" >
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">
          Terms And Services
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-6 h-100 overflow-y-auto">
          Welcome to AliDoesVFX! By using our website and courses, you agree to follow a few simple rules that help keep the community safe and fair. Our courses are for personal learning only, so please don’t share, resell, or copy the content without permission. Payments are handled securely, and refunds are only available within 7 days of purchase (as long as you haven’t fully accessed or downloaded the course materials). All videos, tutorials, and resources belong to AliDoesVFX and are protected by copyright laws, so we kindly ask that you respect our work. While we do our best to provide high-quality learning, we can’t be held responsible for any issues that may come from how the information is used. From time to time, we may update these terms, and by continuing to use our platform, you agree to the latest version. If you ever have questions, feel free to reach us at support@alidoesvfx.com — we’re here to help you on your creative journey!
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700" onClick={closeDialog2}>
            Confirm
          </button>
        </div>
      </dialog>
    </div>
    </div>
  )
}

export default Page;