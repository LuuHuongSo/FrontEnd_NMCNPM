function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
  }
  
  // Thêm sự kiện vào nút chọn món
  document.querySelectorAll('.add-to-order').forEach(button => {
    button.addEventListener('click', function() {
        let itemName = this.previousElementSibling.textContent;
        addToOrder(itemName);
    });
  });
  
  function addToOrder(itemName) {
    let orderList = document.getElementById('order-list');
    let orderItem = document.createElement('li');
    orderItem.textContent = itemName;
    orderList.appendChild(orderItem);
  }
  
  
//   var searchValue;
//   var searchMenuBar = document.querySelector('input[type ="text"]');
  
//   searchMenuBar.oninput = function(svalue) {
//     searchValue = svalue.target.value;
//     console.log(searchValue);
  
//   }
  
//   function findInMenu(k) {
//     products.filter(function(product) {
//       return product.name === k;
//     })
//   }
//   findInMenu(searchValue);
  
//   document.querySelector('.send-order').addEventListener('click', () => {
//     const selectedTable = document.getElementById('table-select').value;
//     if (!selectedTable) {
//         alert("Vui lòng chọn bàn trước khi gửi order.");
//     } else {
//         // Xử lý gửi order, bao gồm thông tin về bàn đã chọn
//         console.log("Bàn đã chọn:", selectedTable);
//         // Thêm các xử lý tiếp theo tùy nhu cầu
//     }
//   });

function toggleAddItem() {
    const addItemContainer = document.getElementById("add-item-container");
    if (addItemContainer.style.display === "block") {
        addItemContainer.style.display = "none";
    } else {
        addItemContainer.style.display = "block";
    }
  }
  /*
  function addItemToMenu() {
    const itemName = document.getElementById("item-name").value;
    const itemPrice = document.getElementById("item-price").value;
  
    if (itemName && itemPrice) {
        const menuItems = document.querySelector(".menu-items");
  
        // Tạo phần tử món ăn mới
        const menuItem = document.createElement("div");
        menuItem.className = "menu-item";
        menuItem.innerHTML = `
            <p>${itemName} - ${itemPrice} VND</p>
            <button class="add-to-order">Chọn</button>
        `;
  
        // Thêm món ăn vào danh sách
        menuItems.appendChild(menuItem);
  
        // Xóa nội dung input
        document.getElementById("item-name").value = "";
        document.getElementById("item-price").value = "";
  
        // Ẩn khu vực thêm món ăn
        toggleAddItem();
    } else {
        alert("Vui lòng nhập đầy đủ thông tin món ăn.");
    }
  }
  */

//xu ly voi menu
const orderList = [];
var menuApi = 'http://localhost:3000/foods'

function start() {
  getMenuItem('all', function(filteredItems) { 
    renderMenu(filteredItems);
    setupTabs(); 
  });
  handleCreateForm();
}

start();

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
  var menuBlock = document.querySelector('.menu-items');

  var htmls = menuItems.map(function(menuItem) {
    return `<div class="menu-item">
              <p>${menuItem.name}</p>
              <p>Giá tiền: ${menuItem.price}</p>
              <button class="add-to-order" data-id="${menuItem.id}" 
                data-name="${menuItem.name}" 
                data-price="${menuItem.price}">Chọn</button>
            </div>`
  });
  menuBlock.innerHTML = htmls.join('');
  setUpAddtoOrderBtns();
}

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

function setupTabs() {
  const tabs = document.querySelectorAll('.menu-tab');

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


function setUpAddtoOrderBtns() {
  const btns = document.querySelectorAll('.add-to-order');
  const orderContainer = document.querySelector('#order-list');

  btns.forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = this.dataset.price;

      const existingItem = orderList.find(item => item.id ===id);
      if(existingItem) {
        alert('Đã thêm món này vào đơn đặt hàng');
        return;
      }
      const newItem = {id, name, price};
      orderList.push(newItem);

      const li = document.createElement('li');
      li.classList.add('order-item');
      li.dataset.id = id;

      li.innerHTML =`
      ${name} - ${price} VND
      <button class ="remove-order">Delete</button>
      <input type ="number" id ="quantity" repuired>
      `;

      li.querySelector('.remove-order').addEventListener('click', function () {
        removeOrderItem(id, li);
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


//gui don order

var orderApi = "http://localhost:3000/order"
function postOder(data, callback) {
  var option = {
    method: 'POST',
    body: JSON.stringify(data)
  }
  fetch(orderApi, option)
    .then(function(response) {
      response.json();
    })
    .then(callback);
}

// function checkTableStatus() {
//   fetch(orderApi) 
//     .then(function(response) {
//       return response.json();
//     })
//     .then(function(orders) {
      
//     })
// }

// document.addEventListener('DOMContentLoaded', function () {
//     const tableButtons = document.querySelectorAll('.table-btn');

//     const occupiedTables = [3, 5]; // ví dụ Các bàn đã đặt

//     tableButtons.forEach((button) => {
//         const tableNumber = parseInt(button.dataset.table);
//         if (occupiedTables.includes(tableNumber)) {
//             button.classList.add('occupied');
//         }

//         button.addEventListener('click', function () {
//             if (!button.classList.contains('occupied')) {
//                 document.querySelectorAll('.table-btn.selected').forEach((btn) => {
//                     btn.classList.remove('selected');
//                 });

//                 button.classList.add('selected');

//                 const selectedTable = button.dataset.table;
//             }
//         });
//     });
// });

document.addEventListener('DOMContentLoaded', function () {
  const tableButtons = document.querySelectorAll('.table-btn');

  function fetchOccupiedTables() {
    fetch(orderApi)
      .then((response) => response.json())
      .then((orders) => {
        const occupiedTables = orders.map((order) => order.table);

        // lấy thông tin trong mảng số bàn check trùng để hiển thị
        tableButtons.forEach((button) => {
          const tableNumber = parseInt(button.dataset.table);
          if (occupiedTables.includes(tableNumber)) {
            button.classList.add('occupied');
          } else {
            button.classList.remove('occupied');
          }

          // đánh dấu bàn đã đặt
          button.addEventListener('click', function () {
              if (!button.classList.contains('occupied')) {
                document.querySelectorAll('.table-btn.selected').forEach((btn) => {
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

/*
fetch('http://localhost:8080/tables')
    .then(response => response.json())
    .then(data => {
        data.forEach((table) => {
            const button = document.querySelector(`.table-btn[data-table="${table.id}"]`);
            if (table.status === 'occupied') {
                button.classList.add('occupied');
            }
        });
    });*/

//chọn navigation



// hiển thị đơn 
let orders = [];

function addOrder(order) {
  orders.push(order);
}

// render đơn đặt hàng
function renderOrders() {
  const orderListModal = document.getElementById('order-list-modal');
  orderListModal.innerHTML = '';

  if (orders.length === 0) {
    orderListModal.innerHTML = '<li>Chưa có đơn đặt hàng nào!</li>';
    return;
  }

  orders.forEach(order => {
    const li = document.createElement('li');
    li.textContent = `Bàn ${order.table}: ${order.items.join(', ')} - Tổng: ${order.total} VND`;
    orderListModal.appendChild(li);
  });
}

document.getElementById('show-orders').addEventListener('click', function () {
  renderOrders();
  document.getElementById('order-modal').classList.remove('hidden');
});

document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('order-modal').classList.add('hidden');
});

// thêm đơn đặt hàng sẽ thêm theo thông tin trong listorder sẽ thực hiện sau khi nhấn gửi order
//vd
addOrder({
  table: 3,
  items: ['Món A', 'Món B', 'Món C'],
  total: 500000
});


