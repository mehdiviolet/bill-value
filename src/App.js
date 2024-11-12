import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleSelection(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setIsOpen(false);
  }

  const selected = friends.find((fri) => fri.id === selectedFriend?.id);

  function handleBalance(value) {
    console.log(selected);
    // setFriends((fri) =>
    //   fri.id === selected.id ? [...fri, { balance: 100 }] : fri
    // );
    setFriends((fri) =>
      fri.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {isOpen && <FormAddFriend setFriends={setFriends} />}
        <Button onClick={() => setIsOpen((isO) => !isO)} type="button">
          {isOpen ? "close" : "open"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          handleBalance={handleBalance}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, handleSelection, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          handleSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {`${friend.name}`} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}$
        </p>
      )}
      {/* {(friend.balance = 0 && <p>You and {friend.name} are ...</p>)} */}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button type="button" onClick={() => handleSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick, type }) {
  return (
    <button onClick={onClick} className={type}>
      {children}
    </button>
  );
}

function FormAddFriend({ setFriends }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const newFriends = {
      name,
      id: new Date(),
      image: img,
      balance: 0,
    };
    setFriends((init) => [...init, newFriends]);
    setName("");
    setImg("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>😀  Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>📸Image url</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button type="button">Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, handleBalance }) {
  const [bill, setBill] = useState("");
  const [you, setYou] = useState("");
  const [whoPay, setWhoPay] = useState("you");

  const otherExp = bill - you;

  function handleBill(e) {
    e.preventDefault();
    const value = whoPay === "you" ? otherExp : -you;
    handleBalance(value);
    console.log(e);
  }
  return (
    <form className="form-split-bill" onSubmit={handleBill}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label htmlFor="">💸Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label htmlFor="">🕴️Your expense</label>
      <input
        type="text"
        value={you}
        onChange={(e) =>
          setYou(Number(e.target.value) > bill ? you : Number(e.target.value))
        }
      />
      <label htmlFor="">🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={otherExp} />
      <label htmlFor="">🤑 Who is paying bill?</label>
      <select
        name="expense"
        value={whoPay}
        onChange={(e) => setWhoPay(e.target.value)}
      >
        <option value="you">You</option>
        <option value={selectedFriend.name}>{selectedFriend.name}</option>
      </select>
      <Button type="button">Split bill</Button>
    </form>
  );
}
