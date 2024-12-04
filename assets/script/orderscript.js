function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}

// xu ly hàm main
const orderList = [];
var menuApi = 'http://localhost:8080/menu'
var orderApi = 'http://localhost:3000/order'

function start() {
  getMenuItem('all', function(filteredItems) { 
      renderMenu(filteredItems);
      setupTabs(); 
  });

  handleCreateForm();
  applyRoleBasedActions(localStorage.getItem("role"));
}

start();

// thiet lap cac chuc nang customer
// xu ly menu
function getMenuItem(filterCategory, callback) {
  fetch(menuApi) 
    .then(function(response) {
      return response.json();
    })
    .then(function(menuItems) {
      const filteredItems = menuItems.filter(item => 
        filterCategory === 'all' || item.category === filterCategory
      );
      callback(filteredItems);
    })
    .catch(function(error) {
      console.log('Failed to fetch menu items:', error);
    });
}
function renderMenu(menuItems) {
  if(localStorage.getItem("role") === "CUSTOMER") {
      var menuBlock = document.querySelector('.customer-menu-items');

      var htmls = menuItems.map(function(menuItem) {
          return `<div class="customer-menu-item">
              <p>${menuItem.name}</p>
              <p>Giá tiền: ${menuItem.price}</p>
              <button class="add-to-order" data-id="${menuItem.id}" 
              data-name="${menuItem.name}" 
              data-price="${menuItem.price}">Chọn</button>
            </div>`
      });
      menuBlock.innerHTML = htmls.join('');
      setUpAddtoOrderBtns();
  } else if(localStorage.getItem("role") === "MANAGER") {
      var menuBlock = document.querySelector('.manager-menu-items');

      var htmls = menuItems.map(function(menuItem) {
      return `<div class="manager-menu-item">
                  <p>${menuItem.name}</p>
                  <p>Giá tiền: ${menuItem.price}</p>
              </div>`
      });
      menuBlock.innerHTML = htmls.join('');
  }
}


function setupTabs() {
  if(localStorage.getItem("role") === "CUSTOMER") {
      const tabs = document.querySelectorAll('.customer-menu-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
          tabs.forEach(tab => tab.classList.remove('active'));
          this.classList.add('active');
  
          const selectedCategory = this.dataset.category;
  
          getMenuItem(selectedCategory, function(filteredItems) {
          renderMenu(filteredItems);
          });
      });
    });
  } else if(localStorage.getItem("role") === "MANAGER") {
      const tabs = document.querySelectorAll('.manager-menu-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
          tabs.forEach(tab => tab.classList.remove('active'));
          this.classList.add('active');
  
          const selectedCategory = this.dataset.category;
  
          getMenuItem(selectedCategory, function(filteredItems) {
          renderMenu(filteredItems);
          });
      });
    });
  }
}


function setUpAddtoOrderBtns() {
  const btns = document.querySelectorAll('.add-to-order');
  const orderContainer = document.querySelector('#order-list');

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = this.dataset.price;

      const existingItem = orderList.find(item => item.id === id);
      if (existingItem) {
        alert('Đã thêm món này vào đơn đặt hàng');
        return;
      }

      const newItem = { id, name, price, quantity: 1 }; // Thêm thuộc tính quantity
      orderList.push(newItem);

      const li = document.createElement('li');
      li.classList.add('order-item');
      li.dataset.id = id;

      li.innerHTML = `
        ${name} - ${price} VND
        <button class="remove-order">Delete</button>
        <div class="quantity-container">
          <button class="decrease-quantity">-</button>
          <input type="number" id="quantity" value="1" readonly>
          <button class="increase-quantity">+</button>
        </div>
      `;

      // Xóa món
      li.querySelector('.remove-order').addEventListener('click', function () {
        removeOrderItem(id, li);
      });

      // Tăng số lượng
      li.querySelector('.increase-quantity').addEventListener('click', function () {
        const input = li.querySelector('#quantity');
        let quantity = parseInt(input.value);
        quantity += 1;
        input.value = quantity;

        // Cập nhật số lượng trong orderList
        const item = orderList.find(item => item.id === id);
        item.quantity = quantity;
      });

      // Giảm số lượng
      li.querySelector('.decrease-quantity').addEventListener('click', function () {
        const input = li.querySelector('#quantity');
        let quantity = parseInt(input.value);
        if (quantity > 1) {
          quantity -= 1;
          input.value = quantity;

          // Cập nhật số lượng trong orderList
          const item = orderList.find(item => item.id === id);
          item.quantity = quantity;
        }
      });

      orderContainer.appendChild(li);
    });
  });
}


function removeOrderItem(id, element) {
  // Xóa khỏi danh sách order
  const index = orderList.findIndex(item => item.id === id);
  if (index !== -1) {
      orderList.splice(index, 1);
  }
  element.remove();
}


// hien thi thong tin 
document.addEventListener('DOMContentLoaded', function () {
  const customerTableButtons = document.querySelectorAll('.customer-table-btn');

  function fetchOccupiedTables() {
    fetch(orderApi)
      .then((response) => response.json())
      .then((orders) => {
        const occupiedTables = orders.map((order) => order.table);

        // lấy thông tin trong mảng số bàn check trùng để hiển thị
        customerTableButtons.forEach((button) => {
          const tableNumber = parseInt(button.dataset.table);
          if (occupiedTables.includes(tableNumber)) {
            button.classList.add('occupied');
          } else {
            button.classList.remove('occupied');
          }

          // đánh dấu bàn đã đặt
          button.addEventListener('click', function () {
              if (!button.classList.contains('occupied')) {
                document.querySelectorAll('.customer-table-btn.selected').forEach((btn) => {
                  btn.classList.remove('selected');
                });

                button.classList.add('selected');
                const selectedTable = button.dataset.table;
                console.log(`Table ${selectedTable} selected.`);
              }
            });
          });
        })
        .catch((error) => {
          console.error("Error fetching table data:", error);
        });
  }

  fetchOccupiedTables();
});

// gui
let orders = [];

// Gửi order
document.querySelector('.send-order').addEventListener('click', function () {
  const table = parseInt(document.querySelector('.customer-table-btn.selected')?.dataset.table); // Số bàn
  if (!table) {
    alert('Vui lòng chọn bàn trước khi gửi order!');
    return;
  }

  const orderItems = [];
  let totalAmount = 0;

  document.querySelectorAll('#order-list .order-item').forEach(item => {
    const id = item.dataset.id;
    const name = item.textContent.split(' - ')[0].trim(); 
    const price = parseInt(item.textContent.split(' - ')[1]); 
    const quantity = parseInt(item.querySelector('#quantity').value);

    if (!quantity || quantity <= 0) {
      alert(`Vui lòng nhập số lượng hợp lệ cho món: ${name}`);
      return;
    }

    totalAmount += price * quantity; 

    orderItems.push({
      id,
      menuItem: {
        id,
        name,
        description: "", 
        price,
        category: item.category,
        isAvailable: true
      },
      quantity,
      price: price * quantity,
      specialInstruction: "" 
    });
  });

  if (orderItems.length === 0) {
    alert('Đơn hàng của bạn đang trống!');
    return;
  }

  // Chuẩn bị dữ liệu gửi đi
  const orderData = {
    id: String(table), // ID đơn hàng, trùng với table
    table: table, // Số bàn
    customer: table, // Trùng với số bàn
    orderItems,
    orderStatus: "PENDING", // Trạng thái mặc định
    orderTime: new Date().toISOString(), // Thời gian hiện tại
    totalAmount // Tổng số tiền
  };

  // Gửi dữ liệu đến server
  fetch(orderApi, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      alert('Đơn hàng đã gửi thành công!');
      console.log(data);

      // Thêm vào danh sách hiển thị
      addOrder({
        table: table,
        items: orderItems.map(item => item.menuItem.name),
        total: totalAmount,
        status: "PENDING" // Trạng thái mặc định
      });

      // renderOrders();

      // Xoá danh sách sau khi gửi
      document.querySelector('#order-list').innerHTML = '';
      orderList.length = 0; // Xóa dữ liệu trong orderList
    })
    .catch(error => {
      console.error(error);
      alert('Có lỗi xảy ra khi gửi đơn hàng.');
    });
});


// Thêm order vào danh sách
function addOrder(order) {
  orders.push(order);
}



///////////////////////////////////////////////////////////////////////////////////////
// thiet lap cac chuc nang manager

// xu ly menu

function createMenuItem(menuItem,callback) {
  var option = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem)
  }
  fetch(menuApi, option) 
    .then(function(response) {
      response.json();
    })
    .then(callback)
    .catch(function(error) {
      console.log("Error creating menu item:", error);
  });
}

function deleteMenuItem(id, callback) {
  var option = {
    method: 'DELETE'
  }
  fetch(id, option) 
    .then(function(response) {
      response.json();
    })
    .then(callback);
}

function putMenuItem(data, callback) {
  var option = {
    method: 'PUT',
    body: JSON.stringify(data),
    header: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  };
  fetch(menuApi, option) 
    .then(function(response) {
      response.json();
    })
    .then(callback);
}

function handleCreateForm() {
  var createButton = document.querySelector('#createBtn');
  if (!createButton) {
    console.error('Không tìm thấy nút #createBtn');
    return;
  }
  createButton.onclick = function() {
    var name = document.getElementById('item-name').value;
    var price = document.getElementById('item-price').value;
    var description = document.getElementById('item-description').value;
    var category = document.getElementById('category').value;


    if (!name || !price || !category) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    var formData = {
      name: name,
      price : price,
      description: description,
      category: category,
      isAvailable: true
    };
    createMenuItem(formData, function() {
      alert("Thêm sản phẩm thành công!");
      getMenuItem(renderMenu);
    });
  }
}



// hien thi thong tin 
document.addEventListener('DOMContentLoaded', function () {
  const customerTableButtons = document.querySelectorAll('.manager-table-btn');
  const orderDetailsContainer = document.getElementById('order-details'); // Khu vực hiển thị chi tiết đơn hàng

  function fetchOccupiedTables() {
      fetch(orderApi)
          .then((response) => response.json())
          .then((orders) => {
              const occupiedTables = orders.map((order) => order.table);

              // Duyệt qua từng nút bàn
              customerTableButtons.forEach((button) => {
                  const tableNumber = parseInt(button.dataset.table);

                  // Nếu bàn có đơn hàng, thêm class "occupied"
                  if (occupiedTables.includes(tableNumber)) {
                      button.classList.add('occupied');
                      button.disabled = false; // Bàn có thể nhấn
                      button.style.backgroundColor = 'green'; // Màu xanh cho bàn có đơn hàng
                  } else {
                      button.classList.remove('occupied');
                      button.disabled = true; // Bàn không có đơn hàng thì không nhấn được
                      button.style.backgroundColor = ''; // Trả lại màu mặc định
                  }

                  // Gắn sự kiện nhấn để hiển thị chi tiết đơn hàng
                  button.addEventListener('click', function () {
                      // Bỏ class "selected" khỏi các bàn khác
                      document.querySelectorAll('.manager-table-btn.selected').forEach((btn) => {
                          btn.classList.remove('selected');
                      });

                      // Đánh dấu bàn được chọn
                      button.classList.add('selected');
                      const selectedTable = tableNumber;
                      console.log(`Table ${selectedTable} selected.`);

                      // Lấy chi tiết đơn hàng của bàn được chọn
                      const selectedOrder = orders.find((order) => order.table === selectedTable);
                      if (selectedOrder) {
                          displayOrderDetails(selectedOrder);
                      } else {
                          orderDetailsContainer.innerHTML = `<p>Không có đơn hàng nào cho bàn ${selectedTable}.</p>`;
                      }
                  });
              });
          })
          .catch((error) => {
              console.error('Error fetching table data:', error);
          });
  }

  function displayOrderDetails(order) {
      // Hiển thị thông tin chi tiết của đơn hàng
      const orderHTML = `
          <h3>Đơn hàng của bàn ${order.table}</h3>
          <p><strong>Trạng thái:</strong> ${order.orderStatus}</p>
          <p><strong>Tổng tiền:</strong> ${order.totalAmount} VND</p>
          <p><strong>Thời gian đặt hàng:</strong> ${new Date(order.orderTime).toLocaleString()}</p>
          <ul>
              ${order.orderItems.map(item => `
                  <li>
                      <strong>${item.menuItem.name}</strong> - 
                      ${item.quantity} x ${item.menuItem.price} VND = ${item.price} VND
                  </li>
              `).join('')}
          </ul>
      `;
      orderDetailsContainer.innerHTML = orderHTML;
  }

  fetchOccupiedTables();
});

function toggleAddItem() {
const addItemContainer = document.getElementById("add-item-container");
if (addItemContainer.style.display === "block") {
  addItemContainer.style.display = "none";
} else {
  addItemContainer.style.display = "block";
}
}

function toggleSubItem() {
const subItemContainer = document.getElementById("sub-item-container");
if(subItemContainer.style.display ==="block") {
  subItemContainer.style.display = "none";
} else {
  subItemContainer.style.display = "block";
}
}
  








// Phân quyền
function applyRoleBasedActions(role) {

  const customerActions = document.getElementById("customerActions");
  const managerActions = document.getElementById("managerActions");

  if (customerActions) customerActions.style.display = "none";
  if (managerActions) managerActions.style.display = "none";

  // Hiển thị
  if (role === "MANAGER" && managerActions) {
      managerActions.style.display = "block"; 
      console.log("Hiển thị Manager Actions");
  } else if (role === "CUSTOMER" && customerActions) {
      customerActions.style.display = "block";
      console.log("Hiển thị Customer Actions");
  } else {
      console.log("Không có vai trò nào được tìm thấy");
  }
}
