"use client";

import { UserProfile } from "@clerk/clerk-react";
import { useEffect } from "react";
import { redirect } from 'next/navigation';

function ShowImagePage() {
  redirect('/dashboard');
  return null;
}


export default ShowImagePage;
