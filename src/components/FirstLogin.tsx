"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs'

const FirstLogin = () => {
    const { isLoaded, user } = useUser();

     if (!isLoaded || !user || user.createdAt === null) {
        return null;
    }

    const now = new Date();
    const userCreationDate = new Date(user?.createdAt);
    const timeDifferenceInSeconds = (now.getTime() - userCreationDate.getTime()) / 1000;
    const isFirstTimeUser = timeDifferenceInSeconds < 30;

  return (
    <div>
        { isFirstTimeUser ? (
            <div className='text-2xl text-white pl-fluid-xl pr-fluid-xl pt-fluid-xl'>Hello , {user.firstName}</div>
        ) : (
            null
        )  }
    </div>
  )
}

export default FirstLogin