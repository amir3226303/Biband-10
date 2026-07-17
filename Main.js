// main.js - Saf JavaScript ile Bluetooth üzerinden harita yönlendirmelerini alma

const NotificationService = require('./NotificationService.js');

// Standart BLE Servis ve Karakteristik UUID'leri (Kendi cihazına göre güncellenebilir)
const MAP_SERVICE_UUID = '00001819-0000-1000-8000-00805f9b34fb';
const DIRECTION_CHARACTERISTIC_UUID = '00002a2b-0000-1000-8000-00805f9b34fb';

async function saateBaglan() {
  try {
    console.log("Cihaz aranıyor...");

    // Cihazı bul ve bağlan
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [MAP_SERVICE_UUID]
    });

    console.log("Cihaz bulundu, bağlanılıyor: " + device.name);
    const server = await device.gatt.connect();

    console.log("Yönlendirme servisi alınıyor...");
    const service = await server.getPrimaryService(MAP_SERVICE_UUID);

    console.log("Veri karakteristiği alınıyor...");
    const characteristic = await service.getCharacteristic(DIRECTION_CHARACTERISTIC_UUID);
    
    // Yönlendirme verisini oku veya dinle gibi diğer işlemler buraya eklenecek
    
  } catch (error) {
    console.error(error);
  }
}

saateBaglan();

