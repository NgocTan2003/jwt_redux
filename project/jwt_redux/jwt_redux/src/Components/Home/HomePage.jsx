import { useDispatch } from "react-redux";
import "./home.css";
import { useEffect, useState } from "react";
import { deleteUser, getAllUsers } from "../../redux/apiRequest";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import Cookies from 'js-cookie';

const HomePage = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [role, setRole] = useState("")
  // gọi từ store.js -> userSlice.js 
  const userList = useSelector((state) => state.users.users?.allUsers);
  const deleteMsg = useSelector((state) => state.users?.msg)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      navigate("/login");
    } else {
      // Decode payload từ accessToken
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setRole(userRole);

      getAllUsers(dispatch);
    }
  }, [dispatch, navigate]);


  const handleDelete = (id) => {
    deleteUser(dispatch, id)
  };

  // optional chaining: userList?
  return (
    <main className="home-container">
      <div className="home-title">User List</div>
      <div>Role: {role}</div>
      <div className="home-userlist">
        {userList?.map((user, index) => {
          return (
            <div className="user-container" key={`user-${index}`}>
              <div className="home-user">{user.userName}</div>
              <div className="delete-user" onClick={() => handleDelete(user.id)}> Delete </div>
            </div>
          );
        })}
      </div>
      {user && <span className="text-danger">{user.message}</span>}
      <div className="text-danger">{deleteMsg.message}</div>
    </main>
  );
};

export default HomePage;
