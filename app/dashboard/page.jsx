'use client'
import React, { useContext, useEffect, useState } from 'react'
import EmptyState from './components/EmptyState'
import Link from 'next/link'
import { db } from '@/configs/db'
import { VideoData } from '@/configs/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import VideoList from './components/VideoList'
import { UserDetailContext } from '../context/UserDetailContext'

const Dashboard = () => {
  const [videoList,setVideoList]=useState([])
  const {user} = useUser()

  useEffect(()=>{
    user&&GetVideoList()
  },[user])

  const GetVideoList = async ()=>{
    const result = await db.select().from(VideoData)
    .where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress))

    console.log(result)
    setVideoList(result)
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-3xl text-violet-500">Dashboard</h2>
        <Link href="/dashboard/create-new">
          <button className="bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700">
            + Create New
          </button>
        </Link>
      </div>
      {/* Empty State */}
      {videoList?.length == 0 && (
        <div>
          <EmptyState />
        </div>
      )}
      {/* List of Videos */}
        <VideoList videoList={videoList}/>
    </div>
  );
}

export default Dashboard