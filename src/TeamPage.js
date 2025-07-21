import { Card, CardContent } from './components/ui/card';

import React, { useEffect, useState } from 'react';

const SHEET_ID = '1CRoqK3szGdhIIlXG0gKA9BhjmRROmNba0tlur2V7qnM';
const API_KEY = 'AIzaSyBZchFlW_joIa7CnSSacm8oalKQqYayhyk';
const RANGE = 'Points!A8:M';

function sanitizeItemName(name) {
  return name?.replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/ /g, '_');
}

function TeamPage({ team }) {
  const [items, setItems] = useState([]);
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

          if (currentBoss && row[4]) {
            const points = parseFloat(row[5]) || 0;
            const gotDrop = row[teamColumnIndex]?.trim() === '1';
            const item = row[4];
            const itemImage = `https://oldschool.runescape.wiki/images/${sanitizeItemName(item)}_detail.png`;

            cleaned.push({
              boss: currentBoss,
              item,
              points,
              gotDrop,
              image: itemImage,
            });
          }
        }

        setItems(cleaned);
      });
  }, [team]);

  const [bossFilter, setBossFilter] = useState('all');
    return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">{team} – Item Progress</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded shadow bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.item}
                className="w-10 h-10 object-contain"
                onError={(e) => (e.target.src = 'https://oldschool.runescape.wiki/images/Unknown_detail.png')}
              />
              <div>
                <div className="font-semibold">{item.item}</div>
                <div className="text-sm text-gray-500">{item.boss} — {item.points} pts</div>
                <div className={item.gotDrop ? 'text-green-500' : 'text-red-500'}>
                  {item.gotDrop ? '✓ Collected' : '✗ Missing'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPage;
