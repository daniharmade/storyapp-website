self.addEventListener('push', (event) => {
  console.log('Service worker pushing...');

  async function chainPromise() {
    if (event.data) {
      try {
        const data = event.data.json();
        if (data.type === 'story_created') {
          notificationData = {
            title: 'Story berhasil dibuat',
            options: {
              body: `Anda telah membuat story baru dengan deskripsi: ${data.description}`,
            },
          };
        }
      } catch (error) {
        console.error('Error parsing push event data:', error);
      }
    }

    await self.registration.showNotification(notificationData.title, notificationData.options);
  }

  event.waitUntil(chainPromise());
});

// Menangani pesan dari postMessage
self.addEventListener('message', (event) => {
  console.log('Service worker received message:', event.data);

  if (event.data && event.data.type === 'story_created') {
    const notificationData = {
      title: 'Story berhasil dibuat',
      options: {
        body: `Anda telah membuat story baru dengan deskripsi: ${event.data.description}`,
      },
    };

    self.registration.showNotification(notificationData.title, notificationData.options).catch((error) => {
      console.error('Error showing notification:', error);
    });
  }
});