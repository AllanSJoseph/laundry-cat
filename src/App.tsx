import { useState, useEffect } from 'react'
import './App.css'
import './types.ts'

import Timer from './components/Timer';

function App() {
  // const [timeLeft, setTimeLeft] = useState(10);
  const [needsResponse, setNeedsResponse] = useState<boolean>(false);

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

  //  useEffect(() => {
  //   if (timeLeft > 0) {
  //     const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
  //     return () => clearInterval(timer);
  //   } else if (timeLeft === 0 && !needsResponse) {
  //     setNeedsResponse(true);
  //     startReminders();
  //   }
  // }, [timeLeft]);

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
    alert("Thank you for responding!");
    setNeedsResponse(false);
    stopReminders();
    // setTimeLeft(10); // reset for demo
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
      <div className='layout-container h-screen flex flex-col items-center gap-4 p-4 bg-gray-100'>
        <h1 className='text-2xl text-orange-500'>Hello! Laundry Cat Here! 😼</h1>
        <p>Forgot ur clothes on your Washing Machine? I got you, Laundry Cat will remind you if ur clothes are still on the machine so they won't rot inside it...</p>
        {/* <h2>{timeLeft > 0 ? `Time left: ${timeLeft}s` : "Time’s up!"}</h2> */}

        <Timer needsResponse={needsResponse} setNeedsResponse={setNeedsResponse} />

        {needsResponse ? (
          <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={handleRespond}>✅ Respond</button>
        ) : (
          <button className="mt-3 w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-not-allowed" disabled>✅ Respond</button>
        )}

        <button className="w-50 rounded bg-orange-400 p-2 font-bold text-white cursor-pointer" onClick={runtestNotification}>Run a test notification</button>
      </div>
    </>
  )



}

export default App;
