import { useState, useEffect } from 'react'
import toast, {Toaster} from 'react-hot-toast'
import {Info, Bell} from 'lucide-react';
import './App.css'
import './types.ts'

import ThemeToggle from './components/Theme';
import Timer from './components/Timer';
import InfoModal from './components/InfoModal';

function App() {
  const [needsResponse, setNeedsResponse] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("Service Worker registered!"))
      .catch((err) => console.error("Service Worker registration failed:", err))
    }
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        console.log("Notification permission: ", perm);
      })
    }
  }, []);

  useEffect(() => {
    if (needsResponse){
      startReminders();
    }else {
      stopReminders();
    }
  }, [needsResponse])

  const startReminders = () => {
    if (navigator.serviceWorker.controller) {
      console.log("Starting Reminders...");
      navigator.serviceWorker.controller.postMessage({action: "startReminders"});
    } else {
      console.warn("No active service worker controller.");
    }
  };

  const stopReminders = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({action: "stopReminders"});
    }
  };

  const handleRespond = () => {
    toast.success("Thank you for Responding");
    setNeedsResponse(false);
    stopReminders();
  };

  const runtestNotification = () => {
    if (navigator.serviceWorker.controller){
      console.log("Initiating a notification");
      navigator.serviceWorker.controller.postMessage({action: "test"});
    } else {
      console.warn("No active service worker controller.");
    }
  }

  return (
    <>
      <Toaster position='bottom-center'/>
      <div className='min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 layout-container flex flex-col items-center gap-4 p-4 bg-gray-100'>
        <div className="absolute top-4 right-4 flex space-x-2">
          <ThemeToggle />
          <button 
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          onClick={() => setIsInfoModalOpen(true)}
          >
            <Info className="w-5 h-5 text-gray-700 dark:text-orange-500" />

          </button>
        </div>

        <div className='container mx-auto px-4 py-8 max-w-2xl'>
          <div className='text-center mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-orange-500 dark:text-orange-400 mb-3 flex items-center justify-center gap-2'>
              Hello! Laundry Cat Here! 
              <span className='text-5xl'>😼</span>
            </h1>
            <p className='text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-xl mx-auto'>
              Forgot ur clothes on your Washing Machine? I got you, Laundry Cat will remind you if ur clothes are still on the machine so they won't rot inside it...
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-6 transition-colors duration-300">
            <Timer needsResponse={needsResponse} setNeedsResponse={setNeedsResponse} />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6 transition-colors duration-300">
            {needsResponse ? 
              (
                <button 
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                  onClick={handleRespond}
                >
                  ✅ I've Taken Out My Laundry
                </button>
              ) 
              : 
              (
                <div className="text-center text-gray-600 dark:text-gray-400 py-2">
                    <p className="leading-relaxed">
                      When your laundry is done, a button will appear here to confirm you've taken it out.
                    </p>
                </div>
              )
            }
          </div>


          <div className='text-center'>
            <button 
              className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-all duration-200" 
              onClick={runtestNotification}>
                <Bell className="w-4 h-4" />
                Run a test notification
            </button>
          </div>
        </div>
      </div>
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  )
}

export default App;
