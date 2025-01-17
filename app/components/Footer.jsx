import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-green-200 py-8 text-center px-4 mb-10">
      <div className='flex justify-center items-center my-3'>
        <img width={200} src="/nav/mainnavlogo.png" alt="" />
      </div>
      <div className="max-w-2xl text-base mx-auto text-gray-700">
        <p className="mb-2">
          <span className="font-bold">Address -</span> HOLDING NO.342/2/466, BIDHAN ROAD, P.O. & P.S. SILIGURI, Ward No. 11, SILIGURI MUNICIPAL CORPORATION, Darjeeling, West Bengal-734001
        </p>
        <p className="mb-4">
          <span className="font-bold">Call -</span> +91 9332667166
        </p>
        <div className="flex justify-center space-x-4 text-xl mb-4">
          <Link href={"#"}><span className="[&>svg]:h-6 [&>svg]:w-6 [&>svg]:fill-[#1877f2]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
              <path
                d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
            </svg>
          </span>
          </Link>

          <Link href={"#"}><span className="[&>svg]:h-7 [&>svg]:w-7 [&>svg]:fill-[#c13584]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path
                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
          </span>
          </Link>

        </div>
        <p className="text-sm text-gray-600">
          &copy; 2024 Copyright © Tiffin Boxes. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;


