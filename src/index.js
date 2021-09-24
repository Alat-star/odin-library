import './style.css';
import { initializeApp } from "firebase/app";
import firebaseConfig from '../firebaseConfig'


import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    getDocs,
    serverTimestamp,
    deleteDoc
  } from 'firebase/firestore';
// import db from '../firebas;eInit'
// const booksDocumentRef = doc(db, 'books', 'alovelace');
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import logo from '../images/1.jpg'
import uniqid from 'uniqid';




const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage(app)

  
function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }
  
  const images = importAll(require.context('../images', false, /\.(png|jpe?g|svg)$/));

const body = document.querySelector("body");
const grid = document.createElement("div");
body.appendChild(grid);
grid.setAttribute("class", "container");

/*Book constructor object */

class Books {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  info() {
    return `The ${title} by ${author}, ${pages}, ${read}`;
  }
}

/*form build */

const form = document.createElement("form");
form.setAttribute("class", "form-group");
const titleInput = document.createElement("input");
titleInput.setAttribute("placeholder", "Enter title");
titleInput.setAttribute("required", "");
form.appendChild(titleInput);
const authorInput = document.createElement("input");
authorInput.setAttribute("placeholder", "Author name");
authorInput.setAttribute("required", "");
form.appendChild(authorInput);
const pageInput = document.createElement("input");
pageInput.setAttribute("placeholder", "No of pages");
pageInput.setAttribute("type", "number");
pageInput.setAttribute("required", "");
form.appendChild(pageInput);
const readSelect = document.createElement("select");
const label = document.createElement("label");
label.textContent = "Read or not";
readSelect.appendChild(label);
const disableOption = document.createElement("option");
disableOption.textContent = "select";
disableOption.setAttribute("disabled", "disabled");
const readOption = document.createElement("option");
readOption.textContent = "Read";
const notRead = document.createElement("option");
notRead.textContent = "Not read yet";
readSelect.appendChild(disableOption);
readSelect.appendChild(readOption);
readSelect.appendChild(notRead);
readSelect.setAttribute("required", "");
form.appendChild(readSelect);
const formBtn = document.createElement("input");
formBtn.setAttribute("type", "button");
formBtn.setAttribute("class", "form-btn");
formBtn.setAttribute("value", "Add");
form.appendChild(formBtn);
const formCancel = document.createElement("button");
formCancel.setAttribute("class", "form-cancel");
formCancel.textContent = "❌";
form.appendChild(formCancel);
const formDiv = document.createElement("div");
formDiv.appendChild(form);
authorInput.required = true;

formDiv.setAttribute("class", "form-div");

/*close form event*/

formCancel.addEventListener("click", () => {
  titleInput.value = "";
  authorInput.value = "";
  pageInput.value = "";
  readSelect.value = "Read";
  body.removeChild(formDiv);
});

/*button to add new book*/

const btn = document.createElement("button");
btn.textContent = "New Book";

const remove = document.createElement("button");
remove.textContent = "Remove";
remove.setAttribute("class", "remove-btn");
body.appendChild(remove);

const btnDiv = document.createElement("div");
btnDiv.setAttribute("class", "btn-div");
btnDiv.appendChild(btn);
btnDiv.appendChild(remove);
body.appendChild(btnDiv);

btn.addEventListener("click", () => {
  body.insertBefore(formDiv, btnDiv);
  formDiv.setAttribute("style", "transform: rotatex(0deg)");
});

const imgSelector = () => {
  return Math.floor(Math.random() * 28);
};


/*new book event*/


formBtn.addEventListener("click", (e) => {

  e.preventDefault()
  const title = titleInput.value;
  const author = authorInput.value;
  const pages = pageInput.value;
  const read = readSelect.value;

  if (title === "" || author === "" || pages === "" || read === "") {
    return;
  }

  titleInput.value = "";
  authorInput.value = "";
  pageInput.value = "";
  readSelect.value = "";

  const addBookToLibrary = (bookTitle, bookAuthor, bookPages, bookState) => {
    bookTitle = title;
    bookAuthor = author;
    bookPages = pages;
    bookState = read;

    const bookToAdd = new Books(bookTitle, bookAuthor, bookPages, bookState);

    return bookToAdd;
  };

  const secImg = `${imgSelector()}.jpg`
  
  const bookFinal = addBookToLibrary();
  
  const bookCoverImgUrl = `https://firebasestorage.googleapis.com/v0/b/alat-star-odin-library.appspot.com/o/libary-images%2F${imgSelector()}.jpg?alt=media&token=6d203882-f845-4c38-82f2-da0a508b361c`;


 

/*Add document to cloud store database*/

 async function demoCall () {
   await addDoc(collection(db, "books"), {
      title: bookFinal.title,
      author: bookFinal.author,
      image: bookCoverImgUrl,
      page: bookFinal.pages,
      status: bookFinal.read,
      id: uniqid()
  });
  }

  demoCall();

  /*update dom on each addition*/
  getData();
  




});




async function getData () {
 
  const querySnapshot = await getDocs(collection(db, "books"));
  const data = querySnapshot.forEach( (file) => {
    const item = file.data()
    const arr = []
    const allTitles = document.querySelectorAll('.title')
    allTitles.forEach(text => {
      arr.push(text.textContent)
    })

    if (arr.includes(item.title)) {
        return
      }

      /*Add document from database to DOM*/

    const bookDiv = document.createElement("div");
    bookDiv.setAttribute("class", "book-card");
    bookDiv.setAttribute("id", `${file.id}`);
    const cancelBtn = document.createElement("button");
    cancelBtn.setAttribute("class", "cancel");
    cancelBtn.textContent = "❌";
    bookDiv.appendChild(cancelBtn);
    const imgDiv = document.createElement("div");
    imgDiv.setAttribute("class", "img-div");
    const bookImg = document.createElement("img");
    bookImg.setAttribute("src", `${item.image}`);
    imgDiv.appendChild(bookImg);
    bookDiv.appendChild(imgDiv);
    const detailsDiv = document.createElement("div");
    detailsDiv.setAttribute("class", "details-div");
    const titlePara = document.createElement("p");
    titlePara.setAttribute("class", "title");
    const titleTag = document.createElement("h3");
    titleTag.textContent = "Title:";
    titlePara.textContent = `${item.title}`;
    const titleDiv = document.createElement("div");
    titleDiv.appendChild(titleTag);
    titleDiv.appendChild(titlePara);
    const authorPara = document.createElement("p");
    const authorTag = document.createElement("h3");
    authorTag.textContent = "Author:";
    authorPara.textContent = `${item.author}`;
    const authorDiv = document.createElement("div");
    authorDiv.appendChild(authorTag);
    authorDiv.appendChild(authorPara);
    const pagePara = document.createElement("p");
    const pageTag = document.createElement("h3");
    pageTag.textContent = "Pages:";
    pagePara.textContent = `${item.page}`;
    const pageDiv = document.createElement("div");
    pageDiv.appendChild(pageTag);
    pageDiv.appendChild(pagePara);
    const readPara = document.createElement("p");
    const readTag = document.createElement("h3");
    const readLabel = document.createElement("label");
    readLabel.textContent = "Read";
    const readCheck = document.createElement("input");
    readCheck.setAttribute("type", "checkbox");
    const checkDiv = document.createElement("div");
    checkDiv.setAttribute("class", "checkbox");
    checkDiv.appendChild(readLabel);
    checkDiv.appendChild(readCheck);
    readTag.textContent = "Status:";
    readPara.textContent = `${item.read}`;

    const readIf = readPara.textContent;
    if (!readIf.toLowerCase().includes("not")) {
      readCheck.checked = true;
    }

    const readDiv = document.createElement("div");
    readDiv.appendChild(readTag);
    readDiv.appendChild(checkDiv);
    detailsDiv.appendChild(titleDiv);
    detailsDiv.appendChild(authorDiv);
    detailsDiv.appendChild(pageDiv);
    detailsDiv.appendChild(readDiv);
    bookDiv.appendChild(detailsDiv);
    
    grid.appendChild(bookDiv);

    /*delete document from dom and database respectively */

    remove.addEventListener("click", () => {
      const removal = document.querySelectorAll(".cancel");
      removal.forEach((item) => {
        item.setAttribute("style", "transform: rotatex(0deg)");
        item.addEventListener("click", async () => {
          item.parentNode.remove();
           await deleteDoc(doc(db, 'books', item.parentNode.id))
        });
        setTimeout(() => {
          item.setAttribute("style", "transform: rotatex(90deg)");
        }, 10000);
      });
    });

  })
}

getData();




