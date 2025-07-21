import React, { useEffect, useState } from 'react';

const SHEET_ID = '1CRoqK3szGdhIIlXG0gKA9BhjmRROmNba0tlur2V7qnM';
const API_KEY = 'AIzaSyBZchFlW_joIa7CnSSacm8oalKQqYayhyk';
const RANGE = 'Points!A8:M';

function sanitizeItemName(name) {
  return name?.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ /g, '_');
}

function TeamPage({ team }) {
  const [items, setItems] = useState([]);
  const [filterBoss, setFilterBoss] = useState("All");

  const teamColumnIndex = {
    Team1: 7, Team2: 8, Team3: 9, Team4: 10, Team5: 11, Team6: 12
  }[team];

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
      .then(res => res.json())
      .then(json => {
        const rows = json.values || [];
        const cleaned = [];
        let currentBoss = null;

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (row[3] && !/max points/i.test(row[3])) currentBoss = row[3];

          const itemName = row[4];
          const points = parseFloat(row[5]) || 0;

          // Skip junk rows: empty names, 0 points, or numeric-only "items"
          if (!itemName || /^\d+$/.test(itemName.trim()) || points === 0) continue;

          cleaned.push({
            boss: currentBoss,
            name: itemName,
            points: points,
            collected: row[teamColumnIndex],
            image: `/items/${sanitizeItemName(itemName)}.webp`
          });
        }

        setItems(cleaned);
      });
  }, [team, teamColumnIndex]);

  const uniqueBosses = ["All", ...new Set(items.map(item => item.boss))];
  const visibleItems = filterBoss === "All" ? items : items.filter(item => item.boss === filterBoss);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{team} — Item Progress</h1>
      <div className="mb-4">
        <label className="mr-2">Filter by Boss:</label>
        <select value={filterBoss} onChange={(e) => setFilterBoss(e.target.value)} className="p-2 rounded bg-gray-800 text-white">
          {uniqueBosses.map(boss => (
            <option key={boss} value={boss}>{boss}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {visibleItems.map((item, idx) => (
          <div key={idx} className="bg-gray-900 p-4 rounded shadow">
            <img
              src={item.image}
              alt={item.name}
              className="w-8 h-8 inline-block mr-2"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://oldschool.runescape.wiki/images/${item.name.replace(/ /g, '_')}_detail.png`; }}
            />
            <div className="text-lg font-semibold">{item.name}</div>
            <div className="text-sm text-gray-400">{item.boss} — {item.points} pts</div>
            <div className={item.collected ? 'text-green-400' : 'text-red-500'}>
              {item.collected ? '✓ Collected' : '✗ Missing'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPage;
