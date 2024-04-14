import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
const firebaseConfig = {
    apiKey: "AIzaSyAd4_Np45sRl5uPdciyOrF3U6xT62gnzUQ",
    authDomain: "ltnc-3a24c.firebaseapp.com",
    databaseURL: "https://ltnc-3a24c-default-rtdb.firebaseio.com",
    projectId: "ltnc-3a24c",
    storageBucket: "ltnc-3a24c.appspot.com",
    messagingSenderId: "1094416536083",
    appId: "1:1094416536083:web:6b93941974081ac898a5e6",
    measurementId: "G-05YGQ7YMHQ"
  };
const app=initializeApp(firebaseConfig);
const db=getDatabase();



//------------------------------------------------------------------------------------//
// Initialize Firebase


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


// Initialize Firebase


//--------------------------------------------------------------------------------------------------//
const deviceTable = document.getElementById("deviceTable");
const editForm = document.getElementById("editForm");
const editDate = document.getElementById("editDate");
const editDeviceNameSelect = document.getElementById("editDeviceName");
const editDateDeviceNameSelect = document.getElementById("editDateDeviceName");
const editDeviceStatus = document.getElementById("editDeviceStatus");
const editQuantity = document.getElementById("editQuantity");
const editMaintenanceDateInput = document.getElementById("editMaintenanceDate");

const elistRef = firebase.database().ref("/Elist" );

// Hàm cập nhật thông tin thiết bị
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

updateDeviceInfo(1, Hoạt, 1, 2024);

function populateDeviceNames() {
// Xóa tất cả các tùy chọn hiện có trong danh sách
editDeviceNameSelect.innerHTML = "";
editDateDeviceNameSelect.innerHTML = "";

const rows = deviceTable.querySelectorAll("tbody tr");

rows.forEach((row) => {
  const deviceName = row.querySelector("td:first-child").textContent;
  
  // Thêm tùy chọn vào cả hai dropdown
  const option1 = document.createElement("option");
  option1.text = deviceName;
  option1.value = deviceName;
  editDeviceNameSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.text = deviceName;
  option2.value = deviceName;
  editDateDeviceNameSelect.appendChild(option2);
});
}

function showEditForm() {
populateDeviceNames();
editForm.style.display = "block";
}

function showEditDateForm() {
populateDeviceNames();
editDate.style.display = "block";
}

function confirmEdit() {
const selectedDeviceName = editDeviceNameSelect.value;
const selectedDeviceStatus = editDeviceStatus.value;
const selectedQuantity = editQuantity.value;

const rowIndex = findRowIndex(selectedDeviceName);
if (rowIndex !== -1) {
  const row = deviceTable.rows[rowIndex + 1]; // rowIndex + 1 để bỏ qua hàng đầu tiên (tiêu đề)
  row.cells[1].textContent = selectedDeviceStatus; // Cập nhật trạng thái
  row.cells[3].textContent = selectedQuantity; // Cập nhật số lượng
  db.ref("/EquipmentList").update({
    
  })
  alert("Đã cập nhật thông tin thiết bị!");
  editForm.style.display = "none"; // Ẩn form chỉnh sửa sau khi hoàn thành
} else {
  alert("Không tìm thấy thiết bị với tên đã chọn.");
}
}

function confirmDate() {
const selectedDeviceName = editDateDeviceNameSelect.value;
const selectedMaintenanceDate = editMaintenanceDateInput.value;

const rowIndex = findRowIndex(selectedDeviceName);
if (rowIndex !== -1) {
  const row = deviceTable.rows[rowIndex + 1]; // rowIndex + 
  if (selectedMaintenanceDate !== "") {
    row.cells[2].textContent = selectedMaintenanceDate; // Cập nhật ngày bảo dưỡng nếu đã chọn
    alert("Đã cập nhật thông tin thiết bị!");
  } else {
    alert("Không cập nhật ngày bảo dưỡng.");
  }
  editDate.style.display = "none"; // Ẩn form chỉnh sửa sau khi hoàn thành
} else {
  alert("Không tìm thấy thiết bị với tên đã chọn.");
}
}

function cancelEdit() {
editForm.style.display = "none"; // Ẩn form chỉnh sửa khi hủy
}

function cancelEditDate() {
editDate.style.display = "none"; // Ẩn form chỉnh sửa khi hủy
}

function findRowIndex(deviceName) {
const rows = deviceTable.querySelectorAll("tbody tr");

for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  const name = row.querySelector("td:first-child").textContent;

  if (name === deviceName) {
    return i;
  }
}

return -1;
}
