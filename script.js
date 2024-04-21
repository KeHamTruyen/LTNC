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

let id = 0;
const idRef = elistRef.child("id");
function CreateDeviceInfo(deviceName, initialStatus, initialAvailability, initialDate) {
    // Định vị đến nút của thiết bị cần khởi tạo thông tin
    const deviceRef = elistRef.child(deviceName);

    // Lấy giá trị id từ cơ sở dữ liệu
    idRef.once('value', (snapshot) => {
        id = snapshot.val() || 0; // Sử dụng giá trị id hiện có hoặc 0 nếu không có
        id++; // Tăng giá trị id lên cho thiết bị mới
        // Cập nhật giá trị id trong cơ sở dữ liệu
        idRef.set(id);
        
        // Kiểm tra xem thiết bị đã tồn tại trong cơ sở dữ liệu chưa
        deviceRef.once('value', (snapshot) => {
            const deviceExists = snapshot.exists();

            // Nếu thiết bị chưa tồn tại, thêm thông tin vào
            if (!deviceExists) {
                deviceRef.set({
                    ID: +id,
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

  async function findDeviceInfoByPartialName(partialName) {
    try {
        const devicesRef = elistRef;
        const devicesSnapshot = await devicesRef.once('value');
        const matchingDevices = [];

        devicesSnapshot.forEach(childSnapshot => {
            const deviceName = childSnapshot.key;
            const deviceData = childSnapshot.val();
            if (deviceName.toLowerCase().includes(partialName.toLowerCase())) {
                matchingDevices.push({ name: deviceName, data: deviceData });
            }
        });

        if (matchingDevices.length > 0) {
            return matchingDevices;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi tìm thiết bị theo tên:", error);
        return null;
    }
}

async function FindDeviceByID(deviceID) {
    try {
        const deviceRef = elistRef.orderByChild("ID").equalTo(deviceID);
        const snapshot = await deviceRef.once('value');

        if (snapshot.exists()) {
            const deviceData = snapshot.val();
            return deviceData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Lỗi khi tìm thiết bị theo ID:", error);
        return null;
    }
}


  //------------------------------------------------------------------------------------------------------------//


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

  function importMedicine(medicineName, importQuantity, expirationDate, transactionDate) {
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

            // Lưu thông tin về giao dịch nhập thuốc
            const transactionData = {
                action: 'import',
                quantity: importQuantity,
                transactionDate: transactionDate,
                expirationDate: expirationDate
            };
            mlistRef.child(`${medicineName}/transactions`).push(transactionData);
        } else {
            // Nếu loại thuốc chưa tồn tại, tạo một batch mới và lưu vào
            CreateMedicine(medicineName, importQuantity, expirationDate);
            console.log(`Đã tạo batch mới cho thuốc ${medicineName} với hạn sử dụng ${expirationDate} và số lượng ${importQuantity}`);

            // Lưu thông tin về giao dịch nhập thuốc
            const transactionData = {
                action: 'nhập',
                quantity: importQuantity,
                transactionDate: transactionDate,
                expirationDate: expirationDate
            };
            mlistRef.child(`${medicineName}/transactions`).push(transactionData);
        }
    });
}

function exportMedicine(medicineName, exportQuantity, transactionDate) {
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

            // Lưu thông tin về giao dịch xuất thuốc
            const transactionData = {
                action: 'xuất',
                quantity: exportQuantity,
                transactionDate: transactionDate
            };
            mlistRef.child(`${medicineName}/transactions`).push(transactionData);
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

function findMedicineByNamePartial(medicineNamePartial) {
    mlistRef.once('value', (snapshot) => {
        const medicines = snapshot.val();
        if (medicines) {
            const foundMedicines = Object.keys(medicines).filter(medicineName => {
                return medicineName.toLowerCase().includes(medicineNamePartial.toLowerCase());
            });
            if (foundMedicines.length > 0) {
                console.log("Các thuốc được tìm thấy:");
                foundMedicines.forEach(medicineName => {
                    const medicineInfo = medicines[medicineName];
                    console.log(`Tên thuốc: ${medicineName}`);
                    console.log(`Thông tin từng batch:`);
                    Object.keys(medicineInfo).forEach(batchId => {
                        const batchInfo = medicineInfo[batchId];
                        console.log(`- Batch ${batchId}:`);
                        console.log(`  + Số lượng: ${batchInfo.quantity}`);
                        console.log(`  + Hạn sử dụng: ${batchInfo.expirationDate}`);
                    });
                    console.log("--------------------------------------");
                });
            } else {
                console.log("Không tìm thấy thuốc phù hợp.");
            }
        } else {
            console.log("Không có dữ liệu về thuốc trong hệ thống.");
        }
    });
}



function displayTransactionHistory() {
    const medicinesRef = firebase.database().ref("Mlist");

    // Lặp qua tất cả các loại thuốc
    medicinesRef.once("value", (snapshot) => {
        snapshot.forEach((medicineSnapshot) => {
            const medicineName = medicineSnapshot.key;
            const transactionRef = firebase.database().ref("Mlist").child(medicineName).child("transactions");

            // Query transactions sorted by transactionDate in descending order
            transactionRef.orderByChild("transactionDate").once("value", (transactionSnapshot) => {
                console.log(`Lịch sử nhập xuất cho thuốc ${medicineName}:`);
                transactionSnapshot.forEach((childSnapshot) => {
                    const transaction = childSnapshot.val();
                    console.log("Loại giao dịch:", transaction.action);
                    console.log("Số lượng:", transaction.quantity);
                    
                    // Kiểm tra loại giao dịch để hiển thị thông tin hạn sử dụng chỉ khi là giao dịch nhập
                    if (transaction.action === "nhập") {
                        console.log("Hạn sử dụng:", transaction.expirationDate);
                    }
                    
                    console.log("Ngày giao dịch:", transaction.transactionDate);
                    console.log("------------");
                    // Hiển thị thông tin giao dịch trên giao diện người dùng thay vì log ra console
                });
            });
        });
    });
}


  





