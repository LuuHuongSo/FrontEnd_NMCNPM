/*Array.prototype.find2 = function(callback) {
	for(var i = 0; i < this.length; i++) {
  	if(callback(this[i])) {
        return this[i];
    }
  }
  return undefined;
};

var courses = [
	{
  	id: 1,
    name: 'Javascript'
  },
  {
  	id: 2,
    name: 'PHP'
  }
];

var findcourse = courses.find2(function(course) {
	return course.name === 'PHP';
});

console.log(findcourse);

var promise = Promise.resolve();
console.log(typeof promise);

var users = [
  {
    id: 1,
    name: 'Chatle'
  },
  {
    id: 2,
    name: 'Diepdong'
  },
  {
    id: 3,
    name: 'thu3'
  }
  //
];

var comments = [
  {
    id: 1,
    userid: 2,
    content: 'chat vai leu'
  },
  {
    id: 2,
    userid: 1,
    content: 'cam on ban'
  }
];
// lay ra comment
// tu comment lay ra userid
// tu userid lay ra user tuowng ung
//fake api
/*function getComments() {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(comments);
    }, 1000)
  })
}

function getUserByIds(userids) {
  return new Promise(function (resolve) {
    setTimeout(function() {
      var result = users.filter(function(user) {
        return userids.includes(user.id);
      });
      resolve(result);
    }, 1000);
  });
}

getComments()
  .then(function(comments) {
    var userids = comments.map(function (comment) {
      return comment.userid;
    });
    console.log(userids);
    return getUserByIds(userids) 
      .then(function(users) {
        return {
          users: users,
          comments: comments
        }
      });
  })
  .then(function(data) {
    var commentblock = document.getElementById('commentbox');
    console.log(commentblock);
    var html ='';
    data.comments.forEach(function(comment) {
      var user = data.users.find(function (user) {
        return user.id === comment.userid;
      });
      html += `<li> ${user.name}: ${comment.content} </li>` ;
    });
    commentblock.innerHTML = html;
  });

*/




/*var foodlistblock = document.querySelector('#foodlist');

var foodApi = 'http://localhost:3000/foods'

function start() {
  //sử dụng hàm call back đã được định nghĩa ở dưới
  getFoods(function(foods) {
    renderFoods(foods);
  })
  handleCreateForm();
}

start();

// định nghĩa một hàm sử dụng callback
function getFoods(callback) {
  fetch(foodApi) 
  .then(function(response) {
    return response.json();
  }) // return một promise có tham số là giá trị javascript của object kiểu resolve(Foods)
  .then(callback);
  // ở đây có thể đưa thẳng hàm renderfood vào chứ không cần phải function(foods) { renderfoods(foods)}
}

function createFood(data, callback) {
  var option = {
    method: 'POST',
    body: JSON.stringify(data)
  };
  fetch(foodApi, option) 
    // gửi thành công, trả về 1 promise với tham số là json mới tạo mới
    .then(function(response) {
      response.json();
      console.log(response.json());
    })
    // trả về tiếp một promise thành công với tham số là javascript type của phần tử mới tạo
    .then(callback);
}

function renderFoods(foods) {
  var foodlistblock = document.querySelector('#foodlist');
  var htmls = foods.map(function(food) {
    return `<li>${food.name}: giá tiền: ${food.price}</li>`
  });
  foodlistblock.innerHTML = htmls.join('');
}

// lấy thông tin nhập vào từ form
function handleCreateForm() {
  var createBtn = document.querySelector('#create') 

  createBtn.onclick = function() {
    var name = document.querySelector('input[name="name"]').value;
    var price = document.querySelector('input[name="price"]').value;
    var id = document.querySelector('input[name="id"]').value;
    var description = document.querySelector('input[name="description"]').value;

    var formData = {
      id: id,
      name: name,
      price: price,
      description: description
    };
    createFood(formData, getFoods(renderFoods));
  }
}
  */


function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}

document.getElementById("customerBtn").onclick = function() {
  document.querySelector(".customer-login").style.display = "block";
  document.querySelector(".owner-login").style.display = "none";
};

document.getElementById("ownerBtn").onclick = function() {
  document.querySelector(".owner-login").style.display = "block";
  document.querySelector(".customer-login").style.display = "none";
};









