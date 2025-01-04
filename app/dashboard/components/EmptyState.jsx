import Link from 'next/link';
import React from 'react'
const EmptyState = () => {
  return (
    <div className="p-5 py-24 flex items-center flex-col mt-10 border-2 border-dotted">
      <h2>You don't have a short video created</h2>
      <Link href={"/dashboard/create-new"}>
        <button className="bg-violet-600 text-white p-2 pl-4 pr-4 rounded-xl hover:bg-violet-700">
          Create New Short Video
        </button>
      </Link>
    </div>
  );
}

export default EmptyState