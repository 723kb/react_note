import React, { useState, useEffect } from 'react';

import './App.css';

const App = () => {
  // 新しいノートの配列を格納する変数を関数の上に定義
  // setは更新関数
  // 新しいノートを追加するごとにノートのオブジェクトが入る
  const [notes, setNotes] = useState([]); // 初期値は空の配列
  // ノートが選択されるようにする処理
  const [selectedNote, setSelectedNote] = useState(null); // 初期値は何も選択なし(null)
  // ノートのテキストが変更されて表示させるようにする処理
  const [editedText, setEditedText] = useState(""); // 初期値は空の文字列

  // 初回レンダリング時にlocalStorageからデータを取得
useEffect(() => {
  const savedNotes = localStorage.getItem("notes");
  console.log("Saved Notes:", savedNotes); // ローカルストレージから取得したノートを確認する
  if (savedNotes && JSON.stringify(notes) !== savedNotes) {
    setNotes(JSON.parse(savedNotes));
  }
}, []); // 初回のみ実行される



  // notesが更新されるたびにlocalStorageにデータを保存
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

    // useEffectフックを使用して、notesステートが更新されたタイミングでローカルストレージにデータを保存
    useEffect(() => {
      localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

  
  // 関数の定義はreturn文の上にアロー関数で書く
  // ノートを追加する関数 (handleNoteAdd)
  const handleNoteAdd = () => {
    // 新しいオブジェクトの作成
    const newNote = {
      id: Date.now(), // かぶらない値を設定
      text: "新規ノート️", // 初期値
    };
    console.log(newNote);
    // 取得したオブジェクトを配列に格納
    // スプレッド構文(...) notes配列(初期値は空)を展開しnewNoteを代入
    setNotes([...notes, newNote]); // setNotesにすることでStateに値が入る
    setSelectedNote(newNote); // selectedNoteに新しく追加したノートの情報が入る
    setEditedText(newNote.text); // editedTextの中にnewNoteのテキストが入る
  };

  // ノートを操作する関数 (handleSelect)
  const handleSelect = (note) => {
    console.log("Selected Note:", note); // note パラメータを確認する
    setSelectedNote(note); // setSelectedNoteに送られてきたnoteの情報を入れるとスタイルが適用される
    setEditedText(note.text); // setEditedTextに選択されたnoteのtextを入れる
  };

  // ノートを削除する関数 (handleDelete)
  const handleDelete = (noteId) => { // 引数にnoteIdを入れて受け取る
    console.log(noteId);
    // notesのstateをnoteの1つ1つとしてfilterし変数に格納
    // 1つ1つ展開されたnoteのidとユーザーが指定した削除したいもの(noteId)が一致しないものを取得
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    console.log(filteredNotes);
    setNotes(filteredNotes); // フィルタリングされたものをstate管理する

    // 削除後に前のノートにハイライトを当てる処理(配列内にノートがある場合に以下実行)
    // filteredNotesには削除ボタンが押された後の配列の中身が入ってる
    if (filteredNotes.length > 0) {
      // 削除後に残っている配列の中身を指定 filteredNotes.length:最後の要素 配列は0始まりのため-1する
      const lastNote = filteredNotes[filteredNotes.length - 1];
      setSelectedNote(lastNote); // stateにセット
      setEditedText(lastNote.text); // 削除後に残ったノートのテキストをセット
    } else { // 配列の中身がない場合
      setSelectedNote(null);
      setEditedText(""); // テキストエリアをクリア
    }
  };

  // ノートを編集する関数 (handleChange)
  const handleChange = (e) => { // 引数にe(イベント）を入れてユーザーが入力した内容を受け取る
    console.log(e.target.value);
    setEditedText(e.target.value); // setEditedTextに入れる→editedTextのstateに格納される
  };

  // ノートを保存する関数 (handleSave)
  const handleSave = () => {
    const updatedNotes = notes.map((note) => {
      if (note.id === selectedNote.id) {
        return { ...note, text: editedText };
      }
      return note;
    });
    console.log(updatedNotes);
    setNotes(updatedNotes);
    console.log("Updated Notes in localStorage:", JSON.parse(localStorage.getItem("notes")));

  };

  return (
    <div className="app-container">
      {/* サイドバー */}
      <div className="sidebar">
        {/*  onClickトリガーを利用して{}内の関数を呼び出す */}
        <button id="create" onClick={handleNoteAdd}>ノート追加</button>
        <ul>
          {/* return文の中でデータを利用したいときは{}で囲む */}
          {/* 配列の中身をmap関数で1つずつ展開→展開されたものをnoteとして展開 */}
          {notes.map((note) => (
            // selectedNoteのidが1つずつ展開されたnoteのidと同じであればselectedのクラス名を falseなら何もつけない
            <li key={note.id}
              className={selectedNote?.id === note.id ? 'selected' : ""}>
              {/* どのノートを削除するかわかるようにnoteのidを引数に入れる */}
              <button onClick={() => handleDelete(note.id)} className="delete">削除</button>
              {/* 関数を定義する前にどのノートの情報がほしいのか(=選択されたノートの情報)を引数に入れる */}
              <span onClick={() => handleSelect(note)}>{note.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* メインエリア */}
      <div className="main">
        {/* selectedNoteが存在する場合の処理(:の前まで) */}
        {selectedNote ? (
          <>
            <h2>内容</h2>
            {/* onChangeトリガーを使って関数を呼び出す */}
            <textarea value={editedText} onChange={handleChange} />
            <button onClick={handleSave} className="save">保存</button>
          </>
        ) : (
          <div>ノートを作成してください</div>
        )}
      </div>
    </div>
  );
};

export default App;

