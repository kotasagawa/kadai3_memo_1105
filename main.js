


{
  const start = document.getElementById("js-start");
  const stop = document.getElementById("js-stop");
  const reset = document.getElementById("js-reset");
  const comment = document.getElementById("js-comment");
  const countTimer = document.getElementById("js-count-timer");
  const restPopup = document.getElementById("js-rest-popup");
  const rest = document.getElementById("js-rest-btn");
  const finish = document.getElementById("js-finish-btn");
  const restartPopup = document.getElementById("js-restart-popup");
  const restart = document.getElementById("js-restart-btn");
  const totalTime = document.getElementById("js-total-time");
  const audio = document.getElementById("js-audio");


  let startTime;
  let timeLimit = 25; //25に戻すこと
  let timeoutId;
  let elapsedTime = 0;
  let num = 0;
  let pomo_num = 0;

  // タイマーを画面に書き出す処理
  function updateTimer(t) {
    const d = new Date(t);
    const m = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    countTimer.textContent = `${m}:${s}`;
  }

  // タイマーのカウントダウンの処理
  function countDown() {
    const runningTime =
      timeLimit * 60 * 1000 - elapsedTime - (Date.now() - startTime);

    if (runningTime < 0) {
      clearTimeout(timeoutId);


      pomo_num++;
      document.getElementById('pomo_number').textContent = pomo_num;

      initButtonState();
      elapsedTime = 0;
      audio.play();
      switch (timeLimit) {
        case 5: 
          restartPopup.classList.add("show");
          break;
        case 25: 
          calcTime();
          restPopup.classList.add("show");
          break;
      }
      return;
    }
    updateTimer(runningTime);

    timeoutId = setTimeout(() => {
      countDown();
    }, 100);
  }

  // 合計時間の算出
  function calcTime() {
    ++num;
    const calcTime = timeLimit * num;
    totalTime.textContent = `Total: ${calcTime}分`;
  }

  // ボタンを押したら音を止める処理
  function stoppedSound() {
    audio.pause();
    audio.currentTime = 0;
  }

  // 最初のボタンの状態
  function initButtonState() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = true;
    start.style.opacity = 1;
    stop.style.opacity = 0.4;
    reset.style.opacity = 0.4;
  }

  // カウント中のボタンの状態
  function setButtonStateRunning() {
    start.disabled = true;
    stop.disabled = false;
    reset.disabled = true;
    start.style.opacity = 0.4;
    stop.style.opacity = 1;
    reset.style.opacity = 0.4;
  }

  // カウントダウンが止まっている時のボタンの状態
  function setButtonStateStopped() {
    start.disabled = false;
    stop.disabled = true;
    reset.disabled = false;
    start.style.opacity = 1;
    stop.style.opacity = 0.4;
    reset.style.opacity = 1;
  }

  initButtonState();

  // Startボタンを押した時の処理
  start.addEventListener("click", () => {
    setButtonStateRunning();
    startTime = Date.now();
    countDown();
    comment.textContent = "Working...";
  });

  // Stopボタンを押した時の処理
  stop.addEventListener("click", () => {
    clearTimeout(timeoutId);
    setButtonStateStopped();
    elapsedTime += Date.now() - startTime;
    comment.textContent = "Stop";
  });

  // Resetボタンを押した時の処理
  reset.addEventListener("click", () => {
    initButtonState();
    elapsedTime = 0;
    num = 0;
    timeLimit = 25; 
    countTimer.textContent = `${timeLimit}:00`;
    comment.textContent = "Click Start";
  });

  // 休憩するボタンを押した時の処理
  rest.addEventListener("click", () => {
    restPopup.classList.remove("show");
    stoppedSound();
    timeLimit = 5;
    countTimer.textContent = `${timeLimit}:00`;
    start.click();
    comment.textContent = "Rest Time";
  });

  // 終了するボタンを押した時の処理
  finish.addEventListener("click", () => {
    restPopup.classList.remove("show");
    stoppedSound();
    num = 0;
    countTimer.textContent = `${timeLimit}:00`;
    comment.textContent = "Click Start";
  });

  // 再開するボタンを押した時の処理
  restart.addEventListener("click", () => {
    restartPopup.classList.remove("show");
    stoppedSound();
    timeLimit = 25;
    countTimer.textContent = `${timeLimit}:00`;
    start.click();
    comment.textContent = "Working...";
  });

}

{
  //todoリスト作成

  //変数
  const todoValue = document.getElementById("js-todo-ttl");//入力欄を取得
  const todoRegister = document.getElementById("js-register-btn"); //登録するボタン取得
  const todoDelete = document.getElementById("js-del-btn"); //削除ボタンのid取得
  const todoList = document.getElementById("js-todo-list"); //未完了リストのul取得
  const doneList = document.getElementById("js-done-list"); //完了リストのul取得
  const todoAllRemove = document.getElementById("js-allremove-btn");//すべてのタスクを削除するボタン取得
  let listItems = []; //データを入れる箱を作る
  const storage = localStorage;
  let nowTime = new Date();
  let nowMin = nowTime.getMinutes();
  let nowSec = nowTime.getSeconds();
  let msg = nowMin + ":" + nowSec;
  const takibi = document.getElementById("sound_btn");
  const takibi_music = new Audio('audio/takibi.mp3');


  todoRegister.addEventListener('click', () => {
    if (todoValue.value !== '') { //入力値が空でなかったら

      const registeredValue = listItems.find(
        (item) => item.todoValue == todoValue.value
      );

      document.getElementById('registerbtn_audio').play(); //登録ボタンを押したら「完了音」を出す

      if (registeredValue === undefined) {

        //追加した
        const item = { //タスクのデータをオブジェクト形式で保存する箱を作る　
          todoValue: todoValue.value, //todoValueというプロパティで、todoValue.valueを値として保存
          isDone: false, //isDoneというプロパティにfalseを保存。完了したかどうかを判断
          isDeleted: false //isDeletedというプロパティにfalseを保存。削除したかどうかを判断

        };
        listItems.push(item); // 保存したデータを配列listItemsにpushで配列要素を追加
        storage.store = JSON.stringify(listItems);

        const todo = document.createTextNode(todoValue.value); //入力データを取得

        todoValue.value = ''; //フォームを初期状態（空）にする
        const litag = document.createElement('li'); //liタグを作る準備
        const ptag = document.createElement('p'); //pタグを作る準備

        //ul>li>p構造を作る
        ptag.appendChild(todo); //pタグの子要素に登録データを挿入
        litag.appendChild(ptag); //liタグの子要素にpタグを挿入
        todoList.appendChild(litag); //ulタグの子要素にliタグを挿入

        //ボタンを入れるdiv要素追加
        const btn_box = document.createElement('div'); //divタグの準備
        btn_box.setAttribute('class', 'btn-box'); //class名の指定
        litag.appendChild(btn_box); //liタグの子要素に挿入

        //完了ボタン追加
        const donebtn = document.createElement('button'); //buttonタグの準備
        donebtn.setAttribute('id', 'js-done-btn'); //buttonタグにid指定
        donebtn.innerHTML = 'Done'; //ボタンに完了の文字を入れる

        donebtn.setAttribute('onclick', 'audio()'); //onclickのaudioを追加する

        btn_box.appendChild(donebtn); //liタグの子要素に挿入

        //削除ボタン追加
        const delbtn = document.createElement('button'); //buttonタグの準備
        delbtn.setAttribute('id', 'js-del-btn'); //buttonタグにid指定
        delbtn.innerHTML = 'Delete'; //ボタンに削除の文字を入れる

        delbtn.setAttribute('onclick', 'audio()');//onclickのaudioを追加する

        btn_box.appendChild(delbtn); // liタグの子要素に挿入

          //削除機能追加
          delbtn.addEventListener('click', () => {
          deleteTodo(delbtn);
          document.getElementById('cancelbtn_audio').play(); //削除ボタンを押したら「完了音」を出す
          });

          //完了機能追加
          donebtn.addEventListener('click', () => {
            doneTodo(donebtn);
            document.getElementById('donebtn_audio').play(); //完了ボタンを押したら「完了音」を出す
          });

      } else {
        alert("タスクが重複しているため登録できません。別の名前で登録してください。");
      }


} //消さない
}); //消さない

todoAllRemove.addEventListener("click", () => {
  const allrmconfirm = this.confirm(
    "【重要!!】本当にすべてのタスクを削除しますか？削除したデータは復元できません。"
  );
  if (allrmconfirm) {
    delete storage.store;
    location.reload();
    document.getElementById('cancelbtn_audio').play(); //削除ボタンを押したら「完了音」を出す
  }
});

// 焚き火sound
takibi.addEventListener("click", () => {
  takibi_music.play();
  takibi_music.loop = true; //soundボタンを押したら「完了音」を出す
});


//削除プログラム
const deleteTodo = (delbtn) => { //引数に削除ボタンを指定する
  const delconfirm = this.confirm('本当に削除しますか？'); 
  if (delconfirm === true) { //もし最終確認でOKが押されたら
      const choseTodo = delbtn.closest('li'); //押された削除ボタンから見て1番近いliタグを取得

      //削除が押されたアイテムがtodoリスト内かdoneリスト内かで処理を変える条件分岐
        if (choseTodo.classList.contains('done-item')) { //liタグにdone-itemクラスがあれば
          doneList.removeChild(choseTodo); //doneListの中の該当liタグを削除（右側Doneリスト内で削除を行う）
      } else { //条件に一致しない場合は
        todoList.removeChild(choseTodo); //todoListの中の該当liタグを削除（左側DToDoリスト内で削除を行う）
      }

      const delbtnDiv = delbtn.closest("div");
      const delTodoTxt = delbtnDiv.previousElementSibling;
      const delValue = listItems.find(
        (item) => item.todoValue === delTodoTxt.textContent
      );
      delValue.isDeleted = true;
      const newlistItems = listItems.filter((item) => item.isDeleted === false); //.filterメソッドでisDeletedプロパティがfalseのデータを取得して定数に入れる
      listItems = newlistItems; //削除されていないデータだけが残った配列をlistItemに入れる
      storage.store = JSON.stringify(listItems);

  }
}


//完了プログラム
const doneTodo = (donebtn) => {
  const doneTodo = donebtn.closest('li'); //完了ボタンから1番近いliタグを取得
  doneTodo.setAttribute('class', 'done-item');
  doneList.appendChild(doneTodo); //Doneリストの子要素に取得したliタグを挿入

  const donebtnDiv = donebtn.closest("div"); //押された完了ボタンから1番近いdiv要素を取得
  const doneTodoTxt = donebtnDiv.previousElementSibling; // donebtnDivで取得したdiv要素の前の要素を取得
  const doneValue = listItems.find(   //listItems配列の中から一致するオブジェクトを探して定数に入れる
    (item) => item.todoValue === doneTodoTxt.textContent
  ); //tem.todoValue（オブジェクトのtodoValueプロパティの値）とdoneTodoTxt.textContent（pタグの文字列）が一致するオブジェクトを探す


    doneValue.isDone = true; //isDoneプロパティをtrueに変更
    storage.store = JSON.stringify(listItems); //ローカルストレージに保存

  donebtn.remove(); //完了ボタンは削除

      // ランダムでアイテム表示
      const imageArea = document.getElementById('imageArea');
      const img = [
        "data:image/png;base64,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",
        "img/beer.png",
        "img/car.png",
        "img/crab.png",
        "img/ramen.png",
        "img/risu.png",
      ];
      const random = Math.floor( Math.random() * img.length );
      const output = '<img src=' + img[random] + ' style="width:50px" id="imagesave">';
      $("#imageArea").append(output)




}

  //リロードでローカルストレージのデータを表示↓↓
  document.addEventListener("DOMContentLoaded", () => {
    const json = storage.store;
    if (json === undefined) { //ローカルストレージにデータがないときは
      return; //returnでイベント終了
    }
    listItems = JSON.parse(json);

for (const item of listItems) {
        const todo = document.createTextNode(item.todoValue);

        const litag = document.createElement('li'); //liタグを作る準備
        const ptag = document.createElement('p'); //pタグを作る準備

        //ul>li>p構造を作る
        ptag.appendChild(todo); //pタグの子要素に登録データを挿入
        litag.appendChild(ptag); //liタグの子要素にpタグを挿入

        if (item.isDone === false) {
          todoList.appendChild(litag);//ulタグの子要素にliタグを挿入
        } else {
          doneList.appendChild(litag);
          litag.setAttribute("class", "done-item");
        }
        //ボタンを入れるdiv要素追加
        const btn_box = document.createElement('div'); //divタグの準備
        btn_box.setAttribute('class', 'btn-box'); //class名の指定
        litag.appendChild(btn_box); //liタグの子要素に挿入

        if (item.isDone === false) {
          //完了ボタン追加
          const donebtn = document.createElement('button'); //buttonタグの準備
          donebtn.setAttribute('id', 'js-done-btn'); //buttonタグにid指定
          donebtn.innerHTML = 'done'; //ボタンに完了の文字を入れる
          btn_box.appendChild(donebtn); //liタグの子要素に挿入
            //完了機能追加
            donebtn.addEventListener('click', () => {
              doneTodo(donebtn);
            });
        }

        //削除ボタン追加
        const delbtn = document.createElement('button'); //buttonタグの準備
        delbtn.setAttribute('id', 'js-del-btn'); //buttonタグにid指定
        delbtn.innerHTML = 'Delete'; //ボタンに削除の文字を入れる
        btn_box.appendChild(delbtn); // liタグの子要素に挿入

        //削除機能追加
        delbtn.addEventListener('click', () => {
        deleteTodo(delbtn);
        });

          //リロードでローカルストレージのデータを表示↑↑


    }
});



}

