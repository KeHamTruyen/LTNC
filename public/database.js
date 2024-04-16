//npm install firebase-admin
//npm install firebase
//npm install firebase@8.9.1


Employee.createEmployee("Ngô Thị Bắp", "Bác sĩ", "Tiến Sĩ", "Đa Khoa", "ngothibap@gmail.com", "0372193590" );
Employee.createEmployee("Lòng Thị Lèo ", "Bác sĩ", "Tiến Sĩ", "Da liễu", "longthileo@gmail.com", "0328232853" );
Employee.createEmployee("Nguyễn Văn A", "Bác sĩ", "Tiến Sĩ", "Tai - Mũi Họng", "nguyenvana@gmail.com", "0425343756");
Employee.createEmployee("Yua Mikami ", "Y tá", "Cử nhân ", "", "yuamikami@gmail.com", "0354723284");
Employee.createEmployee("Trần Thị B", "Y tá", "Cử nhân ", "", "tranthib@gmail.com", "0348166825");
Employee.createEmployee("Lê Văn Cần", "Y tá", "Cử nhân ", "", "levanccan@gmail.com", "0342374887");
Employee.createEmployee("Trần Văn Tèo", "Y tá", "Cử nhân ", "", "tranvanteo@gmail.com", "0352732951");
Employee.createEmployee("Hoshino Nami", "Điều dưỡng", "Cao Đẳng", "", "hoshinonami@gmail.com", "0373304941" );
Employee.createEmployee("Nguyễn Thanh Tùng", "Trợ lí điều dưỡng", "Trung Cấp", "", "nguyenthanhtung@gmail.com", "0332362782");
Employee.createEmployee("Đỗ Bách Khoa", "Trợ lí điều dưỡng", "Cao Đẳng", "", "dobachkhoa@gmail.com", "0369497731");

// Thêm lịch làm việc cho thứ Hai
addSchedule("Monday", "Shift1", 1, 4, "08:00", "11:30");
addSchedule("Monday", "Shift2", 2, 5, "13:00", "16:30");
addSchedule("Monday", "Shift3", 3, 7, "16:30", "20:00");

// Thêm lịch làm việc cho thứ Ba
addSchedule("Tuesday", "Shift1", 2, 6, "08:00", "11:30");
addSchedule("Tuesday", "Shift2", 1, 8, "13:00", "16:30");
addSchedule("Tuesday", "Shift3", 3, 9, "16:30", "20:00");

// Thêm lịch làm việc cho thứ Tư
addSchedule("Wednesday", "Shift1", 3, 4, "08:00", "11:30");
addSchedule("Wednesday", "Shift2", 1, 5, "13:00", "16:30");
addSchedule("Wednesday", "Shift3", 2, 10, "16:30", "20:00");

// Thêm lịch làm việc cho thứ Năm
addSchedule("Thursday", "Shift1", 1, 6, "08:00", "11:30");
addSchedule("Thursday", "Shift2", 3, 7, "13:00", "16:30");
addSchedule("Thursday", "Shift3", 2, 8, "16:30", "20:00");

// Thêm lịch làm việc cho thứ Sáu
addSchedule("Friday", "Shift1", 2, 9, "08:00", "11:30");
addSchedule("Friday", "Shift2", 1, 4, "13:00", "16:30");
addSchedule("Friday", "Shift3", 3, 5, "16:30", "20:00");

// Thêm lịch làm việc cho thứ Bảy
addSchedule("Saturday", "Shift1", 3, 6, "08:00", "11:30");
addSchedule("Saturday", "Shift2", 2, 7, "13:00", "16:30");
addSchedule("Saturday", "Shift3", 1, 10, "16:30", "20:00");

//--------------------------------------------------------------------------//

CreateMedicine("paracetamol","40","2024-8-1");
CreateMedicine("panadol","50","2024-9-1");
CreateMedicine("VitaminC","60","2024-10-3");
CreateMedicine("Otrivin","70","2024-11-2");

//--------------------------------------------------------------//

CreateDeviceInfo("Máy đo huyết áp","hoạt động","5","2024-8-1");
CreateDeviceInfo("Máy phân tích KQXN","hoạt động","5","2024-8-1");
CreateDeviceInfo("Máy xông mũi","hoạt động","5","2024-8-1");
CreateDeviceInfo("Máy siêu âm","hoạt động","5","2024-8-1");
CreateDeviceInfo("Giường bệnh","hoạt động","5","2024-8-1");