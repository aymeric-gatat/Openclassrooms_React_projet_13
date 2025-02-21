import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUser, updateUser } from "../Login/authSlice";

const User = () => {
  const dispatch = useDispatch();
  const { token, user, status, error } = useSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser(token));
    }
  }, [token, dispatch, user]);

  useEffect(() => {
    if (user) {
      setFirstName(user.body.firstName);
      setLastName(user.body.lastName);
    }
  }, [user]);

  const openModal = () => setIsOpen(!isOpen);

  const handleSave = async () => {
    dispatch(updateUser({ token, firstName, lastName }));
    setIsOpen(false);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="main bg-dark">
      <div className="header">
        <h1>
          Welcome back
          <br />
          {user ? `${user.body.firstName} ${user.body.lastName}` : ""}
        </h1>
        {!isOpen ? (
          <button className="edit-button" onClick={openModal}>
            Edit Name
          </button>
        ) : (
          <div className="update-container">
            <div className="input-container">
              <input type="text" placeholder="Firstname" onChange={(e) => setFirstName(e.target.value)} />
              <input type="text" placeholder="Lastname" onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="button-container">
              <button className="edit-button" onClick={handleSave}>
                Save
              </button>
              <button className="cancel-button" onClick={openModal}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className="sr-only">Accounts</h2>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Checking (x8349)</h3>
          <p className="account-amount">$2,082.79</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Savings (x6712)</h3>
          <p className="account-amount">$10,928.42</p>
          <p className="account-amount-description">Available Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
      <section className="account">
        <div className="account-content-wrapper">
          <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
          <p className="account-amount">$184.30</p>
          <p className="account-amount-description">Current Balance</p>
        </div>
        <div className="account-content-wrapper cta">
          <button className="transaction-button">View transactions</button>
        </div>
      </section>
    </main>
  );
};

export default User;
