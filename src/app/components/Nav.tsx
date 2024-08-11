import React from 'react';


export default function Nav() {
  return (
    <nav className='bg-gray-800 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl text-white'>IoT Dashboard</h1>
        <div>
          <a href='#' className='text-white'>Home</a>
          <a href='#' className='text-white ml-4'>About</a>
          <a href='#' className='text-white ml-4'>Contact</a>
        </div>
      </div>
    </nav>
  );
}