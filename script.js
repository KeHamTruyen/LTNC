//npm install firebase-admin
//npm install firebase
//npm install firebase@8.9.1

const firebase = require('firebase/app');
require('firebase/database'); 
const admin = require('firebase-admin');

var firebaseConfig = {
    apiKey: "AIzaSyAd4_Np45sRl5uPdciyOrF3U6xT62gnzUQ",
    authDomain: "ltnc-3a24c.firebaseapp.com",
    databaseURL: "https://ltnc-3a24c-default-rtdb.firebaseio.com",
    projectId: "ltnc-3a24c",
    storageBucket: "ltnc-3a24c.appspot.com",
    messagingSenderId: "1094416536083",
    appId: "1:1094416536083:web:6b93941974081ac898a5e6",
    measurementId: "G-05YGQ7YMHQ"
  };

// Khởi tạo Firebase
const app = firebase.initializeApp(firebaseConfig);
admin.initializeApp();

const elistRef = firebase.database().ref("/Elist" );

function CreateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate) {
    // Định vị đến nút của thiết bị cần khởi tạo thông tin
    const deviceRef = elistRef.child(deviceName);

    // Kiểm tra xem thiết bị đã tồn tại trong cơ sở dữ liệu chưa
    deviceRef.once('value', (snapshot) => {
        const deviceExists = snapshot.exists();

        // Nếu thiết bị chưa tồn tại, thêm thông tin vào
        if (!deviceExists) {
            deviceRef.set({
                Status: initialStatus,
                Availability: initialAvailability,
                Date: initialDate
            }, (error) => {
                if (error) {
                    console.error("Lỗi khi khởi tạo thông tin thiết bị:", error);
                } else {
                    console.log("Thông tin thiết bị đã được khởi tạo thành công.");
                }
            });
        } else {
            console.log("Thiết bị đã tồn tại trong cơ sở dữ liệu.");
        }
    });
}

function updateDeviceInfo(deviceName, deviceStatus, availability, date) {
    // Định vị đến nút của thiết bị cần cập nhật
    const deviceRef = elistRef.child(deviceName);
  
    // Dùng phương thức update để cập nhật dữ liệu
    deviceRef.update({
        Status: deviceStatus,
        Availability: availability,
        Date: date
    }, (error) => {
        if (error) {
            console.error("Lỗi khi cập nhật thông tin thiết bị:", error);
        } else {
            console.log("Thông tin thiết bị đã được cập nhật thành công.");
        }
    });
  }

  function updateDeviceDate(deviceName,  date) {
    // Định vị đến nút của thiết bị cần cập nhật
    const deviceRef = elistRef.child(deviceName);
  
    // Dùng phương thức update để cập nhật dữ liệu
    deviceRef.update({
        Date: date
    }, (error) => {
        if (error) {
            console.error("Lỗi khi cập nhật thông tin thiết bị:", error);
        } else {
            console.log("Thông tin thiết bị đã được cập nhật thành công.");
        }
    });
  }
  //------------------------------------------------------------//
  const mlistRef = firebase.database().ref("Mlist");
  function CreateMedicine(medicineName, initialQuantity, expirationDate) 
  {
    mlistRef.child(medicineName).once('value', (snapshot) => {
        const medicineData = snapshot.val();
        let count = 1; // Biến count để đánh dấu các batch từ 1 và tăng dần
        if (medicineData) {
            // Nếu đã có thông tin về loại thuốc này, tăng count lên
            count = Object.keys(medicineData).length + 1;
        }
        const batchId = count.toString(); // Sử dụng count làm batchId
        const medicineRef = mlistRef.child(`${medicineName}/${batchId}`);
        medicineRef.set({
            quantity: initialQuantity,
            expirationDate: expirationDate
        });
    });
}
  
  // Hàm cập nhật số lượng thuốc khi nhập kho

  function importMedicine(medicineName, importQuantity, expirationDate) {
    mlistRef.child(medicineName).once('value', (snapshot) => {
        const medicine = snapshot.val();
        if (medicine) {
            let batchToUpdate = null;

            // Tìm batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất
            snapshot.forEach((childSnapshot) => {
                const batch = childSnapshot.val();
                if (batch.expirationDate === expirationDate || new Date(batch.expirationDate) == new Date(expirationDate)) {
                    batchToUpdate = childSnapshot.key;
                    return; // Dừng vòng lặp khi tìm thấy batch thích hợp
                }
            });

            if (batchToUpdate) {
                // Nếu có batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất, cập nhật số lượng vào batch đó
                const currentQuantity = parseInt(medicine[batchToUpdate].quantity);
                const updatedQuantity = currentQuantity + parseInt(importQuantity);
                mlistRef.child(`${medicineName}/${batchToUpdate}/quantity`).set(updatedQuantity);
                console.log(`Đã nhập kho thành công ${importQuantity} đơn vị của thuốc ${medicineName} vào batch hạn sử dụng ${expirationDate}. Số lượng mới trong kho: ${updatedQuantity}`);
            } else {
                // Nếu không có batch có cùng ngày hạn sử dụng hoặc ngày hạn sử dụng gần nhất, tạo một batch mới và lưu vào
                CreateMedicine(medicineName, importQuantity, expirationDate);
                console.log(`Đã tạo batch mới cho thuốc ${medicineName} với hạn sử dụng ${expirationDate} và số lượng ${importQuantity}`);
            }
        } else {
            // Nếu loại thuốc chưa tồn tại, tạo một batch mới và lưu vào
            CreateMedicine(medicineName, importQuantity, expirationDate);
            console.log(`Đã tạo batch mới cho thuốc ${medicineName} với hạn sử dụng ${expirationDate} và số lượng ${importQuantity}`);
        }
    });
}

  // Hàm cập nhật số lượng thuốc khi xuất kho
  function exportMedicine(medicineName, exportQuantity) {
    mlistRef.child(medicineName).once('value', (snapshot) => {
        const medicine = snapshot.val();
        if (medicine) {
            let batches = [];

            // Tạo một mảng các batch từ dữ liệu snapshot
            snapshot.forEach((childSnapshot) => {
                const batch = childSnapshot.val();
                batches.push({
                    id: childSnapshot.key,
                    quantity: parseInt(batch.quantity),
                    expirationDate: batch.expirationDate
                });
            });

            // Sắp xếp các batch theo hạn sử dụng tăng dần
            batches.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

            let quantityLeftToExport = exportQuantity;

            // Xuất thuốc từ các batch theo hạn sử dụng
            for (let i = 0; i < batches.length; i++) {
                const currentBatch = batches[i];
                const quantityInBatch = currentBatch.quantity;
                const batchId = currentBatch.id;

                if (quantityLeftToExport > 0 && quantityInBatch > 0) {
                    const quantityToExportFromBatch = Math.min(quantityInBatch, quantityLeftToExport);
                    const updatedQuantityInBatch = quantityInBatch - quantityToExportFromBatch;

                    // Cập nhật số lượng thuốc trong batch
                    mlistRef.child(`${medicineName}/${batchId}/quantity`).set(updatedQuantityInBatch);

                    console.log(`Đã xuất kho thành công ${quantityToExportFromBatch} đơn vị của thuốc ${medicineName} từ batch hạn sử dụng ${currentBatch.expirationDate}.`);

                    quantityLeftToExport -= quantityToExportFromBatch;

                    // Xóa batch nếu đã xuất hết thuốc từ batch đó
                    if (updatedQuantityInBatch === 0) {
                        mlistRef.child(`${medicineName}/${batchId}`).remove();
                        console.log(`Batch ${batchId} đã được xóa vì đã xuất hết thuốc.`);
                    }
                }
            }

            // Kiểm tra nếu vẫn còn số lượng thuốc cần xuất nhưng đã hết batch
            if (quantityLeftToExport > 0) {
                console.log(`Không đủ số lượng thuốc trong kho để xuất ${exportQuantity} đơn vị.`);
            }
        } else {
            console.log(`Không tìm thấy thông tin về thuốc ${medicineName} trong kho.`);
        }
    });
}



  function getTotalQuantity(medicineName) {
    mlistRef.child(medicineName).once('value', (snapshot) => {
        const medicineData = snapshot.val();
        if (medicineData) {
            let totalQuantity = 0;
            Object.keys(medicineData).forEach(batchId => {
                totalQuantity += parseInt(medicineData[batchId].quantity);
            });
            console.log(`Tổng số lượng của thuốc ${medicineName}: ${totalQuantity}`);
        } else {
            console.log(`Không tìm thấy thông tin về thuốc ${medicineName}`);
        }
    });
}
  
//CreateMedicine("asa","40","1005-1-1");
exportMedicine("asa","80");
//importMedicine("asa","40","1005-2-1");
//importMedicine("asa","40","1006-1-1");
//importMedicine("asa","40","1007-1-1");