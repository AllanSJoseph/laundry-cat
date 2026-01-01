let reminderInterval = null;

self.addEventListener("install", (e) => {
    console.log("Service Worker Installed!");
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    console.log("Service Worker activated!");
    return self.clients.claim();
});

self.addEventListener("message", (event) => {
  const { action } = event.data;
  if (action === "startReminders") {

    self.registration.showNotification("Laundry Done!", {
          body: "Your Laundry has completed Washing!",
    });

    if (!reminderInterval) {
      console.log("Starting reminder loop...");
      reminderInterval = setInterval(() => {
        self.registration.showNotification("Laundry Reminder!", {
          body: "Your Laundry is still on the Machine! Have you taken it out?",
        });
      }, 1 * 60 * 1000); // every 1 minutes
    }
  }

  if (action === "test"){
    self.registration.showNotification("Hi! from Laundry Cat", {
      body: "This is a test-notification!"
    });
  }

  if (action === "stopReminders") {
        if (reminderInterval){
            console.log("Stopping Reminders...");
            clearInterval(reminderInterval);
            reminderInterval = null;
        }
  }
});