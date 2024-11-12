'use client';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import Image from 'next/image';

const Login = () => {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div>
          <h1>Login</h1>
        </div>
      ) : (
        <div className="relative flex items-center justify-center h-screen overflow-hidden">
          <Image
            src="/assets/loginbg.jpg"
            alt="Background image"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="-z-10"
          />

          <div className="bg-white p-8 rounded-lg shadow-lg border border-slate-200 max-w-sm w-full text-center relative z-10">
            <h2 className="text-xl font-semibold mb-4">
              Davao City Bus Tracking System
            </h2>
            <button
              onClick={() => signIn('google')}
              className="px-4 py-2 border flex items-center justify-center gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 w-full"
            >
              <Image
                className="w-6 h-6"
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                width={6}
                height={6}
                loading="lazy"
                alt="google logo"
              />
              <span>Login with Google</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
