"use client"
import React from 'react'
import Header from './components/Header'
import SideNav from './components/SideNav'
import { VideoDataContext } from '../context/VideoDataContext'
import { useState } from 'react'
import { UserDetailContext } from '../context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { Users } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { useEffect } from 'react'
import { db } from '@/configs/db'
const DashboardLayout = ({children}) => {
  const [videoData,setVideoData]=useState([])
  const [userDetail,setUserDetail]= useState([])
  const {user}=useUser()

  useEffect(()=>{
    user&&getUserDetail()
  },[user])

  const getUserDetail=async()=>{
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    setUserDetail(result[0])
  }

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <VideoDataContext.Provider value={{videoData,setVideoData}}>
        <div>
          <div className="hidden md:block h-screen bg-white fixed mt-[30px] w-64">
            <SideNav />
          </div>
          <div>
            <Header />
            <div className="md:ml-64 mt-12 p-10">{children}</div>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout