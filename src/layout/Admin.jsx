import './Admin.css'
import {useState} from 'react';
import Dashboard from '../components/Admin/Dashboard';
import Staffs from '../components/Admin/Staffs';
import Reports from '../components/Admin/Reports';
import Menu_Edit from '../components/Admin/Menu_Edit';
import OrderList from '../components/Admin/OrderList';

export default function Admin(){
    const [activeItem, setActiveItem] = useState('Dashboard');
    const [activeComponent, setActiveComponent] = useState(<Dashboard />);
    const navItems = [
      { name: "Dashboard", emoji: "🏠", route: <Dashboard /> },
      { name: "Staffs", emoji: "🛠️", route: <Staffs /> },
      { name: "Order-List", emoji: "🧾", route: <OrderList/>},
      { name: "Reports", emoji: "📝", route: <Reports /> },
      { name: "Menu-Edit", emoji: "🍴", route: <Menu_Edit /> },
    ];
    return (
      <>
        <div className="container">
          <div className="sidebar">
            <ul className="sidebar-list">
              {navItems.map((item) => (
                <li
                  key={item.name}
                  className={activeItem === item.name ? "active" : ""}
                  onClick={() => setActiveItem(item.name) & setActiveComponent(item.route)}
                >
                  <span className="icon">{item.emoji}</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div class="main">
            {activeComponent}
          </div>
        </div>
      </>
    );
}