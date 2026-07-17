// main.js - Saf JavaScript ile Bluetooth üzerinden harita yönlendirmelerini alma

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

        // Gelen veriyi anlık olarak dinlemeye başla
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', yonVerisiniIsle);
        
        console.log("Bağlantı başarılı! Harita verileri bekleniyor...");

    } catch (error) {
        console.error("Bağlantı hatası: ", error);
    }
}

function yonVerisiniIsle(event) {
    // Gelen ham veriyi UTF-8 formatında çöz
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const directionData = decoder.decode(value);

    // Veri örneği: "SAĞ|200" (Sağa dön, 200 metre)
    ekraniGuncelle(directionData);
}

function ekraniGuncelle(data) {
    // Veriyi yön ve mesafe olarak parçala
    const parcalar = data.split('|');
    
    if (parcalar.length === 2) {
        const yon = parcalar[0];
        const mesafe = parcalar[1];
        
        // Arayüze yansıtılacak saf mantık
        if (yon === "SAĞ") {
            console.log(`➡️ ${mesafe} metre sonra sağa dön!`);
        } else if (yon === "SOL") {
            console.log(`⬅️ ${mesafe} metre sonra sola dön!`);
        } else {
            console.log(`⬆️ Düz devam et: ${mesafe} metre`);
        }
    }
}

