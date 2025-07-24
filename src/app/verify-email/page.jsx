"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Baumans } from "next/font/google";

const baumans = Baumans({ weight: "400", subsets: ["latin"] });

function VerifyEmailContent() {
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('Something went wrong. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ background: 'hsl(var(--background))' }}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), 
                                radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)` 
             }}>
        </div>
      </div>

      <div className="max-w-md w-full mx-4 relative">
        <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 text-center relative overflow-hidden">
          
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
          
          {/* Logo */}
          <div className="mb-6">
            <h1 className={`${baumans.className} text-3xl mb-2`} 
                style={{ color: 'hsl(var(--primary))' }}>
              cmpct.
            </h1>
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Email Verification
            </p>
          </div>

          {status === 'verifying' && (
            <div className="py-8">
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 mx-auto"
                     style={{ 
                       border: `3px solid hsl(var(--muted))`,
                       borderTop: `3px solid hsl(var(--primary))`
                     }}>
                </div>
                <div className="absolute inset-0 rounded-full animate-pulse"
                     style={{ 
                       background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)`
                     }}>
                </div>
              </div>
              <h2 className="text-2xl font-semibold mb-2" 
                  style={{ color: 'hsl(var(--foreground))' }}>
                Verifying your email...
              </h2>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Please wait while we confirm your email address
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                   style={{ backgroundColor: 'hsl(142 76% 95%)' }}>
                <div className="absolute inset-0 rounded-full animate-pulse"
                     style={{ backgroundColor: 'hsl(142 76% 90%)' }}>
                </div>
                <svg className="w-8 h-8 relative z-10" 
                     style={{ color: 'hsl(142 76% 36%)' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-3" 
                  style={{ color: 'hsl(var(--foreground))' }}>
                🎉 Email Verified!
              </h2>
              
              <p className="mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {message || 'Your account has been successfully verified'}
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-6 border border-green-200">
                <p className="text-sm font-medium text-green-800">
                  ✅ Welcome to CMPCT! Check your email for a welcome message.
                </p>
              </div>
              
              <Link 
                href="/" 
                className="inline-block px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ 
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  boxShadow: '0 4px 14px hsl(var(--primary) / 0.25)'
                }}
              >
                Continue to Sign In →
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="py-6">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center relative"
                   style={{ backgroundColor: 'hsl(0 84% 95%)' }}>
                <div className="absolute inset-0 rounded-full animate-pulse"
                     style={{ backgroundColor: 'hsl(0 84% 90%)' }}>
                </div>
                <svg className="w-8 h-8 relative z-10" 
                     style={{ color: 'hsl(0 84% 45%)' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold mb-3" 
                  style={{ color: 'hsl(var(--foreground))' }}>
                Verification Failed
              </h2>
              
              <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {message}
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg mb-6 border border-orange-200">
                <p className="text-sm font-medium text-orange-800 mb-2">
                  💡 Need help?
                </p>
                <p className="text-xs text-orange-700">
                  The link may have expired or been used already. Try requesting a new verification email.
                </p>
              </div>
              
              <div className="space-y-3">
                <Link 
                  href="/" 
                  className="block w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 hover:shadow-md"
                  style={{ 
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    borderColor: 'hsl(var(--primary))'
                  }}
                >
                  Back to Home
                </Link>
                
                <button
                  onClick={() => window.location.reload()}
                  className="block w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 hover:shadow-md"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--primary))',
                    borderColor: 'hsl(var(--primary))'
                  }}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Having trouble? Contact us at{' '}
              <a href="mailto:support@cmpct.in" 
                 className="font-medium hover:underline"
                 style={{ color: 'hsl(var(--primary))' }}>
                support@cmpct.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" 
           style={{ background: 'hsl(var(--background))' }}>
        <div className="animate-spin rounded-full h-12 w-12"
             style={{ 
               border: `3px solid hsl(var(--muted))`,
               borderTop: `3px solid hsl(var(--primary))`
             }}>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}