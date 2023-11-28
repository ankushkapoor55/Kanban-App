import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './kanbanBoard.css';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status');
  const [sortOption, setSortOption] = useState('priority');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
      setTickets(response.data.tickets);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDisplay = async (option) => {
    setGroupingOption(option);
  };

  const handleSort = (option) => {
    setSortOption(option);
  };

  const renderTickets = () => {
    let groupedTickets = {};

    
    if (groupingOption === 'status') {
      groupedTickets = groupByStatus();
    } else if (groupingOption === 'user') {
      groupedTickets = groupByUser();
    } else if (groupingOption === 'priority') {
      groupedTickets = groupByPriority();
    }

   
    if (sortOption === 'priority') {
      Object.keys(groupedTickets).forEach((key) => {
        groupedTickets[key].sort((a, b) => b.priority - a.priority);
      });
    } else if (sortOption === 'title') {
      Object.keys(groupedTickets).forEach((key) => {
        groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
      });
    }

    
    return Object.keys(groupedTickets).map((groupKey) => (
      <div key={groupKey} className='ticket'>
        <h2>{groupKey}</h2>
        <ul>
          {groupedTickets[groupKey].map((ticket) => (
            <li key={ticket.id}>
              {ticket.title} - Priority: {ticket.priority}
            </li>
          ))}
        </ul>
      </div>
    ));
  };

  const groupByStatus = () => {
    
    const grouped = {};
    tickets.forEach((ticket) => {
      if (!grouped[ticket.status]) {
        grouped[ticket.status] = [];
      }
      grouped[ticket.status].push(ticket);
    });
    return grouped;
  };

  const groupByUser = () => {
    
    const grouped = {};
    tickets.forEach((ticket) => {
      if (!grouped[ticket.user]) {
        grouped[ticket.user] = [];
      }
      grouped[ticket.user].push(ticket);
    });
    return grouped;
  };

  const groupByPriority = () => {
   
    const grouped = {};
    tickets.forEach((ticket) => {
      if (!grouped[ticket.priority]) {
        grouped[ticket.priority] = [];
      }
      grouped[ticket.priority].push(ticket);
    });
    return grouped;
  };

  return (
    <div>
      <div>
        <button onClick={() => handleDisplay('status')}>Group by Status</button>
        <button onClick={() => handleDisplay('user')}>Group by User</button>
        <button onClick={() => handleDisplay('priority')}>Group by Priority</button>
      </div>
      <div>
        <button onClick={() => handleSort('priority')}>Sort by Priority</button>
        <button onClick={() => handleSort('title')}>Sort by Title</button>
      </div>
      <div>
        {renderTickets()}
      </div>
    </div>
  );
};

export default KanbanBoard;
