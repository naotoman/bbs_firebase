// Set the configuration for your app
// TODO: Replace with your project's config object
// var config = {
//   apiKey: "",
//   authDomain: "bbs-firebase.firebaseapp.com",
//   databaseURL: "https://bbs-firebase.firebaseio.com/",
//   storageBucket: "https://bbs-firebase.appspot.com"
// };
// firebase.initializeApp(config);

// // Get  reference to the database service
const database = firebase.database()
const ref_posts = database.ref('/posts/');
const ref_num = database.ref("/newest_post_number/");

//CREATEがあった時の処理
ref_posts.orderByChild('number').on('value', (snapshot) => {
  let all_posts = document.getElementById('all-posts');
  let ch = all_posts.lastElementChild;
  while (ch) {
    all_posts.removeChild(ch);
    ch = all_posts.lastElementChild;
  }

  const added_posts = snapshot.val();
  Object.values(added_posts).forEach((val) => {
    display_post_last(val)
  });
  // ref_num.once('value').then((dataSnapshot) => {
  //   display_post_last(added_post, dataSnapshot.val())
  // })
});

function display_post_last(pos) {
  const posts = document.getElementById("all-posts");
  let post = document.createElement('li');
  post.classList.add("container", "border")

  let head = document.createElement('div');
  head.classList.add("post-header", "border");
  head.textContent = pos['number'] + " " + pos['name'] + " " + pos['created_at'];

  let content = document.createElement('pre');
  content.classList.add("post-content", "border");
  content.textContent = pos['content'];

  post.appendChild(head);
  post.appendChild(content);
  if (firebase.auth().currentUser.uid === pos['uid']) {
    let edit_btn = document.createElement('button');
    edit_btn.textContent = "編集";
    edit_btn.addEventListener('click', () => {
      localStorage.edit_num = pos['number'];
      localStorage.edit_item = content.textContent;
      location.href = '/edit.html';
    })

    let delete_btn = document.createElement('button');
    delete_btn.textContent = "削除";
    delete_btn.addEventListener('click', () => {
      ref_posts.orderByChild('number').equalTo(parseInt(pos['number'])).once('value', (snapshot) => {
        key = Object.keys(snapshot.val())[0]
        ref_post = ref_posts.child(key);
        console.log(ref_post.toString());
        console.log(content.value);
        ref_post.remove();
      })
    })
    post.appendChild(edit_btn);
    post.appendChild(delete_btn);
  }
  posts.appendChild(post);
}


const submit_btn = document.getElementById("submit-button");


// 投稿確定ボタンが押された時の処理
function submit_post(txt_input) {
  //データベースに追加
  now_time = new Date().toLocaleString();
  ref_num.once('value').then((dataSnapshot) => {
    const now_num = dataSnapshot.val();
    ref_num.set(now_num + 1);
    ref_posts.push({
      "number": now_num + 1,
      "name": firebase.auth().currentUser.displayName,
      "uid": firebase.auth().currentUser.uid,
      "content": txt_input,
      "created_at": now_time,
      "updated_at": now_time
    });
  })
  //投稿ボタンを表示
  submit_btn.style.visibility = "visible";
}

//投稿ボタンが押された時の処理
submit_btn.addEventListener("click", () => {
  //投稿ボタンを消す
  submit_btn.style.visibility = "hidden";

  //投稿フォームを作る
  const posts = document.getElementById("all-posts");
  let post = document.createElement('li');
  post.classList.add("container", "border")

  let content = document.createElement('textarea');
  content.classList.add("post-content", "border");
  content.placeholder = "入力してください";

  let confirm_btn = document.createElement('button');
  confirm_btn.classList.add("btn", "btn-primary");
  confirm_btn.textContent = "確定";

  post.appendChild(content);
  post.appendChild(confirm_btn);
  posts.appendChild(post);

  // 確定ボタンが押されたときの処理
  confirm_btn.addEventListener("click", () => {
    post.remove();
    submit_post(content.value);
  })
});


//サインアウト
const sign_out_btn = document.getElementById('sign-out-btn');
sign_out_btn.addEventListener('click', () => {
  firebase.auth().signOut().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
  });
});

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('firebaseui-auth-container').style.display = 'none';
  } else {
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: "/index.html",
      callbacks: {
        uiShown: function () {
          // FirebaseUIウィジェット描画完了時のコールバック関数
          // 読込中で表示しているローダー要素を消す
          console.log(document.getElementById('firebaseui-auth-container').style.display)
          // document.getElementById('firebaseui-auth-container').style.visibility = 'hidden';
        }
      }
    });
  }
})
