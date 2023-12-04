"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
// import {
//   getFirestore,
//   addDoc,
//   collection,
// } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";
import {
  getDatabase,
  ref,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCikFNmz2CE7VDyr_QAghlW-94ezu_HXKM",
  authDomain: "daraz-a56fb.firebaseapp.com",
  projectId: "daraz-a56fb",
  storageBucket: "daraz-a56fb.appspot.com",
  messagingSenderId: "679538188748",
  appId: "1:679538188748:web:3d48458417e86928d23d69",
  measurementId: "G-JDJ8HKMJD2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    document.getElementById("spinner").style.display = "none";

    const uid = user.uid;
    console.log(uid);

    // ...
  } else {
    // User is signed out
    // ...
  }
});

function userRegisteration() {
  const userName = document.getElementById("userName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confrmPassword = document.getElementById("confirm-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      Swal.fire({
        position: "top-50px",
        icon: "success",
        title: "Sign up Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      document.getElementById("spinner").style.display = "block";
      // Signed in

      const userInfo = {
        user_Name: userName,
        user_Email: email,
        user_Password: password,
      };

      await set(ref(database, `user/${auth.currentUser.uid}`), userInfo);

      location.href = "./index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ..
    });
}

function logIn() {
  const userName = document.getElementById("login-user-name").value;
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      console.log("user is login");

      Swal.fire({
        position: "top-50px",
        icon: "success",
        title: "Login Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      const user = userCredential.user;
      document.getElementById("spinner").style.display = "block";
      location.href = "./index.html";

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function logOut() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("user is signout");
      Swal.fire({
        position: "top-50px",
        icon: "success",
        title: "Logout Succesfully",
        showConfirmButton: false,
        timer: 1500,
      });

      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

//FETCH API TO GET ALL PRODUCT

const container = document.getElementById("container");

async function getPorducts() {
  const productsResponse = await fetch("https://dummyjson.com/products").then(
    (res) => res.json()
  );
  let products = productsResponse.products;
  console.log(products);

  //For Each
  products.forEach((data, i) => {
    const { id, thumbnail, title, price, category } = data;
    const card = `
        <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl" data-aos="fade-right" >
      <a href="#">
          <img src=${thumbnail}
                  alt="Product" class="h-80 w-72 object-cover rounded-t-xl" />
          <div class="px-4 py-3 w-72">
              <span class="text-gray-400 mr-3 uppercase text-xs">${category}</span>
              <p class="text-lg font-bold text-black truncate block capitalize">${title}</p>
              <div class="flex items-center">
                  <p class="text-lg font-semibold text-black cursor-auto my-3">$ ${price}</p>
                  <del>
                      <p class="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                  </del>
                  <button class="ml-auto" onclick = "addToCart(this , ${id})"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                          fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                          <path fill-rule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                          <path
                              d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                      </svg></button>
              </div>
          </div>
      </a>
  </div>`;
    container.innerHTML += card;
  });

  //map
  var categories = [];
  products.map((obj, i) => {
    if (!categories.includes(obj.category)) {
      categories.push(obj.category);
    }
  });

  categories.forEach((cat, i) => {
    var chip = `<button class="CatBtn" id="chip" onclick = "remove(this)">${cat}</button>`;
    tags.innerHTML += chip;
  });
}

getPorducts();

//FUNCTION ON CATEGOERY FUNCTION

const remove = (btn) => {
  container.innerHTML = null;
  async function checking() {
    const productsResponse = await fetch("https://dummyjson.com/products").then(
      (res) => res.json()
    );
    let products = productsResponse.products;
    console.log(products);

    const chipHtml = btn.innerText;
    console.log(chipHtml);
    var emptyArray = [];
    for (var i = 0; i < products.length; i++) {
      if (chipHtml === products[i].category) {
        console.log(products[i]);
        emptyArray.push(products[i]);
        console.log(emptyArray);
      }
    }

    emptyArray.forEach((element, i) => {
      const { thumbnail, title, price } = element;
      const catCard = `
        <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl" data-aos="fade-right" >
      <a href="#">
          <img src=${thumbnail}
                  alt="Product" class="h-80 w-72 object-cover rounded-t-xl" />
          <div class="px-4 py-3 w-72">
              <span class="text-gray-400 mr-3 uppercase text-xs">Brand</span>
              <p class="text-lg font-bold text-black truncate block capitalize">${title}</p>
              <div class="flex items-center">
                  <p class="text-lg font-semibold text-black cursor-auto my-3">$ ${price}</p>
                  <del>
                      <p class="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                  </del>
                  <div class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                          fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                          <path fill-rule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                          <path
                              d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                      </svg></div>
              </div>
          </div>
      </a>
  </div>`;
      container.innerHTML += catCard;
    });
  }

  checking();
};

//FETCH API TO GET SEARCH PRODUCT

async function getData() {
  var input = document.getElementById("userInput").value;
  console.log(input);
  const search = await fetch(
    `https://dummyjson.com/products/search?q=${input}`
  ).then((res) => res.json());

  console.log(search);
  container.innerHTML = null;
  search.products.forEach((data, i) => {
    const { thumbnail, title, price } = data;
    const card = `
        <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl" data-aos="fade-right" >
      <a href="#">
          <img src=${thumbnail}
                  alt="Product" class="h-80 w-72 object-cover rounded-t-xl" />
          <div class="px-4 py-3 w-72">
              <span class="text-gray-400 mr-3 uppercase text-xs">Brand</span>
              <p class="text-lg font-bold text-black truncate block capitalize">${title}</p>
              <div class="flex items-center">
                  <p class="text-lg font-semibold text-black cursor-auto my-3">$ ${price}</p>
                  <del>
                      <p class="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                  </del>
                  <div class="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                          fill="currentColor" class="bi bi-bag-plus" viewBox="0 0 16 16">
                          <path fill-rule="evenodd"
                              d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                          <path
                              d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                      </svg></div>
              </div>
          </div>
      </a>
  </div>`;
    container.innerHTML += card;
  });
}

//ADD TO CART FUNCTION

const addToCart = async (btn, id) => {
  // btn.preventDefault;
  if (auth.currentUser) {
    // .then(async (json) => console.log(json));
    const cartRef = ref(database, "cart/" + auth.currentUser.uid);
    const newRef = push(cartRef);
    set(newRef, {
      ...(await fetch(`https://dummyjson.com/products/${id}`).then((res) =>
        res.json()
      )),
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="">Why do I have this issue?</a>',
    });
  }
};

window.getPorducts = getPorducts;
window.addToCart = addToCart;
window.remove = remove;
window.getData = getData;
window.userRegisteration = userRegisteration;
window.logOut = logOut;
window.logIn = logIn;

// async function fakeApi(){
//     const call = await fetch('https://reqres.in/api/users?page=2').then(res=>res.json())
//     console.log(call)
// }
// fakeApi()
