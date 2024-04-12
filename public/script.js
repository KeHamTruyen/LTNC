// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Hàm tăng số lượng thuốc
function increaseQuantity(id) {
    // Lấy thông tin số lượng và hạn sử dụng của thuốc
    var quantityElement = document.querySelector('.quantity[data-id="' + id + '"]');
    var expirationElement = document.querySelector('.expiration[data-id="' + id + '"]');
    
    // Nhập số lượng thuốc
    var enteredQuantity = parseInt(prompt("Nhập số lượng thuốc"));
    if (isNaN(enteredQuantity) || enteredQuantity <= 0) {
        alert("Số lượng nhập vào không hợp lệ!");
        return;
    }

    // Nhập hạn sử dụng của thuốc
    var enteredExpiration = prompt("Nhập hạn sử dụng của thuốc (định dạng: yyyy-mm-dd)");
    if (!isValidDate(enteredExpiration)) {
        alert("Hạn sử dụng nhập vào không hợp lệ!");
        return;
    }

    // Kiểm tra xem đã có thuốc với hạn sử dụng trùng không
    var existingItem = document.querySelector('.medicine-item[data-id="' + id + '"][data-expiration="' + enteredExpiration + '"]');
    if (existingItem) {
        // Nếu có, tăng số lượng thêm vào số lượng hiện tại
        var existingQuantity = parseInt(existingItem.querySelector('.quantity').innerText);
        existingItem.querySelector('.quantity').innerText = existingQuantity + enteredQuantity;
    } else {
        // Nếu không, tạo một dòng mới với số lượng và hạn sử dụng mới
        var newItem = document.createElement('li');
        newItem.classList.add('medicine-item');
        newItem.setAttribute('data-id', id);
        newItem.setAttribute('data-expiration', enteredExpiration);
        newItem.innerHTML = `
            <div class="medicine-details">
                <div class="medicine-name">Paracenadol</div>
                <div class="medicine-info">
                    <div class="medicine-quantity">Số lượng: <span class="quantity" data-id="${id}">${enteredQuantity}</span></div>
                    <div class="medicine-expiration">Hạn sử dụng: <span class="expiration" data-id="${id}">${enteredExpiration}</span></div>
                </div>
            </div>
            <div class="quantity-container">
                <button class="quantity-button" onclick="increaseQuantity(${id})">Nhập</button>
                <button class="quantity-button" onclick="decreaseQuantity(${id})">Xuất</button>
            </div>
        `;
        
        // Tìm vị trí chèn mới
        var position = findInsertionPosition(id, enteredExpiration);
        var list = document.querySelector('.medicine-list');
        if (position === -1) {
            list.appendChild(newItem);
        } else {
            var referenceNode = list.children[position];
            list.insertBefore(newItem, referenceNode);
        }
    }
}

function findInsertionPosition(id, expiration) {
    var items = document.querySelectorAll('.medicine-item[data-id="' + id + '"]');
    for (var i = 0; i < items.length; i++) {
        var itemExpiration = items[i].getAttribute('data-expiration');
        if (expiration === itemExpiration) {
            return i + 1; // Chèn vào dòng bên dưới dòng hiện tại
        }
    }
    return -1; // Chèn vào cuối danh sách
}

function isValidDate(dateString) {
    // Kiểm tra định dạng ngày
    var regex = /^\d{4}-\d{2}-\d{2}$/;
    if(!regex.test(dateString)) {
        return false;
    }
    // Kiểm tra ngày có hợp lệ không
    var parts = dateString.split("-");
    var year = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var day = parseInt(parts[2], 10);
    if(year < 1000 || year > 3000 || month == 0 || month > 12) {
        return false;
    }
    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        monthLength[1] = 29;
    }
    return day > 0 && day <= monthLength[month - 1];
}


function decreaseQuantity(id) {
    // Hiển thị cửa sổ pop-up để nhập số lượng
    let quantity = prompt("Nhập số lượng:");
    // Kiểm tra xem người dùng đã nhập số lượng chưa và kiểm tra nếu là số hợp lệ
    if (quantity !== null && !isNaN(quantity) && quantity !== "") {
        quantity = parseInt(quantity);
        // Kiểm tra xem số lượng muốn xuất có lớn hơn hoặc bằng số lượng hiện có không
        if (quantity <= medicineData[id].quantity) {
            // Nếu số lượng nhập vào là số hợp lệ, thực hiện giảm số lượng và cập nhật vào HTML
            const quantitySpan = document.querySelector(`.quantity[data-id="${id}"]`);
            const expirationSpan = document.querySelector(`.expiration[data-id="${id}"]`);
            medicineData[id].quantity -= quantity;
            quantitySpan.textContent = medicineData[id].quantity;
            expirationSpan.textContent = medicineData[id].expiration;
            recordTransaction(id, "Xuất", medicineData[id].quantity);
        } else {
            alert("Số lượng xuất vượt quá số lượng hiện có.");
        }
    }
}


// Hàm giảm số lượng thuốc


// Hàm ghi lại giao dịch và thêm thông tin ngày/tháng/năm
function recordTransaction(id, type, quantity) {
    const date = new Date();
    const dateString = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    console.log("Thuốc " + id + ": " + type + " " + quantity + " vào ngày " + dateString);
}